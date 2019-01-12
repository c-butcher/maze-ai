let player = null;
let maze = null;
let isReady = false;

function setup() {
    let name = $('#maze-container').data('name');
    $.ajax({
        url: "/fetch/" + name,
        success: function(response) {
            maze = response.maze;
            maze.startColor = hexToColor(maze.startColor);
            maze.finishColor = hexToColor(maze.finishColor);
            maze.floorColor = hexToColor(maze.floorColor);
            maze.wallColor = hexToColor(maze.wallColor);

            loadImage("/web/images/" + maze.image, (img) => {
                maze.image = img;
                canvas = createCanvas(maze.width, maze.height);
                canvas.parent('#maze-container');

                player = new MazePlayer({
                    maze: maze,
                });

                isReady = true;
            });
        }
    });
}

function draw() {
    background(0);

    if (isReady) {
        image(maze.image, 0, 0);
        player.update();
        player.render();
    }
}

function keyPressed() {
    if (!player.isMoving()) {
        player.move(key);
    }
}
