const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

app.use(helmet());

app.use('/web', express.static('public'));
app.use('/web/p5', express.static('node_modules/p5/lib'));

app.set('views', './views');
app.set('view engine', 'pug');

app.post('/save', (req, res) => {

});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'The Maze Generator'
    });
});

app.listen(port, () => console.log(`Maze generator listening on port ${port}!`));
