const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const fs = require('fs');
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

app.post('/save', (req, res) => {
    if (!req.param('image')) {
        return res.json({
            success: false,
            error: "You must provide a base64 encoded image with the request."
        });
    }

    let image = req.param('image').replace(/^data:image\/png;base64,/, "");
    let filename = crypto.createHash('md5').update(image).digest('hex') + ".png";
    let filepath = global.imgPath + filename;

    fs.writeFileSync(filepath, image, {
        encoding: 'base64',
        flag: 'w+'
    });

    return res.json({
        success: true,
        filename: filename,
    });
});

app.get('/generate', (req, res) => {
    res.render('generator');
});

app.get('/solve/:name', (req, res) => {
    let name = req.params.name;
    let filename = name + '.png';
    let path = global.imgPath + filename;
    let url = global.imgURL + filename;

    if (!fs.existsSync(path)) {
        return res.redirect('/');
    }

    return res.render('solve', {
        name,
        filename,
        url
    });
});

app.get('/', (req, res) => {

    let files = fs.readdirSync(__dirname + '/public/images/');

    let mazes = [];
    for (let file of files) {
        let temp = file.split('.');
        if (temp.length !== 2 || temp[1] !== 'png') {
            continue;
        }

        mazes.push({
            name: temp[0],
            filename: file,
        });
    }

    res.render('index', {
        mazes
    });
});

app.listen(port, () => console.log(`Maze generator listening on port ${port}!`));
