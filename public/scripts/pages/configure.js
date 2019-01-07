let startColor = '#00AA00';
let finishColor = '#AA0000';
let wallColor = '#000000';
let canvas = null;
let img = null;
let width = 0;
let height = 0;
let url = null;


function preload() {
    url = $('#maze-container').data('url');
    width = $('#maze-container').data('width');
    height = $('#maze-container').data('height');

    img = loadImage(url);
}

function setup() {

    this.canvas = createCanvas(width, height);
    this.canvas.canvas.style.display = 'none';

    image(img, 0, 0, width, height);

    // Load the Pixels
    loadPixels();

    let colors = {};
    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            let pixel = get(w, h);
            if (colors[pixel] === undefined) {
                colors[pixel] = {
                    count: 0,
                    color: pixel,
                };
            }

            colors[pixel].count++;
        }
    }


    colors = Object.entries(colors)
                   .reduce((accumulator, value, index, array) => {
                       accumulator.push(value);
                       return accumulator
                   }, [])
                   .sort((a,b) => {
                       if (a[1].count === b[1].count) {
                           return 0;
                       }
                       return b[1].count - a[1].count;
                   });

    // Second most popular color is wall
    wallColor = colors[1].color;

    // First color that is not popular is start
    wallColor = colors[1].color;

    // Second color that is not popular is finish
    wallColor = colors[1].color;

    noLoop();
}

function draw() {

}
