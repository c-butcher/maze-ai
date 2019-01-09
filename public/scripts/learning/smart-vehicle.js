function SmartVehicle() {
    this.position = createVector();
    this.velocity = createVector();
    this.acceleration = createVector();
}

SmartVehicle.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};

SmartVehicle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
};

SmartVehicle.prototype.render = function() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    rectMode(CENTER);
    rect(this.position.x, this.position.y, 50, 10);
    pop();
};
