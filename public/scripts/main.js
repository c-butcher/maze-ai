let controller = new Controller(1280, 720, 40);

function setup() {

    jQuery('#controller').dialog({
        resizable: false,
        minimizable: true,
        minimizeLocation: 'right',
        width: 280,
    });

    controller.initialize({
        width: document.getElementById('maze-width'),
        height: document.getElementById('maze-height'),
        cellSize: document.getElementById('maze-cell-size'),
        frameRate: document.getElementById('maze-frame-rate'),
        restart: document.getElementById('maze-restart'),
    });
}

function draw() {
    background(255);
    color(0);

    controller.draw();
}

function updateWindow() {
    resizeCanvas(maze.width, maze.height);
}
