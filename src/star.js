
function Star ()
{
    this.position = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    },
    this.radius = 1 + Math.random() * 3,
    this.velocity = 20 + Math.random() * 20,
    this.onCollision = false,
    
    this.Draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        
        if (this.onCollision)
            ctx.fillStyle = "blue";
        else
            ctx.fillStyle = "white";
        
        ctx.fill();
    }
    
    this.Update = function (deltaTime) {
        this.position.x += this.velocity * deltaTime;
        this.position.x = this.position.x % canvas.width;
    }
}
