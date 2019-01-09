const MongoClient = require('mongodb').MongoClient;

function database(options) {
    options = Object.create(_defaults, options);

    return function(req, res, next) {
        MongoClient.connect(`mongodb://${options.host}:${options.port}/${options.database}`, { useNewUrlParser: true }, function (err, db) {
            if (err) { throw err; }

            req.db = db;

            next();
        });
    };
}

let _defaults = {
    host: 'localhost',
    port: 27017,
    database: null,
};

module.exports = database;
