const mongoose = require('mongoose');
const schema = require('./schemas/maze.js');

module.exports = mongoose.model('Maze', schema);
