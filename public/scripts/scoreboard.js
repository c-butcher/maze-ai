function Scoreboard (player, elements = {}) {
    this.player = player;
    this.maze   = player.getMaze();
    this.inputs = {
        respawn: null,
        attempts: null,
        moves: null,
        score: null
    };

    this.initialize(elements);
}

/**
 *
 * @param elements
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
    let score = this.player.calculateScore();

    this.inputs.attempts.value = this.player._attempt;
    this.inputs.moves.value    = (this.player._history.length - 1) + " / " + (this.maze.getPath().length - 1);
    this.inputs.score.value    = score;
};
