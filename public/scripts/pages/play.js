let maze = null;
let player = null;
let isReady = false;
let scoreboard = null;

/**
 * Disables the page from scrolling when the arrow keys are used.
 * This makes it so we can play our game without affecting the browsers page position.
 */
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function setup() {

    let name = $('#maze-container').data('name');
    $('body').keypress(function(event) {
        event.preventDefault();
    });

    $.ajax({
        url: "/fetch/" + name,
        success: function(response) {
            loadImage("/web/images/" + response.maze.image, (img) => {
                response.maze.image = img;

                maze = new Maze(response.maze);

                player = new Player({ maze });
                scoreboard = new Scoreboard(player);
                scoreboard.initialize({
                    respawn: document.getElementById('scoreboard-respawn'),
                    attempts: document.getElementById('scoreboard-attempts'),
                    moves: document.getElementById('scoreboard-moves'),
                    score: document.getElementById('scoreboard-score'),
                });

                canvas = createCanvas(maze.getWidth(), maze.getHeight());
                canvas.parent('#maze-container');

                isReady = true;
            });
        }
    });
}

function draw() {
    background(0);

    if (isReady) {
        image(maze.getImage(), 0, 0);

        player.update();
        player.render();

        scoreboard.render();

        if (player.isFinished()) {
            noLoop();
        }
    }
}

function keyPressed() {
    if (!player.isMoving()) {
        player.move(key);
    }
}
