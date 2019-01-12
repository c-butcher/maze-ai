function Scoreboard (player) {
    this.player = player;
    this.maze   = player.getMaze();
    this.inputs = {
        respawn: null,
        attempts: null,
        moves: null,
        score: null
    };
}

Scoreboard.prototype.initialize = function(elements = {}) {
    console.log(elements);
    if (elements.respawn) {
        this.inputs.respawn = elements.respawn;
        this.inputs.respawn.click = () => {
            this.player.respawn();
            loop();
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

Scoreboard.prototype.render = function() {
    let score = this.player.calculateScore();

    this.inputs.attempts.value = this.player._attempt;
    this.inputs.moves.value    = (this.player._history.length - 1) + " / " + (this.maze.pathToFinish.length - 1);
    this.inputs.score.value    = score;
};
