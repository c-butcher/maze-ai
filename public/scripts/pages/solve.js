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

            loadImage("/web/images/" + maze.image, (img) => {
                maze.image = img;
                canvas = createCanvas(maze.width, maze.height);
                canvas.parent('#maze-container');

                maze = new Maze(maze);
                society = new MazeSolver(maze);
                society.populate();
                society.release();
            });
        }
    });
}

function draw() {
    if (society) {
        background(0);
        image(maze.getImage(), 0, 0);
        society.advance();
    }
}
