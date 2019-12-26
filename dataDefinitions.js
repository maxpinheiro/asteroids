
/* A Ship is a new Ship(Vector Vector Boolean Number Number Number Number)
Interpretation: represents the ship, where:
 - pos represents the ship's center,  
 - vel represents the ship's velocity, 
 - accelerating represents whether the ship is accelerating or not, 
 - radius represents the ship's radius, 
 - alive represents whether the ship is invisible (0), alive (1), or broken (2), 
 - rotation represents how much the ship is rotated from facing North (clockwise, degrees), 
 - rotationSpeed represents how fast the ship is currently turning.
 - dying represents if the ship is dying (> 10) or not (0)
*/
class Ship {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.vel = createVector(0, 0);
        this.accelerating = false;

        this.radius = 12;
        this.alive = 0;
        this.dying = 0;
        this.rotation = -90;
        this.rotationSpeed = 0;
        this.score = 0;
        this.recovering = 0;

        this.draw = function () {
            if (this.alive === 1) {
                // draw ship
                push();
                translate(this.pos.x, this.pos.y);
                rotate(this.rotation + 90);
                noFill();
                stroke(255);
                triangle(-this.radius, this.radius, this.radius, this.radius, 0, -this.radius * 1.25);
                pop();

                // draw flame if accelerating
                if (this.accelerating) {
                    push();
                    translate(this.pos.x, this.pos.y);
                    rotate(this.rotation + 90);
                    stroke(255);
                    noFill();
                    triangle(-this.radius * 0.5, this.radius, this.radius * 0.5, this.radius, 0, this.radius * 2);
                    pop();
                }
                
                // draw shield if recovering
                if (this.recovering > 0) {
                    stroke(0, 145, 255);
                    fill(255, 50);
                    circle(this.pos.x, this.pos.y, this.radius * 3);
                }
            } else if (this.alive === 2 || this.dying > 0) { // break into pieces
                push();
                translate(this.pos.x, this.pos.y);
                rotate(this.rotation + 90);
                var offset = (10 - this.dying) * 2;
                stroke(255);
                noFill();
                line(-this.radius - offset, this.radius, - offset, -this.radius * 1.25);
                line(this.radius + offset, this.radius, offset, -this.radius * 1.25);
                line(-this.radius, this.radius + offset, this.radius, this.radius + offset);
                pop();
            }
        };

        this.update = function () {
            if (this.recovering > 0) {
                this.recovering = max(this.recovering - 0.05, 0);
            }
            if (this.dying === 0) {
                this.rotation += this.rotationSpeed * 0.75;

                // update position
                this.pos.add(this.vel);
                // wrap ship around edges
                this.pos.set((this.pos.x + width + this.radius) % (width + this.radius),
                    (this.pos.y + height + this.radius) % (height + this.radius));

                // update velocity
                if (this.accelerating) { // if accelerating --> increase based on current direction
                    var a = createVector(0.15 * cos(ship.rotation), 0.15 * sin(ship.rotation));
                    this.vel.add(a);
                } else { // gravity --> decelerate
                    this.vel.mult(0.97);
                }

                // cap velocity
                if (this.vel.mag() >= 15) {
                    this.vel.setMag(15);
                }
            } else {
                this.dying = max(this.dying - 0.06, 0);
                if (this.dying === 0) {
                    this.resetShip();
                    this.recovering = 10;
                }
            }

        };

        this.hits = function (asteroid) {
            var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
            return (d < this.radius + asteroid.radius);
        };

        this.resetShip = function () {
            this.alive = 1;
            this.pos = createVector(width / 2, height / 2);
            this.vel = createVector(0, 0);
            this.accelerating = false;
            this.rotation = -90;
            this.rotationSpeed = 0;
        };
    }
}

/* A Bullet is a new Bullet (Number Number Boolean)
Intepretation: represents a Bullet shot from the ship, where:
 - pos represents the bullet's position, 
 - vel represents the bullet's velocity, 
 - radius represents the bullet's radius, and
 - alive represents whether the bullet is live (shot and on-screen) or not.
*/

class Bullet {
    constructor(x, y, direction) {
        this.pos = createVector(x, y);
        this.vel = createVector(6 * cos(direction), 6 * sin(direction));
        this.radius = 1.5;
        this.alive = true;

        this.draw = function () {
            stroke(255);
            noFill();
            push();
            strokeWeight(4);
            point(this.pos.x, this.pos.y);
            pop();
        };

        this.update = function () {
            this.pos.add(this.vel);
            if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
                this.alive = false;
            }
        };

        this.hits = function (asteroid) {
            var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
            return (d < asteroid.radius);
        };

    }
}

/* */

class Asteroid {
    constructor(pos, radius) {
        if (radius) {
            this.radius = radius * 0.5;
        } else {
            this.radius = 50;
        }

        // if given position (child of collision), create with random velocity
        if (pos) {
            this.pos = pos.copy();
            this.vel = p5.Vector.random2D();
        } else { // randomly generate position and appropriate velocity
            switch (ceil(random(4))) {
                case 1: // start on left side, move to the right 
                    //this.pos = createVector(-this.radius, random(height));
                    this.pos = createVector(0, random(height));
                    this.vel = createVector(random(0, 1), random(-1, 1));
                    break;
                case 2: // start on right side, move to the left
                    //this.pos = createVector(width + this.radius, random(height));
                    this.pos = createVector(width, random(height));
                    this.vel = createVector(random(-1, 0), random(-1, 1));
                    break;
                case 3: // start on top, move down
                    //this.pos = createVector(random(width), -this.radius);
                    this.pos = createVector(random(width), 0);
                    this.vel = createVector(random(-1, 1), random(0, 1));
                    break;
                case 4: // start on bottom, move up
                    //this.pos = createVector(random(width), height + this.radius);
                    this.pos = createVector(random(width), height);
                    this.vel = createVector(random(-1, 1), random(-1, 0));
                    break;

            }
        }


        this.vertices = 10;
        this.offsets = [];
        // initialize offsets
        for (var i = 0; i < this.vertices; i++) {
            //this.offsets[i] = (random(-15, 7));
            this.offsets[i] = random(-this.radius * 0.4, this.radius * 0.2);
        }

        this.draw = function () {
            push();
            stroke(255);
            noFill();
            translate(this.pos.x, this.pos.y);
            beginShape();
            for (var i = 0; i < this.vertices; i++) {
                var offset = this.offsets[i];
                var angle = map(i, 0, this.vertices, 0, 360);
                var x = (this.radius + offset) * cos(angle);
                var y = (this.radius + offset) * sin(angle);
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();
        };

        this.update = function () {
            this.pos.add(this.vel);
            // wrap around edges
            this.pos.set((this.pos.x + width + this.radius) % (width + this.radius),
                (this.pos.y + height + this.radius) % (height + this.radius));

        };

        this.breakup = function () {
            var newAsteroids = [];
            newAsteroids[0] = new Asteroid(this.pos, this.radius);
            newAsteroids[1] = new Asteroid(this.pos, this.radius);
            return newAsteroids;
        };
    }
}