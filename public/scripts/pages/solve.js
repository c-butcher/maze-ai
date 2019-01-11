let canvas = null;
let organisms = [];
let numOrganisms = 20;

let society = null;

function hexToColor(value) {
    let hexes = value.replace('#', '').match(/.{1,2}/g);
    let digits = unhex(hexes);

    return color(...digits);
}

function setup() {
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

function draw() {
    background(maze.image);

    if (society) {
        if (!society.advance()) {
            society.repopulate();
        }
    }
}
