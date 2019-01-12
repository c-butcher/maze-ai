const router = require('express').Router();
const fs = require('fs');
const Maze = require('../models/maze');

/**
 * Configure the learning algorithm before we start attempting
 * to solve the puzzle.
 *
 */
router.get('/solve/:name', (req, res) => {
    Maze.findOne({name: req.params.name}, (error, maze) => {
        if (error) { throw error; }

        let path = imgPath + req.params.name + '.png';
        if (!maze || !fs.existsSync(path)) {
            return res.redirect('/');
        }

        res.render('learn/solve', {
            title: "Training Maze",
            maze: maze
        });
    });
});

module.exports = router;
