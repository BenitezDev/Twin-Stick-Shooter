
const PI2 = Math.PI * 2;
const PIH = Math.PI * 0.5;

var canvas;
var ctx;

var deltaTime = 0;
var targetDT = (1 / 60) * 1000;
var targetDTSeconds = (1 / 60);

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

var gamePaused = false;

var gameMng;
var playerShip;
var stars;
var invaders;

var playerShipImg, invaderImg, invaderImg2, bulletImg;

var actualCollisions = 0;

var collisionMode = 0;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDT);
    	};
}) ();


canvas = document.getElementById("my_canvas");
if (canvas)
{
    ctx = canvas.getContext("2d");
    if (ctx)
    {
        SetupKeyboardEvents();
        SetupMouseEvents();
        
        // load the bullet image
        bulletImg = new Image();
        bulletImg.src = "./assets/bullet.png";
        bulletImg.onload = function () {

            // load the player ship image
            playerShipImg = new Image();
            playerShipImg.src = "./assets/ship1.png";
            playerShipImg.onload = function () {

                // load the invader image
                invaderImg = new Image();
                invaderImg.src = "./assets/invader1.png";
                invaderImg.onload = function () {

                    // load the invader2 image
                    invaderImg2 = new Image();
                    invaderImg2.src = "./assets/ship3.png";
                    invaderImg2.onload = function () {
                        // start the game
                        Start();

                        //setInterval(Loop, deltaTime);
                        Loop();
                    }
                }
            }
        }
    }
}

function Start ()
{
    console.log("Start");

    // create the player ship
    playerShip.Start();

    // create the stars
    stars = new Array();
    for (var i = 0; i < 100; i++)
    {
        var star = new Star();
        // add the new star to the stars array
        stars.push(star);
    }

    // create enemies
    invaders = new Array();
    for (var i = 0; i < 10; i++)
    {
        var invader = new Invader
        (
            invaderImg, // img
            {x: Math.random() * canvas.width, y: Math.random() * canvas.height}, // initialPosition
            Math.random() * Math.PI,  // initialRotation
            20 + (Math.random() * 20), // velocity
            0.5 * Math.random() // rotVelocity
        );
        invader.Start();
        invaders.push(invader);
    }

    // create the game manager
    gameMng = new GameManager();
}

function Loop ()
{
    //console.log("loop");
    requestAnimationFrame(Loop);
    
    // compute FPS
    var now = Date.now();
    deltaTime = now - time;
    // si el tiempo es mayor a 1 seg: se descarta
    if (deltaTime > 1000)
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }

    Update(deltaTime / 1000);
    Draw();
}

function Update (deltaTime)
{
    // Input
    if (input.isKeyPressed(KEY_0))
    {
        // create a new invader
        var invader = new Invader
        (
            invaderImg, // img
            {x: Math.random() * canvas.width, y: Math.random() * canvas.height}, // initialPosition
            Math.random() * Math.PI,  // initialRotation
            20 + (Math.random() * 20), // velocity
            0.5 * Math.random() // rotVelocity
        );
        invader.Start();
        invaders.push(invader);
    }

    playerShip.Update(deltaTime);

    // stars
    stars.forEach(function(star) {
        star.Update(deltaTime);
    });

    // invaders
    invaders.forEach(function(invader) {
        invader.Update(deltaTime);
    });
    
    // check for star-invader collisions
    /*actualCollisions = 0;
    // first point inside circle then inside polygon
    for (var i = 0; i < stars.length; i++)
    {
        // reset the onCollision state of the star
        stars[i].onCollision = false;
        
        for (var j = 0; j < invaders.length; j++)
        {
            // point inside circle collision
            if (PointInsideCircle(invaders[j].position, invaders[j].radius2, stars[i].position))
            {
                // point inside polygon collision
                if (CheckCollisionPolygon(stars[i].position, invaders[j].collider.transformedPolygon))
                {
                    stars[i].onCollision = true;
                    actualCollisions++;
                }
            }
        }
    }*/
    // first point inside circle then inside polygon
    for (let i = 0; i < playerShip.bulletPool.bulletArray.length; i++)
    {
        let bullet = playerShip.bulletPool.bulletArray[i];
        if (bullet.active)
        {
            for (let j = 0; j < invaders.length; j++)
            {
                // point inside circle collision
                if (PointInsideCircle(invaders[j].position, invaders[j].radius2, bullet.position))
                {
                    // point inside polygon collision
                    if (CheckCollisionPolygon(bullet.position, invaders[j].collider.transformedPolygon))
                    {
                        // kill the enemy
                        invaders.splice(j, 1);
                        j--;
                        // disable the bullet
                        playerShip.bulletPool.DisableBullet(bullet);
                    }
                }
            }
        }
    }

    gameMng.Update(deltaTime);
}

function Draw ()
{
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background gradient
    var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0.0, "black");
    grd.addColorStop(0.8, "#2b3f65");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // stars
    stars.forEach(function(star) {
        star.Draw(ctx);
    });

    // invaders
    invaders.forEach(function(invader) {
        invader.Draw(ctx);
    });

    // player ship
    playerShip.Draw(ctx);

    // bullet pool
    BulletPoolDrawer(ctx);

    // FPS
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS";
    ctx.fillText('FPS: ' + FPS, 10, 14);

    ctx.fillText('Total invaders: ' + invaders.length, 10, 110);
    ctx.fillText('Total collisions: ' + actualCollisions, 10, 125);
}

// rotate the point given (pointCoord) the angle towards the origCoord
function rotate (origCoord, pointCoord, angle)
{
    var x = pointCoord.x,
        y = pointCoord.y,
        cx = origCoord.x,
        cy = origCoord.y;
    var rad = angle;//(Math.PI / 180) * angle;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return {
        x: (cos * (x - cx)) + (sin * (y - cy)) + cx,
        y: (cos * (y - cy)) - (sin * (x - cx)) + cy
    };
}
