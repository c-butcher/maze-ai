function Scoreboard (player, elements = {}) {
    this.player = player;
    this.maze   = player.getMaze();
    this.score  = 100;
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
 * @param {*} elements
 */
Scoreboard.prototype.initialize = function(elements = {}) {
    if (elements.respawn) {
        if (this.inputs.respawn) {
            this.inputs.respawn.onclick = null;
        }

        this.inputs.respawn = elements.respawn;
        this.inputs.respawn.onclick = () => {
            if (this.player._history.length > 1) {
                this.player.respawn();
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

    this.inputs.attempts.value = this.player.getAttempts();
    this.inputs.moves.value    = (this.player.getHistory().length - 1) + " / " + (this.maze.getPath().length - 1);
    this.inputs.score.value    = this.score;
};

/**
 * Calculates a players score.
 *
 * @param player
 * @returns {*}
 */
Scoreboard.prototype.calculateScore = function(player) {
    let attempts = player.getAttempts();
    let history = player.getHistory();
    let path = this.maze.getPath();
    let extraMoves = history.length - path.length;

    // We subtract one percent for every failed attempt.
    this.score = 100 - attempts;

    // When a player has started to go over the optimal amount of moves
    // We calculate the percentage that a single tile is worth,
    // and then subtract it from our score.
    if (extraMoves > 0) {
        let percentOverOptimalPath = (extraMoves / (path.length - 1) * 100).toFixed(1);

        this.score -= percentOverOptimalPath;
    }

    return this.score;
};
