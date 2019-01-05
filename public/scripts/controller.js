function Controller(width, height, cellSize) {
    this.width    = width;
    this.height   = height;
    this.cellSize = cellSize;
    this.maze     = new Maze(width, height, cellSize);
    this.canvas   = null;

    this.inputs = {
        width: null,
        height: null,
        cellSize: null,
    };

    this.buttons = {
        restart: null,
    };

    this.initialize = function(inputs) {
        if (inputs.width) {
            this.inputs.width = inputs.width;
            this.inputs.width.value = this.width;
        }

        if (inputs.height) {
            this.inputs.height = inputs.height;
            this.inputs.height.value = this.height;
        }

        if (inputs.cellSize) {
            this.inputs.cellSize = inputs.cellSize;
            this.inputs.cellSize.value = this.cellSize;
        }

        if (inputs.restart) {
            this.inputs.restart = inputs.restart;
            this.inputs.restart.onclick = () => {
                this.width = this.inputs.width ? parseInt(this.inputs.width.value) : this.width;
                this.height = this.inputs.height ? parseInt(this.inputs.height.value) : this.height;
                this.cellSize = this.inputs.cellSize ? parseInt(this.inputs.cellSize.value) : this.cellSize;

                this.maze.reset(this.width, this.height, this.cellSize);

                resizeCanvas(this.maze.width, this.maze.height);

                this.start();
            }
        }

        if (inputs.save) {
            this.inputs.save = inputs.save;
            this.inputs.save.onclick = () => {
                this.save();
            }
        }

        this.start();
    };

    this.save = function() {

    };

    this.start = function() {
        this.maze = new Maze(this.width, this.height, this.cellSize);
        this.maze.initialize();

        resizeCanvas(this.maze.width, this.maze.height);

        this.inputs.save.disabled = true;

        loop();
    };

    this.draw = function() {
        if (!this.maze.next()) {
            this.inputs.save.disabled = false;
            noLoop();
        }

        this.maze.render();
    }
}

let controller = new Controller(1280, 720, 40);

function setup() {

    $('#controller').dialog({
        resizable: false,
        minimizable: true,
        minimizeLocation: 'right',
        width: 220,
    });

    controller.initialize({
        width: document.getElementById('maze-width'),
        height: document.getElementById('maze-height'),
        cellSize: document.getElementById('maze-cell-size'),
        restart: document.getElementById('maze-restart'),
        save: document.getElementById('maze-save'),
    });
}

let timer = null;
function draw() {
    background(255);
    color(0);

    controller.draw();
}

function updateWindow() {
    resizeCanvas(maze.width, maze.height);
}
