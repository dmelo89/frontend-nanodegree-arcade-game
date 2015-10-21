// Enemies that our hero must avoid.
var Enemy = function(x,y) {
    // Enemy positioning variables
    this.x = x;
    this.y = y;
    // Random enemy speed multiplied according to the game difficulty
    this.speed = Math.random() * 300; // TODO: Speed variable that makes the speed changes as the player pass the "levels"
    // The image/sprite for our enemies, this uses a helper present in resources.js
    this.sprite = 'images/enemy-bug.png';
};

// This function updates the enemy's position
Enemy.prototype.update = function(dt) {
    // This checks if the bug is in the screen
    if(this.x <= 550)
    {
        this.x += this.speed * dt;
    }
    // This condition is applied when the bug have to be back out of the screen.
    else
    {
        this.x = -98; // Makes the bug go back out of the screen
    }
    // If the enemy aproaches the player the game resets and score is subtracted
    // minDistance is the minimum distance that the enemy can be from the hero
    var minDistance = 49; // Difference betwen the center point and the end of the bug, besides the file having 101px of width, the bug occupies only 98px of the image
    // Here we calculate with the variables if the enemy is close to the player
    if(player.x >= this.x - minDistance && player.x <= this.x + minDistance){
      // Checks if the player is on the same Y position of the enemy
        if(player.y >= this.y - minDistance && player.y <= this.y + minDistance){
            // TOOD: Score update
            resetGame(); // The player touched the enemy, so the game restarts
        }
    }
};
// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player Class
var Player = function(){
  // Sets the initial position for the player
  this.x = 200;
  this.y = 380;
  // Sets the image of the caracther
  this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function() {
    // These two variables makes it easy to change how many pixels the player moves in the canvas
    // movementX sets how many pixels the caracther moves horizontally, while movementY defines vertical pixels movement
    var movementX = 101;
    var movementY = 80;
    // When the "left" key is pressed and player is not on the last quadrant, subtract movementX from x
    if(this.keyPress === 'left' && this.x > 0){
        this.x = this.x - movementX;
    }
    // When the "right" key is pressed and player is not on the last quadrant, add movementX to x
    else if(this.keyPress === 'right' && this.x < 400){
        this.x = this.x + movementX;
    }
    // When the "up" key is pressed and player is not on the last quadrant before the river quadrant, add movementY to y
    else if(this.keyPress === 'up'){
        this.y = this.y - movementY;
    }
    // When the "down" key is pressed and player is not on the last lower quadrant, subtract movementY from y
    else if (this.keyPress === 'down' && this.y < 380){
        this.y = this.y + movementY;
    }
    // Clear the variable in order to make this function work well.
    this.keyPress = null;

    //If get in the water add score and reset the game
    if(this.y < 25){
        resetGame();
        // TODO: Update score and level
    }
};
Player.prototype.handleInput = function(e){
    this.keyPress = e;
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var EnemylevelUpdate = function(enemiesQtd) {
var enemyCount = 0;
// This sets the vertical position for the enemies
var enemyPositionsY = [60, 150, 230];
while (enemyCount < enemiesQtd) {
    allEnemies.push(new Enemy(-2, Math.floor(enemyPositionsY[Math.floor(Math.random() * 3)])));
    enemyCount++
};
};
//
EnemylevelUpdate(4);
// This instantiate the Player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This function resets the player to his original position
var resetGame = function() {
  player.x = 200;
  player.y = 380;
  // TODO: Score update function
};