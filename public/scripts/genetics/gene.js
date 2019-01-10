/**
 * Create a new instance of genetic material.
 *
 * @param {array} materials
 * @param {*|null} value
 *
 * @constructor
 */
function Gene(materials = [], value = null) {
    this._value = value;
    this._materials = materials;

    value ? this.set(value) : this.mutate();
}

/**
 * Set the genetic material.
 *
 * @param {*} material
 *
 * @returns {Gene}
 */
Gene.prototype.set = function(material) {
    if (this._materials.indexOf(material) < 0) {
        throw new Error("Setting the value of a gene to an unknown material.");
    }

    this._value = material;

    return this;
};

/**
 * Returns the genetic material.
 *
 * @returns {*}
 */
Gene.prototype.get = function() {
    return this._value;
};

/**
 * Select a genetic material at random.
 *
 * @returns {Gene}
 */
Gene.prototype.mutate = function() {
    this._value = this._materials[Math.floor(Math.random() * this._materials.length)];
    return this;
};

/**
 * Returns a duplicate of this gene.
 *
 * @returns {Gene}
 */
Gene.prototype.duplicate = function() {
    return new Gene(this._value, this._materials);
};
