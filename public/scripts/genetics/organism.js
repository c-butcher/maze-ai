/**
 * Organisms use DNA to control their behaviours.
 *
 * @param {*} options
 *
 * @constructor
 */
function Organism(options) {
    options = Object.assign({}, this._defaults, options);

    this.dna = options.dna;
    this.position = options.position;
    this.velocity = options.velocity;
    this.history = options.history || [];
    this.target = options.position;
    this.size = options.size;
    this.stepDistance = options.stepDistance;
    this.fitness = options.fitness;
}

/**
 * Update the organisms traits.
 */
Organism.prototype.update = function() {
    if (this.isAtPosition(this.target) && this.dna.next()) {
        this.history.push(this.target.copy());

        this.velocity = this.dna.current();
        this.position = this.target;
        this.target = this.position.copy().add(this.velocity.copy().mult(this.stepDistance));
    }

    this.position.add(this.velocity);
};

/**
 * The default properties for the organism.
 *
 * @type {{size: number, stepDistance: number, dna: null, fitness: number, position: p5.Vector, velocity: p5.Vector, history: null, target: null}}
 *
 * @private
 */
Organism.prototype._defaults = {
    dna: null,
    position: new p5.Vector(),
    velocity: new p5.Vector(),
    target: null,
    history: null,
    size: 5,
    stepDistance: 40,
    fitness: 0,
};

/**
 * Check to see if the organism is at a specific position.
 *
 * @param {p5.Vector} target
 *
 * @returns {boolean}
 */
Organism.prototype.isAtPosition = function(target) {
    let distance = this.position.dist(target);
    return distance < 2;
};

/**
 * Render the organisms physical body to the screen.
 */
Organism.prototype.render = function() {
    fill(0);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size);
};

/**
 * Grade the organisms fitness level to determine whether it would make an acceptable mate.
 *
 * We are distributing the scoring as follows:
 *
 * 90% - Distance traveled on path
 * 5%  - Distance from start
 * 5%  - Distance to finish
 *
 * @param {Maze} maze
 */
Organism.prototype.getFitness = function(maze) {

    // If this organism has already had its fitness calculated, then it is already dead.
    // So we can just return the fitness level that was already calculated.
    if (this.fitness > 0) {
        return this.fitness;
    }

    // We need the start and finish positions of the maze for our calculations
    let start  = maze.getStart();
    let finish = maze.getFinish();

    // Then we need to calculate the organisms distance from both start and finish
    // as well as the total distance required to travel.
    let distanceToStart  = start.dist(this.position);
    let distanceToFinish = finish.dist(this.position);
    let distanceFromStartToFinish = start.dist(finish);

    // Calculate the distance from the start and finish, making sure that we don't go over 100% distance.
    // If we go over 100%, then it will throw off our distributions below.
    let startPercent  = distanceToStart / distanceFromStartToFinish;
    if (startPercent > 1) {
        startPercent = 1;
    }

    let finishPercent = (distanceFromStartToFinish - distanceToFinish) / distanceFromStartToFinish;
    if (finishPercent > 1) {
        finishPercent = 1;
    }

    let pathPercent = 0;
    let path = maze.getPath();
    let nodeSize = maze.getNodeSize();

    // We are rotating through the history of our organisms position in order
    // to see if it matches up with the mazes optimal path.
    for (let i = 0; i < this.history.length; i++) {

        // First we need to convert the actual X,Y coordinates, into our node coordinates.
        let historyX = (this.history[i].x - (nodeSize / 2)) / nodeSize;
        let historyY = (this.history[i].y - (nodeSize / 2)) / nodeSize;

        // Check to see if our historical position, matches the same position as our path.
        // If so, then we will add the percentage of a single node.
        if (path[i] && path[i].toString() === [historyX, historyY].toString()) {
            pathPercent += (i / path.length);

        // If there is still a path, but our history no longer matches it then we will subtract
        // a value.
        } else if (path[i]) {
            pathPercent -= (i / path.length);

        // When there is no more path, we have nothing left to compare
        } else break;
    }

    // Now we can combine our percentages together, distributing the values by their level of importance.
    this.fitness = 0;
    this.fitness += startPercent * 5;
    this.fitness += finishPercent * 5;
    this.fitness += pathPercent * 90;

    return this.fitness;
};
