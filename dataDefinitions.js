
/* A Ship is a new Ship(Number)
Interpretation: represents the ship, where:
 - alive represents whether the ship is invisible (0), alive (1), or broken (2).
*/
class Ship {
    constructor() {
        this.alive = 0;
        this.x = width / 2;
        this.y = height / 2;
        this.radius = 12;
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