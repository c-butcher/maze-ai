function Organism(options) {
    options = Object.assign({}, this._defaults, options);
    if (typeof options.traits !== 'object') {
        throw new Error("Organism traits must be an object.");
    }

    this.isAlive     = options.isAlive;
    this.procreate   = options.procreate;
    this.progress    = options.progress;
    this.regress     = options.regress;
    this.render      = options.render;
    this.traits      = options.traits;

    this.setDNA(options.dna);
}

/**
 * The default options for an organism.
 *
 * @type {{ isAlive: (function(): number), dna: DNAStrain, procreate: (function(): DNAStrain), regress: (function(): void), progress: (function(): void), render: (function(): void), mutateRate: number, traits: {}}}
 *
 * @private
 */
Organism.prototype._defaults = {
    dna: null,
    traits: {},
    mutateRate: 0.01,

    /**
     * Tells whether the organism is alive, or not?
     *
     * @returns {number}
     */
    isAlive: function() {
        return this.dna.isFinished();
    },

    /**
     * Combines the genetic code of this organism with the genetic code of another organism.
     *
     * @param {Organism} organism
     *
     * @returns {DNAStrain}
     */
    procreate: function(organism) {
        let parent1 = this.getDNA();
        let parent2 = organism.getDNA();

        if (parent1.getLength() !== parent2.getLength()) {
            throw new Error('Attempting to mate two organisms with different sizes of DNA.')
        }

        let babyGenes = [];
        for (let i = 0; i < parent1.getLength(); i++) {
            babyGenes.push(
                Math.random() > 0.5 ? parent1.getGene(i) : parent2.getGene(i)
            );
        }

        return new DNAStrain(parent1._materials, parent1.getLength(), babyGenes);
    },

    /**
     * Move or updates the organism
     */
    progress: function() {

    },

    /**
     *
     */
    regress: function() {

    },

    /**
     * Displays the organism on the screen.
     */
    render: function() {

    }
};

/**
 * Returns a copy of the organism DNA.
 *
 * @param {DNAStrain} dna
 *
 * @returns {Organism}
 */
Organism.prototype.setDNA = function(dna) {
    if (!(dna instanceof DNAStrain)) {
        throw new Error("Organisms can only use DNA Strains for their DNA.");
    }

    this.dna = dna.duplicate();

    return this;
};


/**
 * Returns a copy of the organism DNA.
 *
 * @returns {DNAStrain}
 */
Organism.prototype.getDNA = function() {
    return this.dna.duplicate();
};
