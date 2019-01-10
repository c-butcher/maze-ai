function Society(options = {}) {
    options = Object.assign({}, this._defaults, options);

    this.organisms = options.organisms;
    this.materials = options.materials;
    this.maxSize   = options.maxSize;
    this.procreate = options.procreate;
    this.length    = options.length;
    this.traits    = options.traits;
    this.organismFunctions = {
        isAlive: options.isAlive,
        progress: options.progress,
        regress: options.regress,
        fitness: options.fitness,
        render: options.render,
    };

    for (let i = 0; i < this.maxSize; i++) {
        this.organisms.push(this.create());
    }
}

Society.prototype._defaults = {
    /**
     * @type {Organism[]}
     */
    organisms: [],
    /**
     * @type {Array}
     */
    materials: [],

    /**
     * @type {number}
     */
    maxSize: 20,

    /**
     *
     */
    length: 50,

    /**
     * @type {Object}
     */
    traits: {},

    isAlive: Organism.prototype._defaults.isAlive,
    progress: Organism.prototype._defaults.progress,
    regress: Organism.prototype._defaults.regress,
    fitness: Organism.prototype._defaults.fitness,
    render: Organism.prototype._defaults.render,
};

Society.prototype.advance = function() {
    for (let i = 0; i < this.organisms.length; i++) {
        if (this.organisms[i].isAlive()) {
            this.organisms[i].progress();
            this.organisms[i].render();
        }
    }
};

/**
 * Creates a brand new organism without the need for procreation.
 * All new organisms will be made up of completely random genetic material.
 *
 * @returns {Organism}
 */
Society.prototype.create = function() {
    let dna = new DNAStrain(this.materials, this.length);

    let traits = {};
    for (let trait in this.traits) {
        traits[trait] = this.traits[trait]();
    }

    return new Organism({
        dna: dna,
        traits: traits,
        isAlive: this.organismFunctions.isAlive,
        progress: this.organismFunctions.progress,
        regress: this.organismFunctions.regress,
        render: this.organismFunctions.render,
    });
};
