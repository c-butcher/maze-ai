function Player(options = {}) {
    options = Object.assign({}, this._defaults, options);

    this._maze = options.maze;
    this._size = options.size || options.maze.nodeSize / 4;
    this._position = options.position;
    this._velocity = options.velocity;
    this._target = options.target;
    this._start = null;
    this._finish = null;
    this._color = options.color;
    this._finished = false;
    this._moving = false;
    this._score = options.score;
    this._attempt = options.attempt;
    this._keyBindings = options.keyBindings;

    this.findStartAndFinish();
    this._position = this._start.copy();
    this._target   = this._start.copy();
    this._history  = [this._start.copy()];
}

Player.prototype._defaults = {
    maze: {},
    size: null,
    score: 0,
    position: new p5.Vector(),
    velocity: new p5.Vector(),
    target: new p5.Vector(),
    color: 0,
    attempt: 0,
    keyBindings: {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        RIGHT: 'ArrowRight',
        LEFT: 'ArrowLeft',
    }
};

/**
 * Returns an instance of the maze.
 *
 * @returns {Player._defaults.maze|{}|*|null}
 */
Player.prototype.getMaze = function() {
    return this._maze;
};

/**
 * Figure out the start and finish points for the maze.
 */
Player.prototype.findStartAndFinish  = function() {
    for (let row = 0; row <= this._maze.width / this._maze.nodeSize; row++) {
        for (let column = 0; column <= this._maze.height / this._maze.nodeSize; column++) {
            let x = (row * this._maze.nodeSize) - this._maze.nodeSize / 2;
            let y = (column * this._maze.nodeSize) - this._maze.nodeSize / 2;

            let color = this._maze.image.get(x, y);

            if (this._maze.startColor.matches(color)) {
                this._start = new p5.Vector(x, y);

            } else if (this._maze.finishColor.matches(color)) {
                this._finish = new p5.Vector(x, y);
            }
        }
    }
};

/**
 * Move the player to its new _position.
 *
 * @param {string} key
 */
Player.prototype.move = function(key) {
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
        this._target = this._position.copy().add(this._velocity.copy().mult(this._maze.nodeSize));
        this._history.push(this._target.copy().sub(this._maze.nodeSize / 2, this._maze.nodeSize / 2));
        this._moving = true;
    }
};

/**
 * Calculate how many extra moves the player has taken.
 *
 * @returns {number}
 */
Player.prototype.calculateExtraMoves = function() {
    return this._history.length - this._maze.pathToFinish.length;
};

/**
 * Calculate the players score.
 *
 * Score = 100 Percent - Attempts - Percent of Extra Moves
 *
 * @returns {*}
 */
Player.prototype.calculateScore = function() {
    this._score = 100 - this._attempt;

    if (this.calculateExtraMoves() > 0) {
        this._score = ((this._maze.pathToFinish.length - 1) / (this._history.length - 1) * 100).toFixed(1);
        this._score -= this._attempt;
    }

    return this._score;
};

/**
 * Re-spawn the player at the beginning of the maze and reset their stats.
 */
Player.prototype.respawn = function() {
    this._history = [this._start.copy()];
    this._target = this._start.copy();
    this._position = this._start.copy();
    this._moving = false;
    this._attempt++;

    if (this._finished) {
        this._finished = false;
        this._attempt = 0;
    }
};

/**
 * Update the player's information.
 */
Player.prototype.update = function() {
    if (this.hasHitWall()) {
        this.respawn();
    }

    if (this.isAtTargetPosition()) {
        this._moving = false;
    }

    if (this._moving) {
        this._position.add(this._velocity);
    }
};

/**
 * Check whether the player is currently moving.
 *
 * @returns {boolean}
 */
Player.prototype.isMoving = function() {
    return this._moving;
};

/**
 * Check to see if the player has reached their _target _position.
 *
 * @returns {boolean}
 */
Player.prototype.isAtTargetPosition = function() {
    if (this._position.dist(this._target) <= 0) {
        this._velocity.mult(0);
        this._moving = false;
    }

    return !this._moving;
};

/**
 * Check to see if the player has hit a wall.
 *
 * @returns {boolean}
 */
Player.prototype.hasHitWall = function() {
    let color = this._maze.image.get(this._position.x, this._position.y);
    return color.toString() === this._maze.wallColor.levels.toString();
};

/**
 * Check whether the player has finished the _maze.
 *
 * @returns {Query|Boolean|boolean|*}
 */
Player.prototype.isFinished = function() {
    this._finished = this._position.equals(this._finish);
    return this._finished;
};


/**
 * Render the little ball of joy!
 */
Player.prototype.render = function() {
    fill(this._color);
    ellipse(this._position.x, this._position.y, this._size);
};
