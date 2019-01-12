let maze = null;
let player = null;
let scoreboard = null;

/**
 * Disables the page from scrolling when the arrow keys are used.
 * This makes it so we can play our game without affecting the browsers page position.
 */
window.addEventListener("keydown", (event) => {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
}, false);

function setup() {

    /**
     * We are storing the mazes name in a data attribute, then we use the name to do
     * an ajax query. The reason why we're using an ajax method rather than interpolation
     * is because NodeJS's utility inspector along with pugs interpolation features weren't
     * allowing me to transfer an array with over one hundred indexes.
     */
    let name = document.getElementById('maze-container').dataset.name;
    $.ajax({
        url: "/fetch/" + name,
        success: function(response) {
            if (!response.success) {
                return alert("Unable to load the maze.\r\n" + response.error);
            }

            loadImage("/web/images/" + response.maze.image, (img) => {
                response.maze.image = img;

                maze = new Maze(response.maze);
                player = new Player({ maze });
                scoreboard = new Scoreboard(player, {
                    respawn: document.getElementById('scoreboard-respawn'),
                    attempts: document.getElementById('scoreboard-attempts'),
                    moves: document.getElementById('scoreboard-moves'),
                    score: document.getElementById('scoreboard-score'),
                });

                canvas = createCanvas(maze.getWidth(), maze.getHeight());
                canvas.parent('#maze-container');
            });
        }
    });
}

function draw() {
    background(0);

    if (player) {
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
