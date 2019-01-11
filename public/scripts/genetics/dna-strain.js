function DNAStrain(materials, length = 20, genes = []) {
    if (!Array.isArray(materials)) {
        throw new Error('Materials supplied to DNA must be an array.');
    }

    if (!Array.isArray(genes)) {
        throw new Error('Genes supplied to DNA must be an array.');
    }

    if (genes.length > length) {
        throw new Error('Genes supplied to DNA were longer than the maximum.');
    }

    this.genes = genes;
    this.length = length;
    this.materials = materials;
    this.pointer = 0;

    // When the gene length doesn't cover the entire strain, then we can
    // just go ahead and add a few random genes to the end.
    if (this.genes.length < this.length) {
        for (let i = this.genes.length; i < this.length; i++) {
            this.genes[i] = this.random();
        }
    }
}

/**
 * Returns a random material from this strain.
 *
 * @returns {*}
 */
DNAStrain.prototype.random = function() {
    return this.materials[Math.floor(Math.random() * this.materials.length)];
};

/**
 * Mutate our genes by the specified percentage.
 *
 * @param {number} mutationRate
 */
DNAStrain.prototype.mutate = function(mutationRate = 0.01) {
    // When the mutation rate is a real number, then we need to make it into a percentage.
    if (mutationRate > 1) {
        mutationRate /= 100;
    }

    // Now we through the genes and mutate the percentage we want.
    for (let i = 0; i < this.genes.length; i++) {
        if (Math.random() <= mutationRate) {
            this.genes[i] = this.random();
        }
    }
};

DNAStrain.prototype.previous = function() {
    this.pointer--;
    if (this.pointer < 0) {
        this.pointer = -1;
    }

    return this.current();
};

DNAStrain.prototype.next = function() {
    this.pointer++;
    if (this.pointer > this.length) {
        this.pointer = this.length;
    }

    return this.current();
};

DNAStrain.prototype.current = function() {
    return this.genes[this.pointer];
};

DNAStrain.prototype.getCurrentNumber = function() {
    return this.pointer;
};


DNAStrain.prototype.getLength = function () {
    return this.length;
};
