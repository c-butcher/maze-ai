function MazeSolver(maze) {
    this.population = [];
    this.graveyard = [];
    this.populationSize = 200;
    this.mutationRate = 0.01;
    this.generation = 0;
    this.length = (maze.width / maze.nodeSize) * (maze.height / maze.nodeSize);
    this.maze = maze;
    this.start = createVector();
    this.finish = createVector();

    this.findStartAndFinish();

    for (let i = 0; i < this.populationSize; i++) {
        this.population.push(new Organism(this.createDNA()));
    }
}

MazeSolver.prototype.findStartAndFinish = function() {
    for (let row = 0; row <= this.maze.width / this.maze.nodeSize; row++) {
        for (let column = 0; column <= this.maze.height / this.maze.nodeSize; column++) {
            let x = (row * this.maze.nodeSize) - this.maze.nodeSize / 2;
            let y = (column * this.maze.nodeSize) - this.maze.nodeSize / 2;

            let color = this.maze.image.get(x, y);

            if (this.maze.startColor.matches(color)) {
                this.start = createVector(x, y);

            } else if (this.maze.finishColor.matches(color)) {
                this.finish = createVector(x, y);
            }
        }
    }
};

MazeSolver.prototype.advance = function() {
    for (let i = 0; i < this.population.length; i++) {
        if (this.population[i].isAtPosition(this.population[i].target)) {
            this.fitness(this.population[i]);
        }

        if (this.isAlive(this.population[i])) {
            this.population[i].update();
            this.population[i].render();
        } else {
            this.graveyard.push(this.population.splice(i, 1).pop());
            i--;
        }
    }

    return this.population.length > 0;
};

MazeSolver.prototype.createDNA = function() {
    let genes = [];
    for (let i = 0; i < this.length; i++) {
        genes.push(this.materials.next(genes[i-1]));
    }

    return new DNAStrain(this.materials.all(), this.length, genes);
};

MazeSolver.prototype.mate = function(organism1, organism2) {
    if (organism1.dna.length !== organism2.dna.length) {
        throw new Error("Cannot cross two DNA strains with different lengths.");
    }

    let dna1 = organism1.dna;
    let dna2 = organism2.dna;

    let baby = [];
    let diverged = false;
    for (let i = 0; i < this.length; i++) {
        if (dna1.get(i) === dna2.get(i)) {
            baby.push(dna1.get(i));
            diverged = true;

        } else if (diverged) {
            diverged = false;
            if (baby.pop()) {
                i--;
                baby.push(this.materials.next(baby[i-1]));
            }

        } else {
            baby.push(this.materials.next(baby[i-1]));
        }
    }

    let dna = new DNAStrain(this.materials.all(), this.length, baby);

    return new Organism(dna);
};

MazeSolver.prototype.isAlive = function(organism) {
    let color = this.maze.image.get(organism.position.x, organism.position.y);
    return color.toString() !== this.maze.wallColor.levels.toString();
};

MazeSolver.prototype.repopulate = function() {
    let pool = [];
    // Add organisms to the gene pool.

    this.graveyard.splice(0, Math.floor(this.graveyard.length / 2));
    for (let organism of this.graveyard) {
        let donations = organism.fitness * 100;
        for (let sperm = 0; sperm < donations; sperm++) {
            pool.push(organism);
        }
    }

    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
        let parentOne = pool[Math.floor(Math.random() * pool.length)];
        let parentTwo = pool[Math.floor(Math.random() * pool.length)];

        let baby = this.mate(parentOne, parentTwo);

        this.population.push(baby);
    }

    this.graveyard = [];
    this.generation++;
};

MazeSolver.prototype.fitness = function(organism) {
    let x = Math.round(((organism.position.x + this.maze.nodeSize / 2) / this.maze.nodeSize) - 1);
    let y = Math.round(((organism.position.y + this.maze.nodeSize / 2) / this.maze.nodeSize) - 1);

    let position = organism.dna.getCurrentNumber();
    if (this.maze.pathToFinish[position].toString() === [x, y].toString()) {
        organism.fitness += position / this.maze.pathToFinish.length;

    } else {
        organism.fitness -= position / this.maze.pathToFinish.length;
    }
};

MazeSolver.prototype.materials = {
    UP: new p5.Vector(0, -1),
    DOWN: new p5.Vector(0, 1),
    LEFT: new p5.Vector(-1, 0),
    RIGHT: new p5.Vector(1, 0),
    all: function() {
        return [
            this.UP,
            this.DOWN,
            this.LEFT,
            this.RIGHT,
        ]
    },
    next: function(previous) {
        let materials = this.all();

        switch (previous) {
            case this.UP:
                materials.splice(1, 1);
                break;

            case this.DOWN:
                materials.splice(0, 1);
                break;

            case this.LEFT:
                materials.splice(3, 1);
                break;

            case this.RIGHT:
                materials.splice(2, 1);
                break;
        }

        return materials[Math.floor(Math.random() * materials.length)];
    }
};


p5.Color.prototype.matches = function(color) {
    if (Array.isArray(color)) {
        return this.levels.toString() === color.toString();
    }

    if (color instanceof p5.Color) {
        return this.levels.toString() === color.levels.toString();
    }

    return false;
};
