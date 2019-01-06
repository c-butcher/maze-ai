let img = null;
let imageUrl = null;
let width = null;
let height = null;

function preload() {
    width = document.getElementById('maze-container').getAttribute('data-width');
    height = document.getElementById('maze-container').getAttribute('data-height');
    imageUrl = document.getElementById('maze-container').getAttribute('data-url');
    img = loadImage(imageUrl);

    console.log(img);
}

function setup() {
    createCanvas(width, height);
    background(0);
    image(img, 0, 0, width, height);
}

function draw() {

}
