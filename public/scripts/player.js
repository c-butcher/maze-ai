function Player(options = {}) {
    options = Object.assign({}, this._defaults, options);

    this._maze = options.maze;
    this._size = options.size || options.maze.getNodeSize() / 4;
    this._position = options.position;
    this._velocity = options.velocity;
    this._target = options.target;
    this._color = options.color;
    this._finished = false;
    this._moving = false;
    this._score = options.score;
    this._attempt = options.attempt;
    this._keyBindings = options.keyBindings;

    this._position = this._maze.getStart();
    this._target   = this._maze.getStart();
    this._history  = [this._maze.getStart()];
}

/**
 * Default options for the player.
 *
 * @type {{score: number, keyBindings: {DOWN: string, LEFT: string, RIGHT: string, UP: string}, size: null, color: number, position: p5.Vector, velocity: p5.Vector, maze: {}, attempt: number, target: p5.Vector}}
 * @private
 */
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
        RIGHT: 'ArrowRight',
        DOWN: 'ArrowDown',
        LEFT: 'ArrowLeft',
        all: function() {
            return [
                this.UP,
                this.RIGHT,
                this.DOWN,
                this.LEFT,
            ];
        }
    }
};

/**
 * Returns an instance of the maze.
 *
 * @returns {Maze}
 */
Player.prototype.getMaze = function() {
    return this._maze;
};

/**
 * Move the player to its new _position.
 *
 * @param {string} key
 */
Player.prototype.move = function(key) {
    if (!this._moving && this._keyBindings.all().includes(key)) {
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

        let nodeSize = this._maze.getNodeSize();

        this._target = this._position.copy().add(this._velocity.copy().mult(nodeSize));
        this._history.push(this._target.copy().sub(nodeSize / 2, nodeSize / 2));
        this._moving = true;
    }
};

/**
 * Calculate how many extra moves the player has taken.
 *
 * @returns {number}
 */
Player.prototype.calculateExtraMoves = function() {
    return this._history.length - this._maze.getPath().length;
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
        this._score = ((this._maze.getPath().length - 1) / (this._history.length - 1) * 100).toFixed(1);
        this._score -= this._attempt;
    }

    return this._score;
};

/**
 * Re-spawn the player at the beginning of the maze and reset their stats.
 */
Player.prototype.respawn = function() {
    this._history = [this._maze.getStart()];
    this._target = this._maze.getStart();
    this._position = this._maze.getStart();
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
    let color = this._maze.getPixelColor(this._position);
    return this._maze.getWallColor().matches(color);
};

/**
 * Check whether the player has finished the maze.
 *
 * @param {p5.Vector} finish
 *
 * @returns {Query|Boolean|boolean|*}
 */
Player.prototype.isFinished = function(finish) {
    this._finished = this._position.equals(finish);
    return this._finished;
};


/**
 * Render the little ball of joy!
 */
Player.prototype.render = function() {
    fill(this._color);
    ellipse(this._position.x, this._position.y, this._size);
};
