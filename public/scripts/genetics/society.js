function Society(options = {}) {
    options = Object.assign({}, this._defaults, options);

    if (!(options.factory instanceof GeneticVehicleFactory)) {
        throw new Error("Society requires the factory option to contain a GeneticVehicleFactory.");
    }

    this.vehicles = options.vehicles;
    this.factory  = options.factory;
    this.maxSize  = options.maxSize;

    for (let i = 0; i < this.maxSize; i++) {
        this.vehicles.push(this.factory.create());
    }
}

Society.prototype._defaults = {
    vehicles: [],
    factory: null,
    maxSize: 20,
    mate: function() { },
    move: function() { },
    render: function() { }
};

Society.prototype.advance = function() {

};
