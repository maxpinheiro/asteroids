
/* A Ship is a new Ship(Number Number Number Number Number Number Number Number)
Interpretation: represents the ship, where:
 - x represents the ship's center (x-coordinate), 
 - y represents the ship's center (y-coordinate), 
 - radius represents the ship's radius, 
 - alive represents whether the ship is invisible (0), alive (1), or broken (2), 
 - rotation represents how much the ship is rotated from facing North (clockwise, degrees), 
 - rotationSpeed represents how fast the ship is currently turning
 - velocity represents how fast the ship is moving, and
 - acceleration represents how fast the ship is accelerating.
*/
class Ship {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.radius = 12;
        this.alive = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.velocity = 0;
        this.acceleration = 0;

        this.draw = function () {
            if (this.alive === 1) {
                // draw ship
                push();
                translate(this.x, this.y);
                rotate(this.rotation);
                noFill();
                stroke(255);
                triangle(-this.radius, this.radius, this.radius, this.radius, 0, -this.radius * 1.25);
                pop();

                // draw flame if accelerating
                if (this.acceleration > 0) {
                    push();
                    translate(this.x, this.y);
                    rotate(this.rotation);
                    stroke(255);
                    noFill();
                    triangle(-this.radius * 0.5, this.radius, this.radius * 0.5, this.radius, 0, this.radius * 2);
                    pop();
                }
            }
        };

        this.update = function () {
            this.rotation += this.rotationSpeed;
            this.x += this.velocity * cos(this.rotation - 90) * 0.5;
            this.x = (this.x + width) % width;
            this.y += this.velocity * sin(this.rotation - 90) * 0.5;
            this.y = (this.y + height) % height;

            this.velocity += this.acceleration;
            this.velocity = min(this.velocity, 15);
            if (this.velocity <= 0) {
                this.acceleration = 0;
                this.velocity = 0;
            }
        };
    }
}

/* A Bullet is a new Bullet (Number Number Boolean)
Intepretation: represents a Bullet shot from the ship, where:
 - x represents the bullet's center (x-coordinate), 
 - y represents the bullet's center (y-coordinate), 
 - direction represents the direction the bullet is facing, and
 - alive represents whether the bullet is live (shot and on-screen) or not.
*/

class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.direction = direction - 90;
        this.alive = true;

        this.draw = function () {
            if (this.alive) {
                stroke(255);
                push();
                //strokeWeight(2);
                translate(this.x, this.y);
                line(- this.radius * cos(this.direction), -this.radius * sin(this.direction),
                    this.radius * cos(this.direction), this.radius * sin(this.direction));
                pop();
            }
        };

        this.update = function () {
            this.x += 8 * cos(this.direction);
            this.y += 8 * sin(this.direction);
            if (this.x - this.radius > width || this.x + width < 0 || this.y - this.radius > height || this.y + this.radius < 0) {
                this.alive = false;
            }
        };
    }
}