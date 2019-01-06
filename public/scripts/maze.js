function Maze(width, height, cellSize) {

    /**
     * The width of the maze.
     *
     * @type {number}
     */
    this.width = width;

    /**
     * The height of the maze.
     *
     * @type {number}
     */
    this.height = height;

    /**
     * The width and height of each cell.
     *
     * @type {number}
     */
    this.cellSize = cellSize;

    /**
     * A grid containing all of the tiles.
     *
     * @type {Array}
     */
    this.grid = [];

    /**
     * A list of all the tiles that we've already visited.
     *
     * When we hit a dead-end, we use the history to back-track to the last
     * cell which has non-visited neighbors.
     *
     * @type {Array}
     */
    this.history = [];

    /**
     * List of the grid indexes for all the dead-ends that we've created.
     *
     * We grab the dead-end with the highest index in order to figure out
     * where the finish line should be.
     *
     * @type {Array}
     */
    this.deadends = [];

    /**
     * The total amount of columns that we have.
     *
     * @type {number}
     */
    this.numColumns = Math.floor(this.width / this.cellSize);

    /**
     * The total number of rows that we have.
     *
     * @type {number}
     */
    this.numRows = Math.floor(this.height / this.cellSize);

    /**
     * Looks at all the neighbors for the supplied tile, and then selects
     * one at random.
     *
     * @param {Tile} tile
     *
     * @returns {*}
     */
    this.findNeighbor = function(tile) {
        let neighbors = [];

        let top    = this.findTile(tile.row - 1, tile.column);
        let bottom = this.findTile(tile.row + 1, tile.column);
        let left   = this.findTile(tile.row, tile.column - 1);
        let right  = this.findTile(tile.row, tile.column + 1);

        if (top && !top.visited) {
            neighbors.push(top);
        }

        if (right && !right.visited) {
            neighbors.push(right);
        }

        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }

        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length < 1) {
            return null;
        }

        return neighbors[Math.floor(Math.random() * neighbors.length)];
    };

    /**
     * Finds a specific tile in the grid.
     *
     * @param {number} row
     * @param {number} column
     *
     * @returns {Tile|null}
     */
    this.findTile = function(row, column) {
        let tile = null;
        if (row < 0 || column < 0 || row > this.numColumns - 1 || column > this.numRows - 1) {
            return null;
        }

        let index = row * this.numRows + column;

        if (this.grid[index]) {
            tile = this.grid[index];
        }

        return tile;
    };

    /**
     * Removes a wall in-between the current and next tiles.
     *
     * @param current
     * @param next
     */
    this.removeWalls = function(current, next) {
        let x = current.row - next.row;
        let y = current.column - next.column;

        if (x === 1) {
            current.left = false;
            next.right = false;
        }

        else if (x === -1) {
            current.right = false;
            next.left = false;
        }

        if (y === 1) {
            current.top = false;
            next.bottom = false;
        }

        else if (y === -1) {
            current.bottom = false;
            next.top = false;
        }
    };

    /**
     * Move the generator to the next tile.
     *
     * @returns {boolean}
     */
    this.next = function() {
        this.start.visited = true;

        // Step 1 - Pick a random neighbor
        let next = this.findNeighbor(this.start);
        if (next) {
            next.visited = true;

            // Step 2 - Add to stack
            this.history.push(this.start);

            // Step 3 - Remove wall
            this.removeWalls(this.start, next);

            this.start = next;
            this.deadend = true;

        } else if (this.history.length > 0) {
            if (this.deadend) {
                this.deadends.push(this.start.index(this.numRows));
                this.deadend = false;
            }

            this.start = this.history.pop();
        }

        if (this.deadends.length > 0) {
            this.finish = this.grid[Math.max(...this.deadends)];
        }

        return this.start !== this.grid[0];
    };

    /**
     * Creates the grid in preparation for generating the maze.
     *
     * @returns {Maze}
     */
    this.initialize = function() {
        this.numColumns = Math.floor(this.width / this.cellSize);
        this.numRows = Math.floor(this.height / this.cellSize);

        this.width = this.numColumns * this.cellSize;
        this.height = this.numRows * this.cellSize;

        for (let row = 0; row < this.numColumns; row++) {
            for (let column = 0; column < this.numRows; column++) {
                let tile = new Tile(row, column, this.cellSize);
                this.grid.push(tile);
            }
        }

        this.start = this.grid[0];
        this.finish = this.grid[0];

        return this;
    };

    this.reset = function(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.deadends = [];
        this.history = [];
        this.grid = [];

        this.initialize();
    };

    /**
     * Render the tiles for the maze.
     *
     * @return {Maze}
     */
    this.render = function() {
        for (let tile of this.grid) {
            tile.render(this.numColumns);
        }

        for (let tile of this.history) {
            tile.breadcrumb(0, 0, 0, 100);
        }

        this.start.highlight(0, 220, 0);
        this.finish.highlight(220, 0, 0);

        return this;
    }
}
