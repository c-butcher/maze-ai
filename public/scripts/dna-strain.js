class DNAStrain {

    constructor(materials, genes = []) {
        if (!Array.isArray(materials)) {
            throw new Error('Materials supplied to DNA must be an array.');
        }

        if (!Array.isArray(genes)) {
            throw new Error('Genes supplied to DNA must be an array.');
        }

        this.genes = genes;
        this.materials = materials;
        this.pointer = -1;

        // When the gene length doesn't cover the entire strain, then we can
        // just go ahead and add a few random genes to the end.
        if (this.genes.length < this.length) {
            for (let i = this.genes.length; i < this.length; i++) {
                this.genes[i] = this.random();
            }
        }
    }

    /**
     * Mutate our genes by the specified percentage.
     *
     * @returns {DNAStrain}
     */
    mutate() {
        let genes = this.genes.slice();

        // x^2 + bx + c
        // x = genes.length
        // x2
        // Now we through the genes and mutate the percentage we want.
        for (let i = 0; i < genes.length; i++) {
            let mutationRate = 0.01;

            if (Math.random() <= mutationRate) {
                genes[i] = this.random();
            }
        }

        return new DNAStrain(this.materials, genes);
    };

    /**
     * Returns a random material from this strain.
     *
     * @returns {*}
     */
    random() {
        return this.materials[Math.floor(Math.random() * this.materials.length)];
    };

    /**
     * Moves to, and returns, the next gene in our sequence.
     *
     * @returns {*}
     */
    next() {
        this.pointer++;

        // When we've run out of genes, but still want to move,
        // then we can just add a new random material.
        if (this.pointer >= this.genes.length) {
            this.genes.push(this.random());
        }

        return this.current();
    };

    /**
     * Returns the current gene.
     *
     * @returns {*}
     */
    current() {
        return this.genes[this.pointer];
    };
}
