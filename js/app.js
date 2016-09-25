/*
 * Constants that represent the width and height of each of the
 * cells on the board the player can occupy.
 *
 * Useful for rendering sprites onscreen at specific locations
 * on the board.
 *  TODO: replace raw numbers represented by these contants in app.js
*/
var CELL_WIDTH, CELL_HEIGHT;
CELL_WIDTH = 101;
CELL_HEIGHT = 83;

/*
 * ENTITY: Base class for Enemy and Player
 *
 * Properties:
 *  - sprite: the url for the entity's image
 *  - location: the location of the creature on the board
 *      For example, a Entity at
 *        location.x = 0,
 *        location.y = 4,
 *      would be located in the cell that occupies the first column
 *      and fifth row.
*/
var Entity = function(spriteURL, x, y) {
  this.sprite = spriteURL;
  this.location = {
    x: x,
    y: y
  }
}
//  Called by Entity.render() to do the actual work of drawing
//  the Entity's sprite onscreen.
Entity.prototype._draw = function() {
  // Get the origin for drawing
  var x = this.location.x * CELL_WIDTH;
  var y = this.location.y * CELL_HEIGHT;

  ctx.drawImage(this.sprite, x, y);
}
//  Begins the process of rendering the Entity's sprite onscreen.
Entity.prototype.render = function() {
  draw();
}


/*
 *  ENEMY: An onscreen Entity that Player must avoid in order
 *  to progress through the game.
 *
 *  Class Hierarchy: Object > Entity > Enemy
 *
 *  Properties:
 *    - speed: the speed at which the Enemy moves across the screen.
 *      - positive for movement right and down
 *      - negative for movement left and up
 */
var Enemy = function(spriteURL, x, y, speed) {
  Entity.call(this, spriteURL, x, y);
  this.speed = speed;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;
//  Update the enemy's position, required method for game
//  Parameters:
//    - dt: a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/*
 *  PLAYER: Represents the player in the game.
 *
 *  Class Hierarchy: Object > Entity > Player
 *
 */
var Player = function(spriteURL, x, y) {
  Entity.call(this, spriteURL, x, y);
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
// Performs the actual work of drawing the Player and any worn
// equipment onscreen.
Player.prototype._draw = function() {
  // Call superclass implementation
  Entity.prototype._draw.call(this);

  // TODO: draw any equipment / costumes on top of the player sprite
};
Player.prototype.render = function() {
  draw();
};
Player.prototype.handleInput = function() {

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player, allEnemies;
function init() {
  player = new Player('../images/char-boy.png', 2, 4);

  // create 
}


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
