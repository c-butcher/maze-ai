let canvas = null;

/**
 *
 * @type {MazeSolver|null}
 */
let society = null;

let maze = null;

function hexToColor(value) {
    let hexes = value.replace('#', '').match(/.{1,2}/g);
    let digits = unhex(hexes);

    return color(...digits);
}

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

                society = new MazeSolver(maze);
            });
        }
    });
}

function draw() {
    if (society) {
        background(society.maze.image);
        if (!society.advance()) {
            society.repopulate();
        }
    }
}
