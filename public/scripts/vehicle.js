/**
 * Vehicle
 *
 * @param {object} options
 *
 * @constructor
 */
function Vehicle(options) {
    if (typeof options !== "object") {
        throw new Error("Vehicle argument 'options' that must be an object.");
    }

    options = Object.assign(
        Object.create(Vehicle.prototype.defaults), options);

    this.location     = options.location || new p5.Vector();
    this.velocity     = options.velocity || new p5.Vector();
    this.acceleration = options.acceleration || new p5.Vector();
    this.radius       = options.radius;
    this.maxforce     = options.maxForce;
    this.maxspeed     = options.maxSpeed;
    this.renderer     = options.renderer;
    this.finished     = options.finished;
    this.color        = options.color;
}

Vehicle.prototype.defaults = {
    location: null,
    velocity: null,
    acceleration: null,
    color: 175,
    radius: 5,
    maxForce: 0.1,
    maxSpeed: 4,
    finished: function(vehicles) {
        vehicles.splice(vehicles.indexOf(this), 1);
    },
    renderer: function() {
        fill(175);
        stroke(0);
        ellipse(this.location.x + this.radius / 2, this.location.y + this.radius / 2, this.radius, this.radius);
    },
};

/**
 * Draw the vehicle to the screen.
 *
 * @returns {Vehicle}
 */
Vehicle.prototype.display = function() {
    this.renderer();

    return this;
};

/**
 * Updates the properties of the current vehicle.
 *
 * @returns {Vehicle}
 */
Vehicle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);

    this.location.add(this.velocity);
    this.acceleration.mult(0);

    return this;
};

/**
 *
 * @param {p5.Vector} force
 *
 * @return {Vehicle}
 */
Vehicle.prototype.applyForce = function(force) {
    this.acceleration.add(force);

    return this;
};

/**
 * Seek out the target.
 *
 * @param {p5.Vector} target
 *
 * @return {Vehicle}
 */
Vehicle.prototype.seek = function(target) {
    let desired  = p5.Vector.sub(target, this.location);
    let distance = desired.mag();

    desired.normalize();

    if (distance <= this.radius && this.velocity.mag() < 0.5) {
        this.finished(this);

    } else if (distance < 100) {
        desired.mult( map(distance, 0, 100, 0, this.maxspeed) );

    } else {
        desired.mult(this.maxspeed);
    }

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    this.applyForce(steer);

    return this;
};
