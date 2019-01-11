function Organism(dna) {
    this.dna = dna;
    this.position = createVector(20, 20);
    this.velocity = createVector(Math.random(), Math.random());
    this.target = this.position;
    this.size = 7;
    this.stepDistance = 40;
    this.fitness = 0;
}

Organism.prototype.update = function() {
    if (this.isAtPosition(this.target) && this.dna.next()) {
        this.velocity = this.dna.current();
        this.position = this.target;
        this.target = this.position.copy().add(this.velocity.copy().mult(this.stepDistance));
    }

    this.position.add(this.velocity);
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
