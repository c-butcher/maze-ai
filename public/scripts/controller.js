function Controller(width, height, cellSize) {
    this.width       = width;
    this.height      = height;
    this.cellSize    = cellSize;
    this.container   = null;
    this.frameRate   = 10;
    this.breadcrumbs = false;
    this.canvas      = null;
    this.maze        = new Maze(width, height, cellSize);

    this.inputs = {
        width: null,
        height: null,
        cellSize: null,
        frameRate: null,
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

        if (inputs.frameRate) {
            this.inputs.frameRate = inputs.frameRate;
            this.inputs.frameRate.value = this.frameRate;

            this.inputs.frameRate.onchange = () => {
                this.frameRate = parseInt(this.inputs.frameRate.value);
                frameRate(this.frameRate);
            }
        }

        if (inputs.breadcrumbs) {
            this.inputs.breadcrumbs = inputs.breadcrumbs;
            this.inputs.breadcrumbs.value = this.breadcrumbs;
            this.inputs.breadcrumbs.checked = this.breadcrumbs;

            this.inputs.breadcrumbs.onchange = () => {
                this.breadcrumbs = this.inputs.breadcrumbs.checked;
                this.maze.showBreadcrumbs(this.breadcrumbs);
            }
        }

        if (inputs.download) {
            this.inputs.download = inputs.download;
        }

        if (inputs.train) {
            this.inputs.train = inputs.train;
        }

        if (inputs.restart) {
            this.inputs.restart = inputs.restart;
            this.inputs.restart.onclick = () => {
                this.width = this.inputs.width ? parseInt(this.inputs.width.value) : this.width;
                this.height = this.inputs.height ? parseInt(this.inputs.height.value) : this.height;
                this.cellSize = this.inputs.cellSize ? parseInt(this.inputs.cellSize.value) : this.cellSize;
                this.frameRate = this.inputs.frameRate ? parseInt(this.inputs.frameRate.value) : this.frameRate;

                $(this.inputs.download).addClass('disabled');
                $(this.inputs.train).addClass('disabled');

                this.start();
            }
        }

        if (inputs.container) {
            this.container = inputs.container;
        }

        if (inputs.save) {
            this.inputs.save = inputs.save;
            this.inputs.save.onclick = () => {
                this.save();
            }
        }

        frameRate(this.frameRate);

        this.start();
    };

    this.save = function() {
        $.ajax({
            url: '/save',
            type: 'POST',
            data: {
                image: this.canvas.canvas.toDataURL('image/png')
            },
            success: (response) => {
                $(this.inputs.download).attr('href', response.url).removeClass('disabled');
                $(this.inputs.train).attr('href', response.train).removeClass('disabled');
            }
        })
    };

    this.start = function() {
        if (this.canvas) {
            this.canvas.canvas.remove();
        }

        this.maze = new Maze(this.width, this.height, this.cellSize);
        this.maze.initialize();
        this.maze.showBreadcrumbs(this.breadcrumbs);

        this.canvas = createCanvas(this.maze.width, this.maze.height, 'WEBGL');
        this.canvas.parent(this.container);
        this.canvas.resize(this.maze.width, this.maze.height);

        loop();
    };

    this.draw = function() {
        if (!this.maze.next()) {
            noLoop();

            setTimeout(() => { this.save(); }, 100);
        }

        this.maze.render();
    };
}
