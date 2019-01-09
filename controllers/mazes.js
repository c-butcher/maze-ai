const router = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');
const Maze = require('../models/maze');

/**
 * List Mazes
 *
 * This page displays a list of available mazes.
 */
router.get('/', (req, res, next) => {
    Maze.find({}, (error, mazes) => {
        if (error ) { return next(error); }

        res.render('mazes/list', {
            title: 'List of Mazes',
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
    let train = '/learn/configure/' + name;

    fs.writeFileSync(filepath, image, {
        encoding: 'base64',
        flag: 'w+'
    });

    req.body.name = name;
    req.body.image = filename;

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
    res.render('mazes/generator');
});

module.exports = router;
