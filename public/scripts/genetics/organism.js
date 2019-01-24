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

Organism.prototype.update = function() {
    if (this.isAtPosition(this.target) && this.dna.next()) {
        this.history.push(this.target.copy());

        this.velocity = this.dna.current();
        this.position = this.target;
        this.target = this.position.copy().add(this.velocity.copy().mult(this.stepDistance));
    }

    this.position.add(this.velocity);
};

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

Organism.prototype.isAtPosition = function(target) {
    let distance = this.position.dist(target);
    return distance < 2;
};

Organism.prototype.render = function() {
    fill(0);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size);
};

/**
 * Grade the organisms fitness level.
 *
 * This is based on the following attributes:
 *
 * 85% - Distance traveled on path
 * 7.5% - Distance from start
 * 7.5% - Distance to finish
 *
 * @param {Maze} maze
 */
Organism.prototype.getFitness = function(maze) {
    if (this.fitness > 0) {
        return this.fitness;
    }

    let start  = maze.getStart();
    let finish = maze.getFinish();

    let distanceToStart  = start.dist(this.position);
    let distanceToFinish = finish.dist(this.position);
    let distanceFromStartToFinish = start.dist(finish);

    let startPercent  = distanceToStart / distanceFromStartToFinish;
    let finishPercent = (distanceFromStartToFinish - distanceToFinish) / distanceFromStartToFinish;

    let path = maze.getPath();
    let nodeSize = maze.getNodeSize();

    let pathPercent = 0;

    for (let i = 0; i < this.history.length; i++) {
        let historyX = (this.history[i].x - (nodeSize / 2)) / nodeSize;
        let historyY = (this.history[i].y - (nodeSize / 2)) / nodeSize;

        if (path[i] && path[i].toString() === [historyX, historyY].toString()) {
            pathPercent += (i / path.length);

        } else {
            pathPercent -= (i / path.length);
        }
    }

    this.fitness = 0;
    this.fitness += startPercent * 7.5;
    this.fitness += finishPercent * 7.5;
    this.fitness += pathPercent * 85;

    return this.fitness;
};