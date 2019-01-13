class GeneticPlayer extends Player {

    /**
     *
     * @param {DNAStrain} dna
     * @param {*} options
     */
    constructor(dna, options = {}) {
        super(options);
        this._dna = dna;
        this._pointer = 0;
    }

    mutate() {
        this._dna = this._dna.mutate();
    }

    /**
     *
     */
    update() {
        if (this.isAtPosition(this._target)) {
            this._velocity = this._dna.next();

            let distance = this._velocity.copy().mult(this._distance);
            this._target = this._position.copy().add(distance);
            this._moving = true;
        }

        if (this._moving) {
            this._position.add(this._velocity);
        }
    }
}
