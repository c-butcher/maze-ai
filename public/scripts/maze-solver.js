function MazeSolver(maze) {

    /**
     *
     * @type {Organism[]}
     */
    this.population = [];

    /**
     *
     * @type {Organism[]}
     */
    this.queue = [];

    /**
     *
     * @type {Organism[]}
     */
    this.graveyard = [];
    this.populationSize = 100;
    this.totalOrganisms = 0;
    this.generation = 0;
    this.mutationRate = 0.01;
    this.length = (maze.getWidth() / maze.getNodeSize()) * (maze.getHeight() / maze.getNodeSize());
    this.maze = maze;
    this.releaseTime = 100;
    this.start = createVector();
    this.finish = createVector();
    this.isReleasing = false;

    this.findStartAndFinish();
    this.fittest = new Organism({
        dna: this.createDNA(),
        position: this.start.copy(),
        velocity: createVector(),
        stepDistance: this.maze.getNodeSize(),
        size: Math.round(this.maze.getNodeSize() / 4)
    });
}

MazeSolver.prototype.findStartAndFinish = function() {
    let nodeSize = this.maze.getNodeSize();
    
    for (let row = 0; row <= this.maze.getWidth() / nodeSize; row++) {
        for (let column = 0; column <= this.maze.getHeight() / this.maze.getNodeSize(); column++) {
            let x = (row * this.maze.getNodeSize()) - this.maze.getNodeSize() / 2;
            let y = (column * this.maze.getNodeSize()) - this.maze.getNodeSize() / 2;

            let color = this.maze.getImage().get(x, y);

            if (this.maze.getStartColor().matches(color)) {
                this.start = createVector(x, y);

            } else if (this.maze.getFinishColor().matches(color)) {
                this.finish = createVector(x, y);
            }
        }
    }
};

MazeSolver.prototype.advance = function() {
    for (let i = 0; i < this.population.length; i++) {
        this.population[i].update();

        if (this.isAlive(this.population[i])) {
            this.population[i].update();
            this.population[i].render();
        } else {
            this.graveyard.push(this.population.splice(i, 1).pop());
            i--;
        }
    }

    fill(0);
    textSize(16);
    stroke(255);
    strokeWeight(4);
    textAlign(CENTER, CENTER);
    text("Generation: " + this.generation, width / 2, height / 2);

    return this.population.length > 0;
};

MazeSolver.prototype.createDNA = function() {
    let genes = [];
    for (let i = 0; i < this.length; i++) {
        genes.push(this.materials.next(genes[i-1]));
    }

    return new DNAStrain(this.materials.all(), this.length, genes);
};

/**
 *
 * @param {Organism} parentOne
 * @param {Organism} parentTwo
 *
 * @returns {Organism}
 */
MazeSolver.prototype.mate = function(parentOne, parentTwo) {
    let genesOne = parentOne.dna.genes.slice();
    let genesTwo = parentTwo.dna.genes.slice();
    let baby = parentOne.dna.genes.slice();
    let diverged = false;

    for (let i = 0; i < genesOne.length; i++) {
        if (Math.random() < this.mutationRate) {
            baby[i] = this.materials.next(baby[i - 1]);
            diverged = true;

        } else if (!diverged && genesOne[i].equals(genesTwo[i])) {
            baby[i] = genesOne[i];

        } else {
            baby[i] = this.materials.next(baby[i - 1]);
        }
    }

    let strain = new DNAStrain(this.materials.all(), this.length, baby);

    return new Organism({
        dna: strain,
        position: this.start.copy(),
        velocity: createVector(),
        stepDistance: this.maze.getNodeSize(),
        size: Math.round(this.maze.getNodeSize() / 4)
    });
};

MazeSolver.prototype.isAlive = function(organism) {
    let color = this.maze.getImage().get(organism.position.x, organism.position.y);
    return color.toString() !== this.maze.getWallColor().levels.toString();
};

MazeSolver.prototype.populate = function() {
    this.isReleasing = false;

    let nodeSize = this.maze.getNodeSize();

    /**
     * Calculate the average fitness of all the organisms in the graveyard.
     *
     * @param {Number} accumulator
     * @param {Organism} organism
     * @param {Number} averageFitness
     */
    let averageFitness = this.graveyard.reduce((accumulator, organism) => accumulator + organism.getFitness(this.maze), 0);
    averageFitness = averageFitness / this.graveyard.length;

    /**
     * @param {Organism[]} genePool
     */
    let genePool = [];
    for (let i = 0; i < this.graveyard.length; i++) {
        let fitness = this.graveyard[i].getFitness(this.maze);
        if (fitness > averageFitness) {
            for (let a = 0; a < Math.abs(fitness * 100); a++) {
                genePool.push(this.graveyard[i]);
            }
        }
    }

    this.queue = [];
    this.graveyard = [];
    this.population = [];

    if (genePool.length < 1) {
        for (let i = 0; i < this.populationSize; i++) {
            this.queue.push(new Organism({
                dna: this.createDNA(),
                position: this.start.copy(),
                velocity: createVector(),
                stepDistance: nodeSize,
                size: Math.round(nodeSize / 4)
            }));
        }

    } else for (let i = 0; i < this.populationSize; i++) {
        let parentOne = genePool[Math.floor(Math.random() * genePool.length)];
        let parentTwo = genePool[Math.floor(Math.random() * genePool.length)];

        let baby = this.mate(parentOne, parentTwo);
        this.queue.push(baby);
    }

    this.totalOrganisms++;
    this.generation++;
    this.isReleasing = true;
};

/**
 * Release
 */
MazeSolver.prototype.release = function() {
    if (this.isReleasing) {
        if (this.queue.length > 0) {
            this.population.push(this.queue.pop());
        }

        if (this.graveyard.length === this.populationSize) {
            this.populate();
        }
    }

    setTimeout(() => this.release(), this.releaseTime);
};

/**
 *
 * @type {{all: (function(): p5.Vector[]), next: (function(*): *), DOWN: p5.Vector, LEFT: p5.Vector, RIGHT: p5.Vector, UP: p5.Vector}}
 */
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

