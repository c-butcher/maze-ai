/**
 * Create a new instance of genetic material.
 *
 * @param {array} materials The materials that our DNAStrain is made out of. (Adenine, Thymine, Guanine and Cytosine)
 * @param {number} length The number of materials used to make the DNAStrain strain.
 * @param {Gene[]} genes The individual genetic materials that make up this strain. (A-T-A-C-G-T-A)
 *
 * @constructor
 */
function DNAStrain(materials, length = 10, genes = []) {
    if (!Array.isArray(materials)) {
        throw new Error('DNA Strain requires a list of known genetic materials.');
    }

    this._current   = 0;
    this._genes     = [];
    this._materials = materials;
    this._length    = length;

    this.setGenes(genes);
}

/**
 * Set the genetic material that a specific gene is made of. This function duplicates
 * the gene before setting it.
 *
 * @param {number} index
 * @param {Gene} gene
 *
 * @returns {DNAStrain}
 */
DNAStrain.prototype.setGene = function(index, gene) {
    if (this._length < index || index < 0) {
        throw new Error(`Attempting to set Gene(${index}) on a Strain that can only hold ${this._length} genes.`);
    }

    this._genes[index] = gene.duplicate();

    return this;
};

/**
 * Add a new gene to our DNA strain.
 *
 * @param {Gene} gene
 * @returns {DNAStrain}
 */
DNAStrain.prototype.addGene = function(gene) {
    if (this.isFull()) {
        throw new Error('Attempting to add a Gene to an already full DNA Strain.');
    }

    this._genes.push(gene);

    return this;
};

/**
 * Returns a specific gene from the strain.
 *
 * @param {number} index
 *
 * @returns {*}
 */
DNAStrain.prototype.getGene = function(index) {
    if (this._genes.length <= index || index < 0) {
        throw new Error('Attempting to get a non-existent Gene.');
    }

    return this._genes[index];
};

/**
 * Tells whether this DNAStrain has been filled with genetic material.
 *
 * @returns {boolean}
 */
DNAStrain.prototype.isFull = function() {
    return this._genes.length >= this._length;
};

/**
 * Returns the next piece of genetic material.
 *
 * @returns {*}
 */
DNAStrain.prototype.next = function() {
    this._current++;
    return this.current();
};

/**
 * Returns the previous piece of genetic information.
 *
 * @returns {Gene}
 */
DNAStrain.prototype.previous = function() {
    this._current--;
    return this.current();
};

/**
 * Returns a copy of the current piece of genetic information, or returns false
 * when we've reached the end of the strain.
 *
 * @returns {Gene|boolean}
 */
DNAStrain.prototype.current = function() {
    // Make sure we don't go below our arrays limit.
    if (this._current < 0) {
        this._current = 0;
        return false;
    }

    // Make sure we don't go over our arrays limit
    if (this._current >= this._length) {
        this._current = this._length - 1;
        return false;
    }

    return this._genes[this._current];
};

/**
 * Sets the genes for this DNA strain.
 *
 * @returns {DNAStrain}
 */
DNAStrain.prototype.setGenes = function(genes) {
    if (!Array.isArray(genes)) {
        throw new Error('DNA Strain requires an array of genes.');
    }

    // We are throwing an error when there are too many genes, mostly because I don't
    // know how to choose which genes to keep and which to get rid of.
    if (genes.length > this._length) {
        throw new Error(`DNA Strain requires no more than ${this._length} genes.`);
    }

    // When we don't have enough genes, then we can fill it up with random values.
    else if (genes.length < this._length) {
        for (let i = genes.length; i < this._length; i++) {
            genes[i] = new Gene(this._materials);
        }
    }

    // Clear this strains old genes, and set the new genes.
    this._genes = [];
    for (let i = 0; i < genes.length; i++) {
        if (!(genes[i] instanceof Gene)) {
            throw new Error('DNA strain can only accept genes.');
        }

        this._genes[i] = genes[i];
    }

    return this;
};

/**
 * Returns a copy of the genes.
 *
 * @returns {array}
 */
DNAStrain.prototype.getGenes = function() {
    return this._genes.slice();
};

/**
 * Returns a copy of the material which makes up our genes.
 *
 * @returns {array}
 */
DNAStrain.prototype.getMaterials = function() {
    return this._materials.slice();
};

/**
 * Returns the number of genes that this strain can hold.
 *
 * @returns {number}
 */
DNAStrain.prototype.getLength = function() {
    return this._length;
};

/**
 * Tells whether we've reached the end of our strain.
 *
 * @returns {number}
 */
DNAStrain.prototype.isFinished = function() {
    return this._length;
};

/**
 * Returns a duplicate of this dna strain.
 *
 * @returns {DNAStrain}
 */
DNAStrain.prototype.duplicate = function() {
    return new DNAStrain(this._materials.slice(), this._length, this._genes.slice());
};
