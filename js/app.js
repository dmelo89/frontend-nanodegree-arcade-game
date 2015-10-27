// Sets initial level, score & lives
var level = 0;
var score = 0;
var iniLives = 10;
var lives = iniLives;
var gameReset = 0; // Checks if the game restarted for clearing scores.
var runLevel = function(dead) {
    // This function removes older enemies for the game still be playble
    var removeEnemies = function (num) {
    var enemiesLength = allEnemies.length;
    deadEnemies = allEnemies.splice(0, enemiesLength);
    }
    if (dead == false) {
    gameReset = 0;
    level++;
    var enemyNum;
    var speed;
    if (level >= 0) {
        enemyNum = 1;
        speed = 300;
    }
    if (level >= 7) {
        enemyNum = 3;
        speed = 500;
    }
    if (level >= 10) {
        enemyNum = 6;
        speed = 600;
    }
    if (level >= 11) {
        enemyNum = enemyNum+1;
        speed = speed + 100;
    }
    if (level >= 7) {removeEnemies();}
    insertEnemies(enemyNum, speed);
    }
    else {
    if (lives == 0) {
        level = 1;
        lives = iniLives;
        gameReset = 1;
        removeEnemies();
        enemyNum = 1;
        speed = 300;
    }
    insertEnemies(enemyNum, speed);
    }
    console.log(level);
};
// Score keeping and level function
var showScore = function() {
    ctx.globalAlpha = 1;
    var clearCanvas = function (type) {
        return type = 1 ?  ctx.clearRect(0, 0, 505, 40) : ctx.clearRect(300, 0, 150, 40);
    }
    var achievemenText = ""; // Empty this variable, if we just declare it will show "undefined"
  // First we clear the canvas space
  clearCanvas(1);
  // Set the font and the text
  ctx.font="20px IMPACT";
  ctx.fillText("Score:",10,40);
  // We load the "score" variable
  ctx.fillText(score,80,40);
  ctx.fillText("Level:",105,40);
  ctx.fillText(level,170,40);
  ctx.fillText("Lives:",205,40);
  ctx.fillText(lives,270,40);
  /*    Achievements

        Are unlocked according to the score
        and what kind of pickups the player gets

  */
  // First Achievement 10+ level
  if (level >= 10 && level <= 14) {
    var achievemenText = "WELCOME TO HELL";
  };
  // Second Achievement 15+ level
  if (level >= 15 && level <= 24) {
    var achievemenText = "IMPRESSIVE COMBO";
  };
  // Third Achievement 30+ level
  if (level >= 25 && level <= 34) {
    var achievemenText = "HELL MASTER";
  };
  // Insane Achievement 35+ level
  if (level >= 35) {
    var achievemenText = "OMG!";
  };
  // Achievement text
  ctx.fillText(achievemenText,300,40);
  console.log(achievemenText)
}
// Enemies that our hero must avoid.
var Enemy = function (x, y, speed) {
    // Enemy positioning variables
    this.x = x;
    this.y = y;
    this.width = 98;
    this.height = 77;
    // Random enemy speed multiplied according to the game difficulty
    this.speed = Math.random() * speed;
    // The image/sprite for our enemies, this uses a helper present in resources.js
    return level < 10
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
    if (this.x < player.x + minDistance &&
   this.x + minDistance > player.x &&
   this.y < player.y + minDistance &&
   minDistance + this.y > player.y) {
    resetGame(); // As the player collides the game resets
    lives = lives -1;
    runLevel(true);
}
    return this.x <= 550 // This checks if the bug is in the screen
        ? this.x += this.speed * dt  // if true keeps moving
        : this.x = -98;     // if not on the screen move back to the beginning
};
// This makes the enemy disapear in smooth way
// This makes the render function available for both Enemy and Player objects
Object.prototype.render = function () {
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
var fadeOutAlpha = 1; // Sets initial Alpha value
Enemy.prototype.dieOut = function (dt) {
            ctx.globalAlpha = fadeOutAlpha; // Takes back the alpha for animation
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
             if (fadeOutAlpha <= 0) {
                // Add score according to how many bugs go off the screen if the player is alive
                if (gameReset == 0){
            score = score + deadEnemies.length;
            } else {
                score = 0;
            };
             deadEnemies = []; // clear the deadEnemies array
             fadeOutAlpha = 1; // resets the alpha
             }
             else {
             fadeOutAlpha = fadeOutAlpha - 0.005;
            }
             ctx.globalAlpha = fadeOutAlpha; // Apply new aplha
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
    //If get in the river add score and reset the game
    if (this.y < 25) {
        score++;
        resetGame();
        score = score + deadEnemies.length;
        runLevel(false);

    }
};
Player.prototype.handleInput = function (e) {
    this.keyPress = e;
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var deadEnemies = []; // Dead Enemies will be here for animation
var globalEnemyCount = 0; //Initial Enemy count
var insertEnemies = function (enemiesQtd, speed) {
    var enemyCount = 0;
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