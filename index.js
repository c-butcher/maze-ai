const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

global.imgPath = __dirname + '/public/images/';
global.imgURL = '/web/images/';

app.use(helmet());
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/web', express.static('public'));
app.use('/web/p5', express.static('node_modules/p5/lib'));

app.use('/', require('./controllers/mazes'));
app.use('/learn', require('./controllers/learning'));

app.listen(port, () => console.log(`Maze generator listening on port ${port}!`));
