// Sets initial level & score
level = 4;
score = 0;
// Score keeping and level function
var runLevel = function(score) {
    console.log(score);
    if (score >= 0) {
        level = 1;
        insertEnemies(1, 400);
        score++
    }
    if (score >= 5) {
        level = 3;
        removeBugs(2); // TODO: Make them dissapear smooth
        insertEnemies(2, 700);
    }
    if (score > 10) {
        level = 4;
        removeBugs(3); // TODO: Make them dissapear smooth
        insertEnemies(3, 1200);
    }
    console.log(level);
};
// Enemies that our hero must avoid.
var Enemy = function (x, y, speed) {
    // Enemy positioning variables
    this.x = x;
    this.y = y;
    this.width = 98;
    this.height = 77;
    // Random enemy speed multiplied according to the game difficulty
    this.speed = Math.random() * speed; // TODO: Speed variable that makes the speed changes as the player pass the "levels"
    // The image/sprite for our enemies, this uses a helper present in resources.js
    return level < 3
        ? this.sprite = 'images/enemy-bug.png'
        : this.sprite = 'images/enemy-bug-devil.png';
};
// This function updates the enemy's position
Enemy.prototype.update = function (dt) {
    // If the enemy aproaches the player the game resets and score is subtracted
    // minDistance is the minimum distance that the enemy can be from the hero
    var minDistance = 70; // Difference betwen the center point and the end of the bug, besides the file having 101px of width, the bug occupies only 98px of the image
    // Here we calculate with the variables if the enemy is close to the player X
    // and if in the same Y line
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (this.x < player.x + minDistance &&
   this.x + minDistance > player.x &&
   this.y < player.y + minDistance &&
   minDistance + this.y > player.y) {
    resetGame(); // As the player collides the game resets
}
    return this.x <= 550 // This checks if the bug is in the screen
        ? this.x += this.speed * dt  // if true keeps moving
        : this.x = -98;     // if not on the screen move back to the beginning
};
// This makes the render function available for both Enemy and Player objects
Object.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Player Class
var Player = function () {
    // Sets the initial position for the player
    this.x = 200;
    this.y = 380;
    // Sets the image of the caracther
    this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function () {
    // These two variables makes it easy to change how many pixels the player
    // moves in the canvas movementX sets how many pixels the caracther moves
    // horizontally, while movementY defines vertical pixels movement
    var movementX = 101;
    var movementY = 80;
    if (this.keyPress === 'left' && this.x > 0) {     // When the "left" key is pressed and player is not on the last quadrant, subtract movementX from x
        this.x = this.x - movementX;
    } else if (this.keyPress === 'right' && this.x < 400) { // When the "right" key is pressed and player is not on the last quadrant, add movementX to x
        this.x = this.x + movementX;
    } else if (this.keyPress === 'up') { // When the "up" key is pressed and player is not on the last quadrant before the river quadrant, add movementY to y
        this.y = this.y - movementY;
    } else if (this.keyPress === 'down' && this.y < 380) { // When the "down" key is pressed and player is not on the last lower quadrant, subtract movementY from y
        this.y = this.y + movementY;
    }
    // Clear the variable in order to make this function work without repeating the movement every frame.
    this.keyPress = null;
    //If get in the water add score and reset the game
    if (this.y < 25) {
        resetGame();
        score++
        runLevel(score);
    }
};
Player.prototype.handleInput = function (e) {
    this.keyPress = e;
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var globalEnemyCount = 0;
var insertEnemies = function (enemiesQtd, speed) {
    var enemyCount = 0;
    console.log("Enemy Count:");
    console.log(enemyCount);
    // This sets the vertical position for the enemies
    var enemyPositionsY = [
        60, 150, 230
    ];
    while (enemyCount < enemiesQtd) {
        allEnemies.push(new Enemy(-98, Math.floor(enemyPositionsY[
            Math.floor(Math.random() * 3)]), speed));
        enemyCount++
        globalEnemyCount = globalEnemyCount + enemyCount;
    }
    console.log("Enemy Count After:");
    console.log(enemyCount);
    console.log("Enemy Count Global:");
    console.log(globalEnemyCount);
    console.log(allEnemies);
};
runLevel(score);
// This instantiate the Player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document
    .addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });

// This function resets the player to his original position
var resetGame = function () {
    player.x = 200;
    player.y = 380;
    // TODO: Score update function
};
var removeBugs = function (num) {
    allEnemies.splice(0,num);
}