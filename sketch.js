var gameState, ship, bullets, asteroids;

function setup() {
    createCanvas(700, 500);
    angleMode(DEGREES);
    gameState = -2;
    textAlign(CENTER);
    textFont('Futura');
    ship = new Ship();
    bullets = [];
    asteroids = [];
    asteroids.push(new Asteroid());
}

function draw() {
    //console.log(ship.vel);
    background(0);
    // initial screen
    if (gameState === -2) {
        // draw background asteroids
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].draw();
            asteroids[i].update();
        }

        // on-screen text
        fill(255);
        noStroke();
        textSize(50);
        text("ASTEROIDS", width / 2, height / 2);
        textSize(15);
        text("PRESS SPACE TO START", width / 2, height / 2 + 50);
    } else if (gameState === 0) { // regular game state
        // DRAW
        ship.draw();
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw();
        }
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].draw();
        }

        // UPDATE
        ship.update();
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].update();
        }
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
        }

        // remove dead bullets
        for (var i = 0; i < bullets.length; i++) {
            if (!bullets[i].alive) {
                bullets.splice(i, 1);
            }
        }

        // check collisions
        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < asteroids.length; j++) {
                if (bullets[i].hits(asteroids[j])) {
                    
                }
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
                bullets.push(new Bullet(ship.pos.x + ship.radius * cos(ship.rotation), 
                ship.pos.y + ship.radius * sin(ship.rotation), 
                ship.rotation));
            }
        }
    }

    // rotating
    if (keyCode === RIGHT_ARROW) {
        ship.rotationSpeed = 5;
    } else if (keyCode === LEFT_ARROW) {
        ship.rotationSpeed = -5;
    }

    // moving
    if (keyCode === UP_ARROW) {
        ship.accelerating = true;
        //var force = createVector(cos(ship.rotation), sin(ship.rotation));
        //ship.vel.add(force);
    }
}

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        ship.rotationSpeed = 0;
    }

    if (keyCode === UP_ARROW) {
        ship.accelerating = false;
    }
}