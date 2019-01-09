const router = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');

/**
 * Split an array into chunks.
 *
 * @param {array} array
 * @param {number} columns
 */
function splitArray(array, columns = 3) {
    let chunked = [];

    if (array.length <= columns) {
        for (i = 0; i < array.length; i++) {
            chunked.push(array.slice(i, 1));
        }

    } else {

        let size = Math.ceil(array.length / columns);
        for (i = 0; i <= columns; i++) {
            let start = i * size;
            chunked.push(array.slice(i * size, start + size));
        }
    }

    return chunked;
}

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

    mazes = splitArray(mazes, 3);

    res.render('mazes/list', {
        title: 'List of Mazes',
        mazes
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
    let url = global.imgURL + filename;
    let train = '/learn/configure/' + name;

    fs.writeFileSync(filepath, image, {
        encoding: 'base64',
        flag: 'w+'
    });

    return res.json({
        success: true,
        name,
        filename,
        url,
        train
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
