
class GameManager
{
    
    constructor()
    {
        this.timeToCreateEnemy = 2; // seconds
        this.timeToCreateEnemyAux = this.timeToCreateEnemy;

        this.spawnPoints = [
            { x: 40, y: 40},
            { x: canvas.width - 40, y: 40},
            { x: canvas.width - 40, y: canvas.height - 40},
            { x: 40, y: canvas.height - 40},
        ];
    }

    Update(deltaTime)
    {
        this.timeToCreateEnemyAux -= deltaTime;
        if (this.timeToCreateEnemyAux <= 0)
        {
            // instantiate new enemy
            // select the spawn point randomly
            let rndIndex = Math.trunc(Math.random() * this.spawnPoints.length);

            let invader = new Invader2
            (
                invaderImg2, // img
                {
                    x: this.spawnPoints[rndIndex].x,
                    y: this.spawnPoints[rndIndex].y
                }, // initialPosition
                Math.random() * Math.PI,  // initialRotation
                100 + (Math.random() * 20), // velocity
                0.5 * Math.random() // rotVelocity
            );
            invader.Start();
            invaders.push(invader);

            // reset the counter
            this.timeToCreateEnemyAux = this.timeToCreateEnemy;
            if (this.timeToCreateEnemy > 0.8)
                this.timeToCreateEnemy *= 0.995;
        }
    }
}
