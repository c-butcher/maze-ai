function Organism(options) {
    options = Object.assign({}, this._defaults, options);

    this.dna = options.dna;
    this.position = options.position;
    this.velocity = options.velocity;
    this.target = options.position;
    this.size = options.size;
    this.stepDistance = options.stepDistance;
    this.fitness = options.fitness;
}

Organism.prototype.update = function() {
    if (this.isAtPosition(this.target) && this.dna.next()) {
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
