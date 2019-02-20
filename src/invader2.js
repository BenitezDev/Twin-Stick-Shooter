
class Invader2 extends Invader
{
    constructor(img, initialPosition, initialRotation, velocity, rotVelocity)
    {
        super(img, initialPosition, initialRotation, velocity, rotVelocity);
    }

    Update(deltaTime)
    {
        // rotation (face the player ship)
        let playerEnemyVector = {
            x: playerShip.position.x - this.position.x,
            y: playerShip.position.y - this.position.y
        };
        this.rotation = Math.atan2(playerEnemyVector.y, playerEnemyVector.x);

        // movement
        let movement = {
            x: Math.cos(this.rotation) * this.velocity,
            y: Math.sin(this.rotation) * this.velocity
        };
        
        this.position.x += movement.x * deltaTime;
        this.position.y += movement.y * deltaTime;


        // update the collider position and rotation
        for (let i = 0; i < this.collider.originalPolygon.length; i++)
        {
            this.collider.transformedPolygon[i].x =
                this.position.x - this.collider.originalPolygon[i].x;
            this.collider.transformedPolygon[i].y =
                this.position.y - this.collider.originalPolygon[i].y;

            this.collider.transformedPolygon[i] =
                rotate(this.position, this.collider.transformedPolygon[i], -this.rotation);
        }
    }
}