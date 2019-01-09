let vehicle = null;

function setup() {
    createCanvas(400, 300);
    vehicle = new SmartVehicle();
}

function draw() {
    background(0);

    vehicle.update();
    vehicle.show();
}
