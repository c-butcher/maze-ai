let canvas = null;
let maze = null;

function setup() {
    maze = {
        image: null,
        url: $('#maze-container').data('url'),
        width: $('#maze-container').data('width'),
        height: $('#maze-container').data('height')
    };

    canvas = createCanvas(maze.width, maze.height);
    canvas.parent('#maze-container');

    maze.image = loadImage(maze.url);
}

function draw() {
    background(0);

    image(maze.image, 0, 0, width, height);
}
