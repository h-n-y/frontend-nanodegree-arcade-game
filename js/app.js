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
 *  Offsets Entity sprite image on canvas in order to correctly align
 *  it vertically with the row the Entity occupies.
 */
var SPRITE_Y_POSITION_ADJUST = -20;

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
  this.spriteURL = spriteURL;
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
  var y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;

  ctx.drawImage(Resources.get(this.spriteURL), x, y);

}
//  Begins the process of rendering the Entity's sprite onscreen.
Entity.prototype.render = function() {
  this._draw();
}
// Updates any data or properties associated with the Entity.
// Initiated by the game loop and called continuously.
// Default functionality is to do nothing;
Entity.prototype.update = function(dt) {
  // noop
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

    var ds = this.speed * dt;
    this.location.x += ds;
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
 *  Properties:
 *    * costumes: an array that holds Costume objects the player
 *        is wearing
 *
 *  Methods:
 *    * canSmashRock(rock): Returns true iff player can smash `rock`.
 *        A player can smash a rock if wearing a Dwarf costume with the
 *        same color as the rock. ( i.e. A blue dwarf can smash blue rocks. )
 *
 *
 *    * _isGhost: Returns true iff player is wearing a Ghost costume
 *    * _isDwarf: Returns true iff player is wearing a Dwarf costume
 *    * _isLaserMan: Returns true iff player is wearing a LaserMan costume
 */
var Player = function(spriteURL, x, y) {
  Entity.call(this, spriteURL, x, y);
  this.costumes = [];
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.canSmashRock = function(rock) {
  if ( this._isDwarf() ) {
    return this._dwarfCostume().color === rock.color;
  }
};
// Performs the actual work of drawing the Player and any worn
// equipment onscreen.
Player.prototype._draw = function() {
  // Call superclass implementation
  Entity.prototype._draw.call(this);

  // Draw any costumes Player is wearing

  if ( this.costumes.length === 0 ) return;
  var x, y;
  x = this.location.x * CELL_WIDTH;
  y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;

  // Check if player is a Ghost
  if ( this._isGhost() ) {
    var spriteURL = 'images/ghost-costume.png'
    ctx.drawImage(Resources.get(spriteURL), x, y);
  }

  // Check if player is a Dwarf
  if ( this._isDwarf() ) {
    var dwarfCostume = this.costumes.find(function(costume) {
      return costume.type === COSTUME_TYPE.dwarf;
    });
    ctx.drawImage(Resources.get(dwarfCostume.spriteURL), x, y);
  }

  // Check if player is LaserMan
  if ( this._isLaserMan() ) {
    var lasermanCostume = this.costumes.find(function(costume) {
      return costume.type === COSTUME_TYPE.laserman;
    });
    ctx.drawImage(Resources.get(lasermanCostume.spriteURL), x, y);
  }

};
Player.prototype._isGhost = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.ghost;
  }).length > 0;
};
Player.prototype._isDwarf = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.dwarf;
  }).length > 0;
};
Player.prototype._isLaserMan = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.laserman;
  }).length > 0;
};
// Returns reference to player's Dwarf costume object or undefined
// if player is not wearing a Dwarf costume.
Player.prototype._dwarfCostume = function() {
  return this.costumes.find(function(costume) {
    return costume.type === COSTUME_TYPE.dwarf;
  });
};
// Returns reference to player's LaserMan costume or undefined if
// player is not wearing a LaserMan costume.
Player.prototype._laserManCostume = function() {
  return this.costumes.find(function(costume) {
    return costume.type === COSTUME_TYPE.laserman;
  });
};
Player.prototype.render = function() {
  this._draw();
};
Player.prototype.handleInput = function(direction) {
  // Attempt to move player
  // NOTE: Do I'm not sure why I must use .call on this method?
  // Not using .call makes `this` the Window object in the movePlayer function...
  var playerMoved = movePlayer.call(this, direction);
  if ( playerMoved ) {
    // Now that the player has moved, the board ( may ) need to update.
    // For example, if the player moved onto a block occupied by a collectible
    // item, the board and the player need to reflect that.
    BoardManager.updateBoardForNewPlayerLocation(this.location);
  }

  // This function attempts to move player in the direction of the `direction`
  // parameter.
  // Returns: true iff player moved successfully; false otherwise
  function movePlayer(direction) {
    var proposedLocation, playerMoved;
    playerMoved = false;

    switch ( direction ) {
      case 'left':
      proposedLocation = { x: this.location.x - 1, y: this.location.y };
      var canMoveLeft = this.location.x > 0 && BoardManager.playerCanOccupyLocation(proposedLocation);
      if ( canMoveLeft ) {
        --this.location.x;
        playerMoved = true;
      }
      break;

      case 'right':
      proposedLocation = { x: this.location.x + 1, y: this.location.y };
      var canMoveRight = this.location.x < numCols - 1 && BoardManager.playerCanOccupyLocation(proposedLocation);
      if ( canMoveRight ) {
        ++this.location.x;
        playerMoved = true;
      }
      break;

      case 'up':
      proposedLocation = { x: this.location.x, y: this.location.y - 1 };
      var canMoveUp = this.location.y > 0 && BoardManager.playerCanOccupyLocation(proposedLocation);
      if ( canMoveUp ) {
        --this.location.y;
        playerMoved = true;
      }
      break;

      case 'down':
      proposedLocation = { x: this.location.x, y: this.location.y + 1 };
      var canMoveDown = this.location.y < numRows - 1 && BoardManager.playerCanOccupyLocation(proposedLocation);
      if ( canMoveDown ) {
        ++this.location.y;
        playerMoved = true;
      }
      break;

      default:
      // do nothing
    }
    return playerMoved;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player, allEnemies = [];
function init() {
  player = new Player('images/char-boy.png', 2, 4);

  // create two enemies
  var enemy1 = new Enemy('images/enemy-bug.png', 0, 5, 2);
  var enemy2 = new Enemy('images/enemy-bug.png', 2, 1, 1);
  allEnemies.push(enemy1);
  allEnemies.push(enemy2);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

init();
