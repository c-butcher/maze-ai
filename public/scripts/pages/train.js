let canvas = null;
let trainer = null;
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

                trainer = new MazeTrainer(maze);
                trainer.train();
            });
        }
    });
}

function draw() {
    if (maze) {
        background(0);
        image(maze.getImage(), 0, 0);
    }
}
