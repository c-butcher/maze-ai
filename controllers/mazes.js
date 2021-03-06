const router = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');
const Maze = require('../models/maze');

/**
 * Configure the learning algorithm before we start attempting
 * to solve the puzzle.
 *
 */
router.get('/play/:name', (req, res) => {
    Maze.findOne({name: req.params.name}, (error, maze) => {
        if (error) { throw error; }

        let path = imgPath + req.params.name + '.png';
        if (!maze || !fs.existsSync(path)) {
            return res.redirect('/');
        }

        res.render('mazes/play', {
            title: "Play Maze",
            maze: maze
        });
    });
});

/**
 * List Mazes
 *
 * This page displays a list of available mazes.
 */
router.get('/', (req, res, next) => {
    Maze.find({}, { _id: false }, (error, mazes) => {
        if (error ) { return next(error); }

        res.render('mazes/list', {
            title: 'List of Mazes',
            mazes
        });
    });
});

/**
 * List Mazes
 *
 * This page displays a list of available mazes.
 */
router.get('/fetch/:name', (req, res, next) => {
    Maze.findOne({name: req.params.name}, (error, maze) => {
        if (error) { next(error) }

        let path = imgPath + req.params.name + '.png';
        if (!maze || !fs.existsSync(path)) {
            return res.json({
                success: false,
                maze: null,
            });
        }

        res.json({
            success: true,
            maze
        })
    });
});

/**
 * Search mazes by width, height or node size.
 */
router.post('/search', (req, res, next) => {
    let search = {
        width: req.body.width,
        height: req.body.height,
        nodeSize: req.body.nodeSize
    };

    Maze.find(search)
        .skip(parseInt(req.body.offset))
        .limit(parseInt(req.body.limit))
        .exec((error, mazes) => {
            if (error) { next(error) }

            for (let i = 0; i < mazes.length; i++) {
                let path = imgPath + mazes[i].name + '.png';
                if (!mazes || !fs.existsSync(path)) {
                    return res.json({
                        success: false,
                        mazes: null,
                    });
                }
            }

            res.json({
                success: true,
                mazes
            });
        });
});

/**
 * Save MazeGenerator Image
 *
 * This is an AJAX method for saving a maze image.
 */
router.post('/save', (req, res) => {
    if (!req.body.image) {
        return res.json({
            success: false,
            error: "You must provide a base64 encoded image with the request."
        });
    }

    let image = req.body.image.replace(/^data:image\/png;base64,/, "");
    let name = crypto.createHash('md5').update(image).digest('hex');
    let filename = name + ".png";
    let filepath = global.imgPath + filename;
    let download = global.imgURL + filename;
    let train = '/learn/solve/' + name;

    fs.writeFileSync(filepath, image, {
        encoding: 'base64',
        flag: 'w+'
    });

    req.body.name = name;
    req.body.image = filename;

    // Apparently the number were turned to string when they were POST'ed.
    // So we need to convert them back to integers. Something is wrong with this.
    // TODO: Figure out why number are being turned into strings and try to avoid it.
    for (let i = 0; i < req.body.pathToFinish.length; i++) {
        req.body.pathToFinish[i][0] = parseInt(req.body.pathToFinish[i][0]);
        req.body.pathToFinish[i][1] = parseInt(req.body.pathToFinish[i][1]);
    }

    const maze = new Maze(req.body);

    maze.save((error) => {
        if (error) throw error;

        return res.json({
            success: true,
            maze,
            download,
            train,
        });
    });
});

/**
 * Generate MazeGenerator
 *
 * This page generates and saves mazes.
 */
router.get('/generator', (req, res) => {
    res.render('mazes/generator', {
        title: 'Generate Maze'
    });
});

module.exports = router;
