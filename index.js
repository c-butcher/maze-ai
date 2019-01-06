const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const port = 3000;

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
    let filepath = __dirname + '/public/images/' + filename;

    fs.writeFileSync(filepath, image, {
        encoding: 'base64',
        flag: 'w+'
    });

    return res.json({
        success: true,
        filename: filename,
    });
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'The Maze Generator'
    });
});

app.listen(port, () => console.log(`Maze generator listening on port ${port}!`));
