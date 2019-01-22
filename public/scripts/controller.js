function Controller(width, height, cellSize) {
    this.width          = width;
    this.height         = height;
    this.cellSize       = cellSize;
    this.startColor     = '#00AA00';
    this.finishColor    = '#AA0000';
    this.finishColor    = '#AA0000';
    this.floorColor     = '#FFFFFF';
    this.wallColor      = '#000000';
    this.container      = null;
    this.frameRate      = 10;
    this.breadcrumbs    = false;
    this.canvas         = null;
    this.isSaving       = false;
    this.renderAtFinish = false;
    this.maze           = new MazeGenerator(width, height, cellSize);

    this.inputs = {
        width: null,
        height: null,
        cellSize: null,
        frameRate: null,
        breadcrumbs: null,
        continuous: null,
        restart: null,
        download: null,
        train: null,
    };

    this.initialize = function(inputs) {
        if (inputs.container) {
            this.container = inputs.container;
        }

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

        if (inputs.renderAtFinish) {
            this.inputs.renderAtFinish = inputs.renderAtFinish;
            this.inputs.renderAtFinish.value = this.renderAtFinish;
            this.inputs.renderAtFinish.checked = this.renderAtFinish;

            this.inputs.renderAtFinish.onchange = () => {
                this.renderAtFinish = this.inputs.renderAtFinish.checked;
                this.maze.showOnFinished(this.renderAtFinish);
            }
        }

        if (inputs.continuous) {
            this.inputs.continuous = inputs.continuous;
            this.inputs.continuous.value = this.continuous;
            this.inputs.continuous.checked = this.continuous;

            this.inputs.continuous.onchange = () => {
                this.continuous = this.inputs.continuous.checked;
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

        frameRate(this.frameRate);

        this.start();
    };

    this.save = function() {
        $.ajax({
            url: '/save',
            type: 'POST',
            data: {
                image: this.canvas.canvas.toDataURL('image/png'),
                width: this.maze.width,
                height: this.maze.height,
                nodeSize: this.cellSize,
                startColor: this.startColor,
                finishColor: this.finishColor,
                floorColor: this.floorColor,
                wallColor: this.wallColor,
                pathToFinish: this.maze.pathToFinish
            },
            success: (response) => {

                if (this.continuous) {
                    setTimeout(() => { this.start(); }, 1000);

                } else {
                    $(this.inputs.download).attr('href', response.download).removeClass('disabled');
                    $(this.inputs.train).attr('href', response.train).removeClass('disabled');
                }
            }
        })
    };

    this.start = function() {
        this.isSaving = false;

        if (this.canvas) {
            this.canvas.canvas.remove();
        }

        this.maze = new MazeGenerator(this.width, this.height, this.cellSize);
        this.maze.initialize();
        this.maze.showBreadcrumbs(this.breadcrumbs);

        this.canvas = createCanvas(this.maze.width, this.maze.height);
        this.canvas.parent(this.container);
        this.canvas.resize(this.maze.width, this.maze.height);

        loop();
    };

    this.draw = function() {
        if (!this.maze.next()) {
            noLoop();

            if (!this.isSaving) {
                this.isSaving = setTimeout(() => { this.save(); }, 100);
            }
        }

        this.maze.render();
    };
}
