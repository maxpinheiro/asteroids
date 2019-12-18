var gameState, ship, bullets;

function setup() {
    createCanvas(700, 500);
    angleMode(DEGREES);
    gameState = -2;
    textAlign(CENTER);
    textFont('Futura');
    ship = new Ship();
    bullets = [];
}

function draw() {
    //console.log(bullets.length);
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
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw();
        }
        // update ship
        ship.update();
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].update();
        }
        // remove dead bullets
        for (var i = 0; i < bullets.length; i++) {
            if (!bullets[i].alive) {
                bullets.splice(i, 1);
            }
        }
    }
}

function keyPressed() {
    // creating ship
    if (key === ' ') {
        // if beginning of game --> create ship
        if (gameState === -2) {
            gameState = 0;
            if (ship.alive === 0) {
                ship.alive = 1;
            }
        } else if (gameState === 0) {
            if (ship.alive === 1) {
                bullets.push(new Bullet(ship.x + ship.radius * cos(ship.rotation - 90), ship.y + ship.radius * sin(ship.rotation - 90), ship.rotation));
            }
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