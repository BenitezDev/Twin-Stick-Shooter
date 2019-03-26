
playerShip = {
    img: null,

    imgHalfWidth: 0,
    imgHalfHeight: 0,

    position: {
        x: 0,
        y: 0
    },
    rotation: -Math.PI / 2,
    velocity: 150,
    shotCadency: 0.12, // 1/0.2 shot per second
    shotCadencyAux: 0,
    cannonPosition: null,
    cannonPositionTransformed: null,

    laserSfx: null,

    bulletPool: {
        bulletArray: [],
        initialSize: 3,
        bulletCount: 0,

        Start: function () {
            this.bulletArray = [];
            for (var i = 0; i < this.initialSize; i++) {
                var bullet = new createBullet();
                bullet.Start();
                bullet.index = i;
                this.bulletArray.push(bullet);
            }
        },

        Update: function (deltaTime) {
            for (var i = 0; i < this.bulletArray.length; i++) {
                var bullet = this.bulletArray[i];

                if (bullet.active) {
                    bullet.Update(deltaTime);

                    // check screen bounds
                    if (bullet.position.y < 0 || bullet.position.y > canvas.heigth || bullet.position.x < 0 || bullet.position.x > canvas.width)
                        this.DisableBullet(bullet);
                }
            };
        },

        Draw: function (ctx) {
            this.bulletArray.forEach(function (bullet) {
                if (bullet.active)
                    bullet.Draw(ctx);
            });
        },

        EnableBullet: function () {
            // search for the first unactive bullet
            var bullet = null;
            var found = false;
            var i = 0;
            while (!found && i < this.bulletArray.length) {
                if (!this.bulletArray[i].active) {
                    found = true;
                    bullet = this.bulletArray[i];
                }
                else
                    i++;
            }

            if (!found) {
                // all the bullets are active: create a new one
                bullet = new createBullet();
                bullet.Start();
                bullet.index = this.bulletArray.length;
                this.bulletArray.push(bullet);
            }

            this.bulletCount++;

            return bullet;
        },

        DisableBullet: function (bullet) {
            // eliminar bullet
            this.bulletCount--;
            bullet.active = false;
        }
    },

    Start: function () {
        this.img = playerShipImg;
        this.imgHalfWidth = this.img.width / 2;
        this.imgHalfHeight = this.img.height / 2;

        this.laserSfx = document.getElementById("laser");

        this.position = {
            x: (canvas.width / 2) - playerShipImg.width / 2,
            y: canvas.height - 60
        }

        // set the cannon position
        this.cannonPosition = {
            x: 0,
            y: -this.img.width / 2 + bulletImg.width / 2
        }
        this.cannonPositionTransformed = {
            x: 0,
            y: -this.img.width / 2 + bulletImg.width / 2
        }

        // init the bullet pool
        this.bulletPool.Start();
    },

    Update: function (deltaTime) {
        // decrement the cadency aux timer
        this.shotCadencyAux -= deltaTime;

        var movement = { x: 0, y: 0 };

        if (input.isKeyPressed(KEY_RIGHT) || input.isKeyPressed(KEY_D)) {
            // right displacement
            movement.x++;
        }

        if (input.isKeyPressed(KEY_LEFT) || input.isKeyPressed(KEY_A)) {
            // left displacement
            movement.x--;
        }

        if (input.isKeyPressed(KEY_UP) || input.isKeyPressed(KEY_W)) {
            // up displacement
            movement.y--;
        }

        if (input.isKeyPressed(KEY_DOWN) || input.isKeyPressed(KEY_S)) {
            // down displacement
            movement.y++;
        }

        // normalize the movement vector
        var movementModule = Math.sqrt((movement.x * movement.x) + (movement.y * movement.y));
        if (movementModule != 0) {
            movement.x = movement.x / movementModule;
            movement.y = movement.y / movementModule;
        }

        // turbo mode
        if (input.isKeyPressed(KEY_LSHIFT)) {
            movement.x *= 2.0;
            movement.y *= 2.0;
        }

        // apply the displacement
        this.position.x += movement.x * this.velocity * deltaTime;
        this.position.y += movement.y * this.velocity * deltaTime;

        // check world-screen bounds
        if (this.position.x > canvas.width - this.imgHalfWidth)
            this.position.x = canvas.width - this.imgHalfWidth;
        else if (this.position.x < this.imgHalfWidth)
            this.position.x = this.imgHalfWidth;
        if (this.position.y > canvas.height - this.imgHalfHeight)
            this.position.y = canvas.height - this.imgHalfHeight;
        else if (this.position.y < this.imgHalfHeight)
            this.position.y = this.imgHalfHeight;

        // rotation (face the mouse)
        var mouseShipVector = {
            x: input.mouse.x - this.position.x,
            y: input.mouse.y - this.position.y
        };
        this.rotation = Math.atan2(mouseShipVector.y, mouseShipVector.x);

        // cannon position transformation
        this.cannonPositionTransformed = rotate(this.position, { x: this.position.x + this.cannonPosition.x, y: this.position.y + this.cannonPosition.y }, -this.rotation - PIH);

        // shooting
        if ((input.isKeyPressed(KEY_SPACE) || input.isMousePressed()) &&
            this.shotCadencyAux <= 0) {
            var bullet = this.bulletPool.EnableBullet();
            bullet.position.x = this.cannonPositionTransformed.x;
            bullet.position.y = this.cannonPositionTransformed.y;
            bullet.rotation = this.rotation;
            bullet.velocity = 1000;
            bullet.active = true;

            // play the sfx
            console.log(sfx);
            if (sfx) {
                this.laserSfx.currentTime = 0.22;
                this.laserSfx.play();
            } else {

                console.log("NONONONO");
            }

            // reset the cadency aux timer
            this.shotCadencyAux = this.shotCadency;
        }

        // update the bullet pool
        this.bulletPool.Update(deltaTime);
    },

    Draw: function (ctx) {
        // draw the bullets
        this.bulletPool.Draw(ctx);

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + PIH);

        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.strokeStyle = 'red';
        ctx.fillRect(-this.imgHalfWidth, -this.imgHalfHeight, this.img.width, this.img.height);
        ctx.strokeRect(-this.imgHalfWidth, -this.imgHalfHeight, this.img.width, this.img.height);

        ctx.drawImage(this.img, -this.imgHalfWidth, -this.imgHalfHeight);

        ctx.restore();

        // draw the cannon point
        ctx.beginPath();
        ctx.arc(this.cannonPositionTransformed.x, this.cannonPositionTransformed.y, 2, 0, PI2, false);
        ctx.fillStyle = "green";
        ctx.fill();

        // active bullets
        ctx.fillStyle = "white";
        ctx.font = "12px Comic Sans MS";
        ctx.fillText('bullet pool size: ' + this.bulletPool.bulletArray.length, 10, 32);
        ctx.fillText('bullet pool count: ' + this.bulletPool.bulletCount, 10, 52);
    }
};

function createBullet() {
    this.index = -1;
    this.active = false;
    this.position = { x: 0, y: 0 };
    this.rotation = 0;
    this.velocity = 0;
    this.damage = 0;
    this.sprite = null;
    this.spriteHalfWidth = 0;
    this.spriteHalfHeight = 0;
}

createBullet.prototype.Start = function () {
    this.sprite = bulletImg;
    this.spriteHalfWidth = bulletImg.width / 2;
    this.spriteHalfHeight = bulletImg.height / 2;
}

createBullet.prototype.Update = function (deltaTime) {
    this.position.x += this.velocity * deltaTime * Math.cos(this.rotation);
    this.position.y += this.velocity * deltaTime * Math.sin(this.rotation);
}

createBullet.prototype.Draw = function (ctx) {
    ctx.save();

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation + PIH);
    ctx.drawImage(this.sprite, -this.spriteHalfWidth, -this.spriteHalfHeight);

    ctx.restore();
};
