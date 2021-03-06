const util = require('util');
util.inspect.maxArrayLength = 500;

const express = require('express');
const helmet = require('helmet');
const database = require('./db');

const app = express();
const port = 3000;

global.imgPath = __dirname + '/public/images/';
global.imgURL = '/web/images/';

app.use(helmet());
app.use(database({name: 'mazes'}));
app.use(express.urlencoded({extended: true, limit: '5mb', parameterLimit: 9999999}));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/web', express.static('public'));
app.use('/web/p5', express.static('node_modules/p5/lib'));
app.use('/web/tf', express.static('node_modules/@tensorflow/tfjs/dist'));

app.use('/', require('./controllers/mazes'));
app.use('/learn', require('./controllers/learning'));

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    res.status(500);
    res.json({
        error: err
    });
});

app.listen(port, () => console.log(`Maze generator listening on port ${port}!`));
