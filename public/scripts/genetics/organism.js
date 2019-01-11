function Organism(map) {
    this.dna = dna;
    this.position = createVector(20, 20);
    this.velocity = createVector(Math.random(), Math.random());
    this.target = this.position;
    this.size = 10;
    this.stepDistance = 40;
}

Organism.prototype.update = function() {
    if (this.isAtPosition(this.target) && this.dna.next()) {
        this.velocity = this.dna.current();
        this.target = this.position.copy().add(this.velocity.copy().mult(this.stepDistance));
    }

    this.position.add(this.velocity);
};

Organism.prototype.mate = function(partner) {
    return this.dna.combine(partner.dna);
};

Organism.prototype.isAtPosition = function(target) {
    let distance = this.position.dist(target);
    return distance < this.velocity.x + this.velocity.y;
};

Organism.prototype.render = function() {
    ellipse(this.position.x, this.position.y, this.size);
};
