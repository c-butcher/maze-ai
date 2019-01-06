class VehicleBuilder {

    /**
     * Start building the vehicle by setting the factory that created it.
     *
     * @param {VehicleFactory|null} factory
     */
    constructor(factory = null) {
        this._config = Object.assign({}, Vehicle.prototype.defaults);
        this._config.factory = factory;
    }

    /**
     * Set the vehicle render method.
     *
     * @param {callback} renderer
     *
     * @returns {VehicleBuilder}
     */
    renderer(renderer) {
        this._config.renderer = renderer;
        return this;
    }

    /**
     * The vehicles starting location.
     *
     * @param {p5.Vector} location
     */
    location(location) {
        this._config.location = location;
        return this;
    }

    /**
     * The vehicles starting acceleration.
     *
     * @param {p5.Vector} acceleration
     *
     * @returns {VehicleBuilder}
     */
    acceleration(acceleration) {
        this._config.acceleration = acceleration;
        return this;
    }

    /**
     * The vehicles starting velocity.
     *
     * @param velocity
     */
    velocity(velocity) {
        this._config.velocity = velocity;
        return this;
    }

    color(r, g, b, a) {
        this._config.color = color(r, g, b, a);
        return this;
    }

    /**
     * The vehicles size multiplier.
     *
     * @param {float} size
     *
     * @returns {VehicleBuilder}
     */
    radius(size) {
        this._config.radius = size;
        return this;
    }

    /**
     * Set the maximum force of the vehicle.
     *
     * @param {float} force
     *
     * @returns {VehicleBuilder}
     */
    maxForce(force) {
        this._config.maxForce = force;
        return this;
    }

    /**
     * The maximum speed of the vehicle.
     *
     * @param {float} speed
     *
     * @returns {VehicleBuilder}
     */
    maxSpeed(speed) {
        this._config.maxSpeed = speed;
        return this;
    }

    /**
     * Builds and returns the vehicle.
     *
     * @returns {Vehicle}
     */
    build() {
        return new Vehicle(this._config);
    }
}
