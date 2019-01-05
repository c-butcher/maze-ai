function Controller(width, height, cellSize) {
    this.width    = width;
    this.height   = height;
    this.cellSize = cellSize;
    this.maze     = new Maze(width, height, cellSize);

    this.inputs = {
        width: null,
        height: null,
        cellSize: null,
        restart: null,
        save: null,
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
    };
}
