function MazePlayer(options = {}) {
    options = Object.assign({}, this._defaults, options);

    this._maze = options.maze;
    this._size = options.size;
    this._position = options.position;
    this._velocity = options.velocity;
    this._target = options.target;
    this._start = null;
    this._finish = null;
    this._color = options.color;
    this._finished = false;
    this._moving = false;
    this._keyBindings = options.keyBindings;

    this.findStartAndFinish();
    this._position = this._start.copy();
    this._target = this._start.copy();
}

MazePlayer.prototype._defaults = {
    maze: null,
    size: 5,
    position: null,
    velocity: null,
    target: null,
    color: 0,
    keyBindings: {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        RIGHT: 'ArrowRight',
        LEFT: 'ArrowLeft',
    }
};

MazePlayer.prototype.findStartAndFinish  = function() {
    for (let row = 0; row <= this.maze.width / this.maze.nodeSize; row++) {
        for (let column = 0; column <= this.maze.height / this.maze.nodeSize; column++) {
            let x = (row * this.maze.nodeSize) - this.maze.nodeSize / 2;
            let y = (column * this.maze.nodeSize) - this.maze.nodeSize / 2;

            let color = this.maze.image.get(x, y);

            if (this.maze.startColor.matches(color)) {
                this.start = createVector(x, y);

            } else if (this.maze.finishColor.matches(color)) {
                this.finish = createVector(x, y);
            }
        }
    }
};

/**
 * Move the player to its new _position.
 *
 * @param {string} key
 */
MazePlayer.prototype.move = function(key) {
    if (!this._moving) {
        switch (key) {
            case this._keyBindings.UP:
                this._velocity.set(0, -1);
                break;

            case this._keyBindings.DOWN:
                this._velocity.set(0, 1);
                break;

            case this._keyBindings.LEFT:
                this._velocity.set(-1, 0);
                break;

            case this._keyBindings.RIGHT:
                this._velocity.set(1, 0);
                break;
        }

        this._target = this._position.copy().add(this._velocity.mult(this._maze.nodeSize));
        this._moving = true;

    } else {
        this._position.add(this._velocity);
    }
};

MazePlayer.prototype.isMoving = function() {
    return this._moving;
};

/**
 * Check to see if the player has reached their _target _position.
 *
 * @returns {boolean}
 */
MazePlayer.prototype.isAtTargetPosition = function() {
    if (this._position.dist(this._target) < 2) {
        this._velocity.mult(0);
        this.isMoving = false;
    }

    return !this.isMoving;
};

/**
 * Check whether the player has finished the _maze.
 *
 * @returns {Query|Boolean|boolean|*}
 */
MazePlayer.prototype.isFinished = function() {
    return this._finished = this._position.equals(this._finish);
};


/**
 * Render the little ball of joy!
 */
MazePlayer.prototype.render = function() {
    fill(this._color);
    ellipse(this._position.x, this._position.y, this._size);
};
