
class GameManager
{
    constructor()
    {
        this.timeToCreateEnemy = 2; // seconds
        this.timeToCreateEnemyAux = this.timeToCreateEnemy;

        this.spawnPoints = [
            {x:10, y: 10},
            {x: canvas.width - 10 , y: 10},
            {x: canvas.width - 10,  y: canvas.height- 10},
            {x:10,  y: canvas.height- 10}
        ];
    }

    Update(deltatime)
    {
        this.timeToCreateEnemyAux -= deltatime;

        if(this.timeToCreateEnemyAux <= 0 )
        {
            // select the spawn point randomly
            let rndIndex = Math.trunc( Math.random() * this.spawnPoints.length);
                
            // instantiate new enemy
            let invader = new Invader
            (
                invaderImg, // img
                {x: this.spawnPoints[rndIndex].x, y: this.spawnPoints[rndIndex].y}, // initialPosition
                Math.random() * Math.PI,  // initialRotation
                20 + (Math.random() * 20), // velocity
                0.5 * Math.random() // rotVelocity
            );

            invader.Start();
            invaders.push(invader);

            // reset the couonter
            this.timeToCreateEnemyAux = this.timeToCreateEnemy;
            this.timeToCreateEnemy *= 0.95;    

            
        }
    }
}