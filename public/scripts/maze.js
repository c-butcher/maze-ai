/**
 * Create a new playable maze.
 *
 * @param {*} maze
 *
 * @constructor
 */
function Maze(maze) {
    this._image    = maze.image;
    this._width    = maze.width;
    this._height   = maze.height;
    this._nodeSize = maze.nodeSize;
    this._path     = maze.pathToFinish;
    this._startColor  = hexToColor(maze.startColor);
    this._finishColor = hexToColor(maze.finishColor);
    this._floorColor  = hexToColor(maze.floorColor);
    this._wallColor   = hexToColor(maze.wallColor);
    this._start  = null;
    this._finish = null;

    this.findStartAndFinish();
}

/**
 * Returns the background image for the maze.
 *
 * @returns {p5.Image}
 */
Maze.prototype.getImage = function() {
    return this._image;
};

/**
 * Returns the color for a pixel.
 *
 * @param {p5.Vector} position
 */
Maze.prototype.getPixelColor = function(position) {
    return this._image.get(position.x, position.y);
};

/**
 * Returns a copy of the path from start to finish.
 *
 * @returns {Array<Number[]>}
 */
Maze.prototype.getPath = function() {
    return this._path.slice();
};

/**
 * Returns the width of the maze.
 *
 * @returns {Number}
 */
Maze.prototype.getWidth = function() {
    return this._width;
};

/**
 * Returns the height of the maze.
 *
 * @returns {Number}
 */
Maze.prototype.getHeight = function() {
    return this._height;
};

/**
 * Returns the size of each node.
 *
 * @returns {Number}
 */
Maze.prototype.getNodeSize = function() {
    return this._nodeSize;
};

/**
 * Returns the color of the start node.
 *
 * @returns {p5.Color}
 */
Maze.prototype.getStartColor = function() {
    return this._startColor;
};

/**
 * Returns the color of the finish node.
 *
 * @returns {p5.Color}
 */
Maze.prototype.getFinishColor = function() {
    return this._finishColor;
};

/**
 * Returns the color of the floor nodes.
 *
 * @returns {p5.Color}
 */
Maze.prototype.getFloorColor = function() {
    return this._floorColor;
};

/**
 * Returns the color of the walls.
 *
 * @returns {p5.Color}
 */
Maze.prototype.getWallColor = function() {
    return this._wallColor;
};

/**
 * Returns the node that the maze starts on.
 *
 * @returns {p5.Vector}
 */
Maze.prototype.getStart = function() {
    return this._start.copy();
};

/**
 * Returns the node that the maze ends on.
 *
 * @returns {p5.Vector}
 */
Maze.prototype.getFinish = function() {
    return this._finish.copy();
};

Maze.prototype.isAtFinish = function(position) {

};

/**
 * Find the start and finish points for the maze.
 *
 * In order to speed this algorithm up, we've decided to only
 * sample the color at the center of each node.
 */
Maze.prototype.findStartAndFinish = function() {
    for (let row = 0; row <= this._width / this._nodeSize; row++) {
        for (let column = 0; column <= this._height / this._nodeSize; column++) {
            let x = (row * this._nodeSize) - this._nodeSize / 2;
            let y = (column * this._nodeSize) - this._nodeSize / 2;

            let color = this._image.get(x, y);

            if (this._startColor.matches(color)) {
                this._start = new p5.Vector(x, y);

            } else if (this._finishColor.matches(color)) {
                this._finish = new p5.Vector(x, y);
            }
        }
    }
};

/**
 * Tells whether the position is a wall.
 *
 * @param {p5.Vector} position
 *
 * @returns {boolean}
 */
Maze.prototype.isWall = function(position) {
    let color = this.getPixelColor(position);
    return this._wallColor.matches(color);
};

/**
 * Render the maze.
 */
Maze.prototype.render = function() {
    image(this._image, 0, 0);
};


