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
        this.history.push(this.position.copy());

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
 * 50% - Distance traveled on path
 * 25% - Distance from start
 * 25% - Distance to finish
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
    let pathPercent = 0;

    for (let i = 0; i < path.length; i++) {
        let gene = this.dna.get(i);
        if (!gene) {
            break;
        }

        let history = this.history[i];
        if (!history) {
            break;
        }

        if (path[i] && path[i].toString() === [history.x, history.y].toString()) {
            pathPercent += (i / path.length);

        } else {
            pathPercent -= (i / path.length);
        }
    }

    this.fitness = 0;
    this.fitness += startPercent * 25;
    this.fitness += finishPercent * 25;
    this.fitness += pathPercent * 50;

    return this.fitness;
};