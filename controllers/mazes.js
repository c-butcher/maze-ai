const router = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');

/**
 * List Mazes
 *
 * This page displays a list of available mazes.
 */
router.get('/', (req, res) => {
    let files = fs.readdirSync(global.imgPath);

    let mazes = [];
    for (let file of files) {
        let temp = file.split('.');
        if (temp.length !== 2 || temp[1] !== 'png') {
            continue;
        }

        mazes.push({
            name: temp[0],
            filename: file,
            url: global.imgURL + file
        });
    }

    res.render('mazes/list', {
        title: 'List of Mazes',
        mazes
    });
});

/**
 * Save Maze Image
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

/**
 * Generate Maze
 *
 * This page generates and saves mazes.
 */
router.get('/generate', (req, res) => {
    res.render('mazes/generator');
});

module.exports = router;
