let canvas = null;
let maze = null;
let society = null;

let Materials = {
    UP: new p5.Vector(0, -1),
    DOWN: new p5.Vector(0, 1),
    LEFT: new p5.Vector(-1, 0),
    RIGHT: new p5.Vector(1, 0),
};

function hexToColor(value) {
    let hexes = value.replace('#', '').match(/.{1,2}/g);
    let digits = unhex(hexes);

    return color(...digits);
}

function setup() {
    frameRate(30);

    maze = {
        image: null,
        url: $('#maze-container').data('url'),
        width: $('#maze-container').data('width'),
        height: $('#maze-container').data('height'),
        startColor: hexToColor($('#maze-container').data('startColor')),
        finishColor: hexToColor($('#maze-container').data('finishColor')),
        floorColor: hexToColor($('#maze-container').data('floorColor')),
        wallColor: hexToColor($('#maze-container').data('wallColor'))
    };

    maze.startColor.setAlpha(255);
    maze.finishColor.setAlpha(255);
    maze.floorColor.setAlpha(255);
    maze.wallColor.setAlpha(255);

    society = new Society({
        materials: [
            Materials.UP,
            Materials.DOWN,
            Materials.LEFT,
            Materials.RIGHT,
        ],
        length: (maze.width / 40) * (maze.height / 40),
        maxSize: 5000,
        traits: {
            size: function() {
                return 5;
            },
            velocity: function() {
                return createVector(Math.random() * 1, Math.random() * 1)
            },
            position: function() {
                return createVector(20, 20);
            },
            distance: function() {
                return 40;
            },
        },
        isAlive: function() {
            if (!this.isDead) {
                let color = maze.image.get(this.traits.position.x, this.traits.position.y);
                if (color.toString() === maze.wallColor.levels.toString()) {
                    this.isDead = true;
                }
            }

            return !this.isDead;
        },
        progress: function() {
            if (!this.target || this.traits.position.copy().sub(this.target.copy()).mag() < 1) {
                if (this.dna.next()) {
                    this.traits.velocity = this.dna.current().get();
                    this.target = this.traits.position.copy().add(this.traits.velocity.copy().mult(this.traits.distance));
                }
            }

            this.traits.position.add(this.traits.velocity);
        },
        render: function() {
            fill(0);
            ellipse(this.traits.position.x, this.traits.position.y, this.traits.size, this.traits.size);
        }
    });

    canvas = createCanvas(maze.width, maze.height);
    canvas.parent('#maze-container');

    loadImage(maze.url, (img) => {
        maze.image = img;
        maze.image.loadPixels();
        image(maze.image, 0, 0, width, height);
    });
}

function draw() {
    if (!maze.image) {
        return;
    }

    background(0);
    image(maze.image, 0, 0, width, height);

    society.advance();
}
