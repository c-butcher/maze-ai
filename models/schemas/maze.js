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
    wallColor: 'string',
    pathToFinish: 'array'
});

schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

module.exports = schema;
