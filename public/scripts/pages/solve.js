let canvas = null;

/**
 *
 * @type {MazeSolver|null}
 */
let society = null;

let maze = null;

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
                society.populate();
            });
        }
    });
}

function draw() {
    if (society) {
        background(society.maze.image);
        society.advance();
    }
}
