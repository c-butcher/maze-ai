function Scoreboard (maze, player, elements = {}) {
    this.maze   = maze;
    this.player = player;
    this.score  = 100;
    this.attempts = 0;
    this.inputs = {
        respawn: null,
        attempts: null,
        moves: null,
        score: null
    };

    this.initialize(elements);
}

/**
 * Initialize the scoreboard with the required DOM elements.
 *
 * @params {*} elements
 */
Scoreboard.prototype.initialize = function(elements = {}) {
    if (elements.respawn) {
        if (this.inputs.respawn) {
            this.inputs.respawn.onclick = null;
        }

        this.inputs.respawn = elements.respawn;
        this.inputs.respawn.onclick = () => {
            if (this.player.getHistory().length > 1) {
                let start = this.maze.getStart();

                this.player.respawn(start);
                this.attempts++;

                this.render();

                loop();
            }
        }
    }

    if (elements.attempts) {
        this.inputs.attempts = elements.attempts;
    }

    if (elements.moves) {
        this.inputs.moves = elements.moves;
    }

    if (elements.score) {
        this.inputs.score = elements.score;
    }
};

/**
 * Renders the values to our scoreboard.
 */
Scoreboard.prototype.render = function() {
    this.calculateScore(this.player);

    this.inputs.attempts.value = this.attempts;
    this.inputs.moves.value    = (this.player.getHistory().length - 1) + " / " + (this.maze.getPath().length - 1);
    this.inputs.score.value    = this.score;
};

/**
 * Increase the number of attempts made.
 */
Scoreboard.prototype.increaseAttempts = function() {
    this.attempts++;
};

/**
 * Calculates a players score.
 *
 * @params {Player} player
 *
 * @returns {*}
 */
Scoreboard.prototype.calculateScore = function(player) {
    let history = player.getHistory();
    let path = this.maze.getPath();
    let extraMoves = history.length - path.length;

    // We subtract one percent for every failed attempt.
    this.score = 100 - this.attempts;

    // When a player has started to go over the optimal amount of moves
    // We calculate the percentage that a single tile is worth,
    // and then subtract it from our score.
    if (extraMoves > 0) {
        let percentOverOptimalPath = (extraMoves / (path.length - 1) * 100).toFixed(1);

        this.score -= percentOverOptimalPath;
    }

    // Just making sure we don't go below zero.
    if (this.score < 0) {
        this.score = 0;
    }

    return this.score;
};
