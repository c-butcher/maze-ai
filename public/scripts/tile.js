function Tile(row, column, size) {
    this.row = row;
    this.column = column;
    this.size = size;

    this.top = true;
    this.bottom = true;
    this.right = true;
    this.left = true;

    this.visited = false;

    /**
     * Returns the tiles index number for the grid array.
     *
     * @param {number} numColumns
     *
     * @returns {*}
     */
    this.index = function(numColumns) {
        return this.row * numColumns + this.column;
    };

    /**
     * Renders a highlight color for this tile.
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     *
     * @return {Tile}
     */
    this.highlight = function(r, g, b, a) {
        let x = this.row * this.size;
        let y = this.column * this.size;

        noStroke();
        fill(r, g, b, a);
        rect(x, y, this.size, this.size);

        return this;
    };

    /**
     * Renders the borders for this tile.
     *
     * @return {Tile}
     */
    this.render = function(numColumns) {
        let x = this.row * this.size;
        let y = this.column * this.size;

        stroke(0);
        strokeWeight(2);

        // Top
        if (this.top) {
            line(x, y, x + this.size, y);
        }

        // Left
        if (this.left) {
            line(x, y, x, y + this.size);
        }

        // Right
        if (this.right) {
            line(x + this.size, y, x + this.size, y + this.size);
        }

        // Bottom
        if (this.bottom) {
            line(x, y + this.size, x + this.size, y + this.size);
        }

        return this;
    }
}
