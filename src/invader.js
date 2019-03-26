
class Invader {
    constructor(img, initialPosition, initialRotation, velocity, rotVelocity) {
        this.img = img;
        this.position = {
            x: initialPosition.x,
            y: initialPosition.y
        };
        this.scale = 0.5;
        this.rotation = 0;
        this.initialRotation = initialRotation;
        this.velocity = velocity;
        this.damage = 10;
        this.experience = 5;
        this.rotVelocity = rotVelocity;

        this.imgHalfWidth = img.width / 2;
        this.imgHalfHeight = img.height / 2;

        this.minDistance = (this.imgHalfWidth + this.imgHalfHeight) * this.scale;

        this.radius = 0;
        this.radius2 = 0;

        this.collider = {
            originalPolygon: [
                { x: 8, y: -10 },
                { x: 14, y: -8 },
                { x: 14, y: 4 },
                { x: 8, y: 10 },
                { x: -8, y: 10 },
                { x: -14, y: 4 },
                { x: -14, y: -8 },
                { x: -8, y: -10 },
            ],
            transformedPolygon: [
                { x: 8, y: -10 },
                { x: 14, y: -8 },
                { x: 14, y: 4 },
                { x: 8, y: 10 },
                { x: -8, y: 10 },
                { x: -14, y: 4 },
                { x: -14, y: -8 },
                { x: -8, y: -10 },
            ]
        };
    }

    Start() {
        this.rotation = this.initialRotation;

        this.radius = 20;//Math.sqrt((this.imgHalfWidth * this.imgHalfWidth) + (this.imgHalfHeight * this.imgHalfHeight));

        this.radius2 = this.radius * this.radius;
    }

    Update(deltaTime) {
        // movement towars its rotation
        var movement = {
            x: Math.cos(this.rotation) * this.velocity,
            y: Math.sin(this.rotation) * this.velocity
        };

        this.position.x += movement.x * deltaTime;
        this.position.y += movement.y * deltaTime;

        // Rotation
        //this.rotation += this.rotVelocity * PI2 * deltaTime;

        // Check world limits
        if (this.position.x >= canvas.width) {
            // update rotation
            this.rotation = Math.atan2(movement.y, -movement.x);

            this.position.x = canvas.width - 1;
        }
        else if (this.position.x <= 0.0) {
            // update rotation
            this.rotation = Math.atan2(movement.y, -movement.x);

            this.position.x = 1;
        }

        if (this.position.y >= canvas.height) {
            // update rotation
            this.rotation = Math.atan2(-movement.y, movement.x);

            this.position.y = canvas.height - 1;
        }
        else if (this.position.y <= 0.0) {
            // update rotation
            this.rotation = Math.atan2(-movement.y, movement.x);

            this.position.y = 1;
        }

        // update the collider position and rotation
        for (var i = 0; i < this.collider.originalPolygon.length; i++) {
            this.collider.transformedPolygon[i].x =
                this.position.x - this.collider.originalPolygon[i].x;
            this.collider.transformedPolygon[i].y =
                this.position.y - this.collider.originalPolygon[i].y;

            this.collider.transformedPolygon[i] =
                rotate(this.position, this.collider.transformedPolygon[i], -this.rotation);
        }
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        //ctx.scale(2, 2);

        /*ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.strokeStyle = 'red';
        ctx.fillRect(-this.imgHalfWidth, -this.imgHalfHeight, this.img.width, this.img.height);
        ctx.strokeRect(-this.imgHalfWidth, -this.imgHalfHeight, this.img.width, this.img.height);*/

        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.img, -this.imgHalfWidth, -this.imgHalfHeight);
        ctx.restore();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();

        // draw the collider polygon
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.collider.transformedPolygon[0].x, this.collider.transformedPolygon[0].y);
        for (var i = 1; i < this.collider.transformedPolygon.length; i++) {
            ctx.lineTo(this.collider.transformedPolygon[i].x, this.collider.transformedPolygon[i].y);
        }
        ctx.lineTo(this.collider.transformedPolygon[0].x, this.collider.transformedPolygon[0].y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
    }
}