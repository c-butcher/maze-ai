function Scoreboard (player) {
    this.player = player;
    this.maze = player.getMaze();
}

Scoreboard.prototype.initialize = function() {
    $('#scoreboard-respawn').click(() => {
        this.player.respawn();
        loop();
    });
};

Scoreboard.prototype.render = function() {
    let score = this.player.calculateScore();

    $('#scoreboard-attempt').val(this.player._attempt);
    $('#scoreboard-moves').val((this.player._history.length - 1) + " / " + (this.maze.pathToFinish.length - 1));
    $('#scoreboard-score').val(score);
};
