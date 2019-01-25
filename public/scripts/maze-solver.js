/**
 * The Maze Solver is responsible for maintaining a society of organisms that
 * attempt to traverse the maze using genetic DNA to control their movements.
 *
 * @param {*} maze
 *
 * @constructor
 */
function MazeSolver(maze) {
    /**
     * The active population of the maze.
     *
     * @type {Organism[]}
     */
    this.population = [];

    /**
     * The queue of organisms that are waiting to be released.
     *
     * @type {Organism[]}
     */
    this.queue = [];

    /**
     * Graveyard with all the souls of our organisms.
     *
     * @type {Organism[]}
     */
    this.graveyard = [];

    /**
     * The total allowed size of the population.
     *
     * @type {number}
     */
    this.populationSize = 100;

    /**
     * The total number of organisms that have been released since the beginning of time.
     *
     * @type {number}
     */
    this.totalOrganisms = 0;

    /**
     * The number of generations that have passed since the beginning of time.
     *
     * @type {number}
     */
    this.generation = 0;

    /**
     * The probability in percentage that a gene will mutate when being created.
     *
     * @type {number}
     */
    this.mutationRate = 0.01;

    /**
     * The total number of nodes in the maze.
     *
     * @type {number}
     */
    this.length = (maze.getWidth() / maze.getNodeSize()) * (maze.getHeight() / maze.getNodeSize());

    /**
     * The maze that our organisms are attempting to solve.
     *
     * @type {Maze}
     */
    this.maze = maze;

    /**
     * The number of milliseconds between organisms being released.
     *
     * @type {number}
     */
    this.releaseTime = 200;

    /**
     * The position of the starting node.
     *
     * @type {p5.Vector}
     */
    this.start = createVector();

    /**
     * The position of the finish node.
     *
     * @type {p5.Vector}
     */
    this.finish = createVector();

    /**
     * Tells whether we are releasing our population.
     *
     * @type {boolean}
     */
    this.isReleasing = false;

    // Now we can find the finish.
    this.findStartAndFinish();
}

/**
 * Finds the start and finish nodes for the maze.
 */
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

/**
 * Advances the population.
 *
 * @returns {boolean}
 */
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

    return this.population.length > 0;
};

/**
 * Creates a brand new DNA strain.
 *
 * @returns {DNAStrain}
 */
MazeSolver.prototype.createDNA = function() {
    let genes = [];
    for (let i = 0; i < this.length; i++) {
        genes.push(this.materials.next(genes[i-1]));
    }

    return new DNAStrain(this.materials.all(), this.length, genes);
};

/**
 * Combines the DNA of two parent organisms.
 *
 * @param {Organism} parentOne
 * @param {Organism} parentTwo
 *
 * @returns {Organism}
 */
MazeSolver.prototype.mate = function(parentOne, parentTwo) {

    // Prepare the DNA of our parents
    let genesOne = parentOne.dna.genes.slice();
    let genesTwo = parentTwo.dna.genes.slice();
    let baby = parentOne.dna.genes.slice();

    // This tells us when the parents DNA diverges from each-other
    let diverged = false;

    // Next we go through our genes one-by-one in order
    // to compare if the parents have identical genes.
    for (let i = 0; i < genesOne.length; i++) {

        // Should God decide, we will mutate
        if (Math.random() < this.mutationRate) {
            baby[i] = this.materials.next(baby[i - 1]);
            diverged = true;

        // If God doesn't want to mutate us, and our parents DNA haven't diverged
        // then we should continue adding our parents DNA.
        } else if (!diverged && genesOne[i].equals(genesTwo[i])) {
            baby[i] = genesOne[i];

        // When the parents have diverged, then we want to start generating random DNA.
        } else {
            baby[i] = this.materials.next(baby[i - 1]);
        }
    }

    // Add the genes to our DNA strain
    let strain = new DNAStrain(this.materials.all(), this.length, baby);

    // Create and return the new organism.
    return new Organism({
        dna: strain,
        position: this.start.copy(),
        velocity: createVector(),
        stepDistance: this.maze.getNodeSize(),
        size: Math.round(this.maze.getNodeSize() / 4)
    });
};

/**
 * Check to see if the organism is still alive.
 *
 * @param {Organism} organism
 *
 * @returns {boolean}
 */
MazeSolver.prototype.isAlive = function(organism) {
    let color = this.maze.getImage().get(organism.position.x, organism.position.y);
    return color.toString() !== this.maze.getWallColor().levels.toString();
};

/**
 * Create a new population based on the previous generations DNA.
 */
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
     * Get the top 50% of organisms that performed well.
     *
     * @param {Organism[]} genePool
     */
    let genePool = [];
    for (let i = 0; i < this.graveyard.length; i++) {
        let fitness = this.graveyard[i].getFitness(this.maze);
        if (fitness >= averageFitness) {
            for (let a = 0; a < Math.abs(fitness * 100); a++) {
                genePool.push(this.graveyard[i]);
            }
        }
    }

    // Reset our population holders
    this.queue = [];
    this.graveyard = [];
    this.population = [];

    // If there are no organisms from the previous generation
    // then we can create a new ones with completely random DNA strains.
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

    // When we have a previous generation of organisms, then we can
    // create the new generation from their parents DNA.
    } else for (let i = 0; i < this.populationSize; i++) {
        let parentOne = genePool[Math.floor(Math.random() * genePool.length)];
        let parentTwo = genePool[Math.floor(Math.random() * genePool.length)];

        let baby = this.mate(parentOne, parentTwo);
        this.queue.push(baby);
    }

    // Increase the generation and start releasing the population from the queue.
    this.generation++;
    this.isReleasing = true;
};

/**
 * Release a single organism from the queue.
 *
 * @return {boolean}
 */
MazeSolver.prototype.release = function() {
    if (this.isReleasing) {
        if (this.queue.length > 0) {
            this.population.push(this.queue.pop());
        }

        if (this.graveyard.length === this.populationSize) {
            this.populate();
        }

        this.totalOrganisms++;
    }

    setTimeout(() => this.release(), this.releaseTime);

    return this.isReleasing;
};

/**
 * The DNA materials that we use to control our organism.
 *
 * @type {{all: (function(): p5.Vector[]), next: (function(*): *), DOWN: p5.Vector, LEFT: p5.Vector, RIGHT: p5.Vector, UP: p5.Vector}}
 */
MazeSolver.prototype.materials = {
    UP: new p5.Vector(0, -1),
    DOWN: new p5.Vector(0, 1),
    LEFT: new p5.Vector(-1, 0),
    RIGHT: new p5.Vector(1, 0),

    /**
     * Returns all of the available materials.
     *
     * @returns {p5.Vector[]}
     */
    all: function() {
        return [
            this.UP,
            this.DOWN,
            this.LEFT,
            this.RIGHT,
        ]
    },

    /**
     * Returns a randomly chosen DNA gene. When the previous material is provided,
     * it will remove any materials that cause the organism to go backwards.
     *
     * @param {p5.Vector} previous
     *
     * @returns {p5.Vector}
     */
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
