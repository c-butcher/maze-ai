const router = require('express').Router();
const imageSize = require('image-size');
const fs = require('fs');
const Maze = require('../models/maze');

/**
 * Configure the learning algorithm before we start attempting
 * to solve the puzzle.
 *
 */
router.get('/configure/:name', (req, res) => {
    Maze.findOne({name: req.params.name}, (error, maze) => {
        if (error) { throw error; }

        let path = imgPath + req.params.name + '.png';
        if (!maze || !fs.existsSync(path)) {
            return res.redirect('/');
        }

        res.render('learning/configure', {
            title: "Training Maze",
            maze,
        });
    });
});

module.exports = router;
