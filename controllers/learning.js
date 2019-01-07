const router = require('express').Router();
const imageSize = require('image-size');
const fs = require('fs');

/**
 * Configure the learning algorithm before we start attempting
 * to solve the puzzle.
 *
 */
router.get('/configure/:name', (req, res) => {
    let name = req.params.name;
    let maze = {
        name: name,
        filename: name + '.png',
        path: global.imgPath + name + '.png',
        url: global.imgURL + name + '.png',
        width: 0,
        height: 0,
    };

    if (!fs.existsSync(maze.path)) {
        return res.redirect('/');
    }

    imageSize(maze.path, (error, size) => {
        if (error) { throw error; }

        maze.width = size.width;
        maze.height = size.height;

        res.render('learning/configure', {
            title: "Configure Maze",
            maze,
        });
    })
});

/**
 * Attempt to solve the puzzle.
 */
router.get('/solve/:name', (req, res) => {
    let name = req.params.name;
    let file = {
        name: name,
        filename: name + '.png',
        path: global.imgPath + name + '.png',
        url: global.imgURL + name + '.png',
    };

    if (!fs.existsSync(path)) {
        return res.redirect('/');
    }

    imageSize(path, (error, size) => {
        if (error) { throw error; }

        file.width = size.width;
        file.height = size.height;

        res.render('learning/solve', {
            title: "Solving Maze",
            file
        });
    });
});

module.exports = router;
