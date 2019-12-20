
/* A Ship is a new Ship(Vector Vector Boolean Number Number Number Number)
Interpretation: represents the ship, where:
 - pos represents the ship's center,  
 - vel represents the ship's velocity, 
 - accelerating represents whether the ship is accelerating or not, 
 - radius represents the ship's radius, 
 - alive represents whether the ship is invisible (0), alive (1), or broken (2), 
 - rotation represents how much the ship is rotated from facing North (clockwise, degrees), 
 - rotationSpeed represents how fast the ship is currently turning.
*/
class Ship {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.vel = createVector(0, 0);
        this.accelerating = false;

        this.radius = 12;
        this.alive = 0;
        this.rotation = -90;
        this.rotationSpeed = 0;

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
            }
        };

        this.update = function () {
            this.rotation += this.rotationSpeed;

            // update position
            this.pos.add(this.vel);
            // wrap ship around edges
            this.pos.set((this.pos.x + width + this.radius) % (width + this.radius),
                (this.pos.y + height + this.radius) % (height + this.radius));

            // update velocity
            if (this.accelerating) { // if accelerating --> increase based on current direction
                var a = createVector(0.25 * cos(ship.rotation), 0.25 * sin(ship.rotation));
                this.vel.add(a);
            } else { // gravity --> decelerate
                this.vel.mult(0.97);
            }

            // cap velocity
            if (this.vel.mag() >= 15) {
                this.vel.setMag(15);
            }
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
            if (this.alive) {
                stroke(255);
                noFill();
                //circle(this.pos.x, this.pos.y, this.radius * 2);
                push();
                strokeWeight(4);
                point(this.pos.x, this.pos.y);
                pop();
            }
        };

        this.update = function () {
            this.pos.add(this.vel);
            //if (this.pos.x - this.radius > width || this.pos.x + width < 0 || this.pos.y - this.radius > height || this.pos.y + this.radius < 0) {
            if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
                this.alive = false;
            }
        };
    }
}

/* */

class Asteroid {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
        this.radius = 50;
        this.vertices = 10;
        this.offsets = [];
        // initialize offsets
        for (var i = 0; i < this.vertices; i++) {
            this.offsets[i] = (random(-15, 7));
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
            
        }
    }
}