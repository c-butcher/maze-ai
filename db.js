const mongoose = require('mongoose');

function database(options) {
    options = Object.assign(_defaults, options);

    return function(req, res, next) {
        req.db = mongoose.connect(`mongodb://${options.host}:${options.port}/${options.name}`, {useNewUrlParser: true}, (error, database) => {
            if (error) { throw error; }
            next();
        });
    };
}

let _defaults = {
    name: 'default',
    host: 'localhost',
    port: 27017,
};

module.exports = database;
