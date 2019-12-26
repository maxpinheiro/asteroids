var gameState, ship, bullets, asteroids, time;

function setup() {
    createCanvas(700, 500);
    angleMode(DEGREES);
    gameState = -2;
    textFont('Futura');
    ship = new Ship();
    bullets = [];
    asteroids = [];
    for (var i = 0; i < 15; i++) {
        asteroids.push(new Asteroid(createVector(random(width), random(height)), random(30, 100)));
    }
    time = 0;
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
        textAlign(CENTER);
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
        
        textSize(25);
        textAlign(LEFT);
        fill(255, 50);
        noStroke();
        text(ship.score, 5, 25);

        // UPDATE
        
        // add asteroids
        if (time % 200 === 0 && asteroids.length < 15) {
            asteroids.push(new Asteroid());
        }

        time ++;

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
            for (var j = asteroids.length - 1; j >= 0; j--) {
                if (bullets[i].hits(asteroids[j])) {
                    if (asteroids[j].radius === 50) { // big asteroid
                        ship.score += 20;
                    } else if (asteroids[j].radius === 25) { // medium asteroid
                        ship.score += 50;
                    } else if (asteroids[j].radius === 12.5) { // small asteroid
                        ship.score += 100;
                    } else { // mini asteroid
                        ship.score += 150;
                    }
                    
                    if (asteroids[j].radius > 12) {
                        var newAsteroids = asteroids[j].breakup();
                        asteroids = asteroids.concat(newAsteroids);
                    }
                    asteroids.splice(j, 1);
                    bullets.splice(i, 1);
                    break;
                }
            }
        }

        for (var i = 0; i < asteroids.length; i++) {
            if (ship.hits(asteroids[i]) && ship.alive === 1 && ship.recovering === 0) {
                ship.dying = 10;
                ship.alive = 2;
                console.log("ooops!");
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
            asteroids = [];
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