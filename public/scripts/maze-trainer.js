/**
 *
 * @param {Maze} maze
 * @param {*} options
 *
 * @constructor
 */
function MazeTrainer(maze, options = {})
{
    options = Object.assign({}, this._defaults, options);

    this.maze = maze;
    this.learningRate = options.learningRate;
    this.iterations = options.iterations;
    this.batchSize = options.batchSize;
    this.batches = options.batches;
}

MazeTrainer.prototype.model = function() {
    const model = tf.sequential();
    const stride = Math.floor(this.maze.getNodeSize() / 2);

    model.add(tf.layers.conv2d({
        inputShape: [this.maze.getWidth(), this.maze.getHeight(), 1],
        kernelSize: this.maze.getNodeSize(),
        filters: 8,
        strides: this.maze.getNodeSize(),
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [stride, stride],
        strides: [stride, stride]
    }));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: (this.maze.getWidth() / this.maze.getNodeSize()) * (this.maze.getHeight() / this.maze.getNodeSize()),
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax'
    }));

    const optimizer = tf.train.sgd(this.learningRate);
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};

MazeTrainer.prototype.train = async function() {
    let model = this.model();
    let validationData;

    for (let i = 0; i < this.batches; i++) {
        let batch = await this.loadBatch(i);

        console.log(batch);

        /*
        if (i % this.testFrequency === 0) {
            let testBatch = data.nextTestBatch(this.batchSize);
            validationData = [
                testBatch.xs.reshape([this.batchSize, this.maze.getWidth(), this.maze.getHeight(), 1]), testBatch.labels
            ];
        }
        */
        const history = await model.fit(
            batch.xs.reshape([this.batchSize, this.maze.getWidth(), this.maze.getHeight(), 4]),
            batch.labels,
            {
                batchSize: this.batchSize,
                validationData,
                epochs: 1
            });

        const loss = history.history.loss[0];
        const accuracy = history.history.acc[0];

        console.log(history.history);
    }
};

/**
 * Load the next training batch.
 *
 * @param {Number} page
 */
MazeTrainer.prototype.loadBatch = function(page) {
    return $.ajax({
        url: '/search',
        method: 'POST',
        data: {
            offset: this.batchSize * page,
            limit: this.batchSize,
            width: this.maze.getWidth(),
            height: this.maze.getHeight(),
            nodeSize: this.maze.getNodeSize(),
        }
    }).then(async function(response) {
        if (!response.mazes || response.mazes.length < 1) {
            return null;
        }


        let mazes = [];
        for (let i = 0; i < response.mazes.length; i++) {
            let img = await loadImage("/web/images/" + response.mazes[i].image);
            response.mazes[i].image = img;
            img.loadPixels();

            mazes.push(Array.from(img.pixels));

            let maze = new Maze(response.mazes[i]);
            mazes.push(tf.tensor3d(Array.from(img.pixels), [maze.getWidth(), maze.getHeight(), 4]));
        }

        return tf.tensor4d(mazes, [maze.getWidth(), maze.getHeight(), 4, mazes.length]);
    });
};

MazeTrainer.prototype._defaults = {
    learningRate: 0.01,
    iterations: 20,
    testFrequency: 5,
    batchSize: 3,
    batches: 5,
};
