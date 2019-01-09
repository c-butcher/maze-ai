const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: 'string',
    image: 'string',
    width: 'number',
    height: 'number',
    nodeSize: 'number',
    startColor: 'string',
    finishColor: 'string',
    floorColor: 'string',
    wallColor: 'string'
});

module.exports = schema;
