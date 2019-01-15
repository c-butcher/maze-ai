let controller = new Controller(800, 600, 40);

function setup() {
    controller.initialize({
        container: document.getElementById('maze-generator'),
        width: document.getElementById('maze-width'),
        height: document.getElementById('maze-height'),
        cellSize: document.getElementById('maze-cell-size'),
        frameRate: document.getElementById('maze-frame-rate'),
        continuous: document.getElementById('maze-continuous'),
        breadcrumbs: document.getElementById('maze-breadcrumbs'),
        renderAtFinish: document.getElementById('maze-render-at-finish'),
        download: document.getElementById('maze-download'),
        train: document.getElementById('maze-train'),
        restart: document.getElementById('maze-restart'),
    });
}

function draw() {
    background(255);
    color(0);

    controller.draw();
}
