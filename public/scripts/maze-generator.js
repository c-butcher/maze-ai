function MazeGenerator(width, height, cellSize) {

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
     * List of all the dead-ends that have been created, along with the route to the dead-end.
     *
     * @type {Map}
     */
    this.deadends = new Map();

    /**
     * Contains the correct path to the finish line.
     *
     * @type {Array}
     */
    this.pathToFinish = [];

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
     * Tells whether to render the history as breadcrumbs.
     *
     * @type {boolean}
     */
    this.breadcrumbs = false;

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
                let index = this.start.index(this.numRows);
                this.deadends.set(index, this.history.slice());

                // Figure out which dead-end is the farthest.
                let farthestDeadEnd = Math.max(...this.deadends.keys());
                if (index === farthestDeadEnd) {
                    this.finish = this.grid[farthestDeadEnd];
                    this.pathToFinish = [];

                    let path = this.deadends.get(farthestDeadEnd);
                    for (let i = 0; i < path.length; i++) {
                        this.pathToFinish.push([
                            path[i].row,
                            path[i].column
                        ]);
                    }

                    this.pathToFinish.push([
                        this.finish.row,
                        this.finish.column,
                    ]);

                    console.log(this.finish);
                    console.log(this.pathToFinish);
                }

                this.deadend = false;
            }

            this.start = this.history.pop();
        }

        return this.start !== this.grid[0];
    };

    /**
     * Creates the grid in preparation for generating the maze.
     *
     * @returns {MazeGenerator}
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
        this.deadends = new Map();
        this.history = [];
        this.grid = [];

        this.initialize();
    };

    /**
     * Tells whether we are showing the breadcrumbs.
     *
     * @param {boolean} isVisible
     * @returns {MazeGenerator}
     */
    this.showBreadcrumbs = function(isVisible) {
        this.breadcrumbs = isVisible;
        return this;
    };

    /**
     * Render the tiles for the maze.
     *
     * @return {MazeGenerator}
     */
    this.render = function() {
        for (let tile of this.grid) {
            tile.render(this.numColumns);
        }

        if (this.breadcrumbs && this.history.length > 0) {
            let count = 0;
            for (let tile of this.history) {
                tile.breadcrumb(0, 0, 0, count / this.history.length * 255);
                count++;
            }
        }

        this.start.highlight('#00AA00');
        this.finish.highlight('#AA0000');

        return this;
    }
}
