function NotAMaze(options) {

    // Make sure that our options contain all of the options that we need,
    // setting default values for any options that were not supplied.
    options = Object.create(MazeGenerator.prototype._defaults, options);

    this.id = options.id;
    this.image = options.image;
    this.width = options.width;
    this.height = options.height;
    this.nodeSize = options.nodeSize;
    this.startColor = options.startColor;
    this.finishColor = options.finishColor;
    this.floorColor = options.floorColor;
    this.wallColor = options.wallColor;
}

/**
 * Default values for the
 * @type {{image: null, nodeSize: number, floorColor: string, width: number, finishColor: string, wallColor: string, height: number, startColor: string}}
 * @private
 */
MazeGenerator.prototype._defaults = {
    id: null,
    image: null,
    width: 800,
    height: 600,
    nodeSize: 40,
    startColor: '#00AA00',
    finishColor: '#AA0000',
    floorColor: '#FFFFFF',
    wallColor: '#000000'
};
