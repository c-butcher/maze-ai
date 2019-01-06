/**
 *
 * @type {Vehicle[]}
 */
let vehicles = [];

class VehicleFactory {

    /**
     * Create a vehicle factory for a specific type of vehicle.
     *
     * @param {p5.Vector} location
     * @param {function} renderer
     */
    constructor(location, renderer) {
        this.location = location;
        this.renderer = renderer;
        this.vehicles = [];
    }

    /**
     * Remove a vehicle from the list of rendered vehicles.
     *
     * @param {Vehicle} vehicle
     *
     * @returns {boolean}
     */
    remove(vehicle) {
        const index = this.vehicles.indexOf(vehicle);
        if (index < 0) {
            return false;
        }

        this.vehicles.splice(index, 1);

        return true;
    }

    /**
     * Create new vehicle.
     *
     * @returns {Vehicle}
     */
    create() {
        let builder = new VehicleBuilder(this);

        // Spatial
        builder.location(this.location.copy())
               .renderer(this.renderer)
               .color(
                   Math.floor(Math.random() * 255),
                   Math.floor(Math.random() * 255),
                   Math.floor(Math.random() * 255)
               );

        // Physics
        builder.radius(Math.floor(Math.random() * 5) + 3)
               .maxForce(Math.floor(Math.random() * 0.2) + 0.05)
               .maxSpeed( Math.floor(Math.random() * 4) + 2 );

        let vehicle = builder.build();

        this.vehicles.push(vehicle);

        return vehicle;
    }

    render() {
        let mouse = createVector(mouseX, mouseY);
        for (let vehicle of this.vehicles) {
            vehicle.update()
                   .seek(mouse)
                   .render();
        }
    }
}
