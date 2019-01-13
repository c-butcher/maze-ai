function Player(options = {}) {
    options = Object.assign({}, this._defaults, options);

    this._size = options.size || options.distance / 4;
    this._position = options.position;
    this._velocity = options.velocity;
    this._distance = options.distance;
    this._target = options.target;
    this._color = options.color;
    this._finished = false;
    this._moving = false;
    this._history = [this._position];
    this._keyBindings = options.keyBindings;
}

/**
 * Default options for the player.
 *
 * @type {{keyBindings: {DOWN: string, LEFT: string, RIGHT: string, UP: string}, size: null, color: number, position: p5.Vector, velocity: p5.Vector, target: p5.Vector}}
 * @private
 */
Player.prototype._defaults = {
    size: null,
    position: new p5.Vector(),
    velocity: new p5.Vector(),
    target: new p5.Vector(),
    distance: 40,
    color: 0,
    keyBindings: {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        RIGHT: 'ArrowRight',
        LEFT: 'ArrowLeft',
    }
};

/**
 * Returns the history of the players moves.
 *
 * @returns {Array<Number[]>}
 */
Player.prototype.getHistory = function() {
    return this._history;
};

/**
 * Returns a copy of the players position.
 *
 * @returns {p5.Vector}
 */
Player.prototype.getPosition = function() {
    return this._position.copy();
};

/**
 * Sets the position of the player.
 *
 * @params {p5.Vector} position
 */
Player.prototype.setPosition = function(position) {
    this._position = position;
};

/**
 * Returns a copy of the players position.
 *
 * @returns {p5.Vector}
 */
Player.prototype.getTarget = function() {
    return this._target.copy();
};

/**
 * Returns a copy of the players current velocity.
 *
 * @returns {p5.Vector}
 */
Player.prototype.getVelocity = function() {
    return this._velocity.copy();
};

/**
 * Sets the velocity of the player.
 *
 * @params {p5.Vector} velocity
 */
Player.prototype.setVelocity = function(velocity) {
    this._velocity = velocity;
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
 * Check to see if the player is at a specific position.
 *
 * @returns {boolean}
 */
Player.prototype.isAtPosition = function(position) {
    return this._position.equals(position);
};

/**
 * Move the player to its new _position.
 *
 * @params {string} key
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

        this._target = this._position.copy().add(this._velocity.copy().mult(this._distance));
        this._history.push(this._target.copy().sub(this._distance / 2, this._distance / 2));
        this._moving = true;
    }
};

/**
 * Re-spawn the player at the specific location.
 *
 * @params {p5.Vector} position
 */
Player.prototype.respawn = function(position) {
    this._history = [position.copy()];
    this._target = position.copy();
    this._position = position.copy();
    this._moving = false;

    if (this._finished) {
        this._finished = false;
    }
};

/**
 * Update the player's information.
 */
Player.prototype.update = function() {
    if (this.isAtPosition(this._target)) {
        this._moving = false;
    }

    if (this._moving) {
        this._position.add(this._velocity);
    }
};

/**
 * Render the little ball of joy!
 */
Player.prototype.render = function() {
    fill(this._color);
    ellipse(this._position.x, this._position.y, this._size);
};
