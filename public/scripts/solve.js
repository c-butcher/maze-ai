let img = null;
let imageUrl = null;
let width = null;
let height = null;
let factory = null;

function preload() {
    width = document.getElementById('maze-container').getAttribute('data-width');
    height = document.getElementById('maze-container').getAttribute('data-height');
    imageUrl = document.getElementById('maze-container').getAttribute('data-url');
    img = loadImage(imageUrl);
}

function setup() {
    let position = new p5.Vector(25,25);
    factory = new VehicleFactory(position, function() {
        let theta = this.velocity.heading() + Math.PI / 2;

        fill(175);
        stroke(0);

        push();

        translate(this.location.x, this.location.y);

        rotate(theta);
        beginShape(p5.OPEN);
        vertex(0, -this.radius * 2);
        vertex(-this.radius, this.radius * 2);
        vertex(this.radius, this.radius * 2);
        endShape(p5.CLOSE);

        pop();
    });

    createCanvas(width, height);

    generateVehicles(1000, 3000);
}

/**
 * Start generating vehicles
 *
 * @param {number} min
 * @param {number} max
 */
function generateVehicles(min, max) {
    factory.create();

    setTimeout(() => {
        generateVehicles(min, max);
    }, Math.round(Math.random() * max) + min);
}

function draw() {
    background(0);
    image(img, 0, 0, width, height);

    factory.render();
}
