var gameState, ship;

function setup() {
    createCanvas(700, 500);
    angleMode(DEGREES);
    gameState = -2;
    textAlign(CENTER);
    textFont('Futura');
    ship = new Ship();
}

function draw() {
    background(0);
    // initial screen
    if (gameState === -2) {
        fill(255);
        noStroke();
        textSize(50);
        text("ASTEROIDS", width / 2, height / 2);
        textSize(15);
        text("PRESS SPACE TO START", width / 2, height / 2 + 50)
    } else if (gameState === 0) {
        // draw ship
        ship.draw();
        // update ship
        ship.update();

    }
}

function keyPressed() {
    // creating ship
    if (key === ' ') {
        if (gameState === -2) {
            gameState = 0;
        }
        console.log("space");
        if (ship.alive === 0) {
            ship.alive = 1;
        }
    }

    // rotating
    if (keyCode === RIGHT_ARROW) {
        ship.rotationSpeed = 3;
    } else if (keyCode === LEFT_ARROW) {
        ship.rotationSpeed = -3;
    }

    // moving
    if (keyCode === UP_ARROW) {
        ship.acceleration = 0.5;
    }
}

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        ship.rotationSpeed = 0;
    }

    if (keyCode === UP_ARROW) {
        ship.acceleration = -0.07;
    }
}