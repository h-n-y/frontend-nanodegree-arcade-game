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

var ENEMY_TYPE = {
  zombie: "zombie",
  spider: "spider",
  ghost: "ghost"
};

var MOVEMENT_DIRECTION = {
  vertical: "vertical",
  horizontal: "horizontal"
};

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
  };
  this.collisionBox = {
    width: 0,
    height: 0,
    center: {
      x: 0,
      y: 0
    }
  };
  this.isColliding = false;
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
  // for debugging only
  this._renderCollisionBox();
}
// Updates any data or properties associated with the Entity.
// Initiated by the game loop and called continuously.
// Default functionality is to do nothing;
Entity.prototype.update = function(dt) {
  // noop
}
Entity.prototype.isCollidingWithEntity = function(entity) {
  return this._collisionBoxIntersects(entity);
};
Entity.prototype._collisionBoxIntersects = function(entity) {
  var thisRect, thatRect;
  var collisionBox, halfWidth, halfHeight;

  // Create collision box rect for `this`.
  collisionBox = this.collisionBox;
  halfWidth = collisionBox.width / 2;
  halfHeight = collisionBox.height / 2;
  thisRect = {
    top: collisionBox.center.y - halfHeight,
    bottom: collisionBox.center.y + halfHeight,
    left: collisionBox.center.x - halfWidth,
    right: collisionBox.center.x + halfWidth,
  };

  // If the entity argument is a laser obstacle, it has *two*
  // collision boxes - one for each laser node. `this` is intersecting
  // the laser if it intersects *either* one of its collision boxes
  if ( entity.type === OBSTACLE_TYPE.laser ) {
    var collisionBoxes, leftNodeBox, rightNodeBox;
    collisionBoxes = entity.laserNodeCollisionBoxes;
    leftNodeBox = {
      top: collisionBoxes.left.center.y - collisionBoxes.left.height / 2,
      bottom: collisionBoxes.left.center.y + collisionBoxes.left.height / 2,
      left: collisionBoxes.left.center.x - collisionBoxes.left.width / 2,
      right: collisionBoxes.left.center.x + collisionBoxes.left.width / 2
    };
    rightNodeBox = {
      top: collisionBoxes.right.center.y - collisionBoxes.right.height / 2,
      bottom: collisionBoxes.right.center.y + collisionBoxes.right.height / 2,
      left: collisionBoxes.right.center.x - collisionBoxes.right.width / 2,
      right: collisionBoxes.right.center.x + collisionBoxes.right.width / 2
    };

    var leftLaserNodeIntersected, rightLaserNodeIntersected;
    leftLaserNodeIntersected = ( thisRect.left <= leftNodeBox.right && thisRect.right >= leftNodeBox.left && thisRect.top <= leftNodeBox.bottom && thisRect.bottom >= leftNodeBox.top );
    rightLaserNodeIntersected = ( thisRect.left <= rightNodeBox.right && thisRect.right >= rightNodeBox.left && thisRect.top <= rightNodeBox.bottom && thisRect.bottom >= rightNodeBox.top );

    return ( leftLaserNodeIntersected || rightLaserNodeIntersected );

  } else {
    // entity argument is *not* a laser, so just check if its single collision
    // box rect intersects with `this`.
    collisionBox = entity.collisionBox;
    halfWidth = collisionBox.width / 2;
    halfHeight = collisionBox.height / 2;
    thatRect = {
      top: collisionBox.center.y - halfHeight,
      bottom: collisionBox.center.y + halfHeight,
      left: collisionBox.center.x - halfWidth,
      right: collisionBox.center.x + halfWidth,
    };

    // See: http://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
    return ( thisRect.left <= thatRect.right && thisRect.right >= thatRect.left && thisRect.top <= thatRect.bottom && thisRect.bottom >= thatRect.top );
  }
};
Entity.prototype._renderCollisionBox = function() {
  ctx.save();
  ctx.translate(this.collisionBox.center.x, this.collisionBox.center.y);
  ctx.strokeStyle = "red";
  ctx.strokeStyle = this.isColliding ? "yellow" : "red";
  ctx.lineWidth = 2;

  var width, height;
  width = this.collisionBox.width;
  height = this.collisionBox.height;

  ctx.strokeRect(-width/2, -height/2, width, height);

  ctx.restore();
};


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
var Enemy = function(type, x, y, speed) {
  var spriteURL = this._spriteURLForType(type);
  Entity.call(this, spriteURL, x, y);
  this.spriteURL = spriteURL;
  this.type = type;
  this.currentSpeed = speed;
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

    var ds = this.currentSpeed * dt;
    this.location.x += ds;

    this._updateCollisionBox();
};
Enemy.prototype._updateCollisionBox = function() {
  var x, y, verticalAdjustment, width, height;

  switch ( this.type ) {
    case ENEMY_TYPE.zombie:
    width = 65;
    height = 72;
    verticalAdjustment = 47;
    break;

    case ENEMY_TYPE.spider:
    width = 95;
    height = 60;
    verticalAdjustment = 55;
    break;

    case ENEMY_TYPE.ghost:
    width = 70;
    height = 72;
    verticalAdjustment = 47;
    break;

    default:
    console.warn("WARNING: ( " + this.type + " ) is an invalid enemy type.");
  }

  x = ( this.location.x + 0.5 ) * CELL_WIDTH;
  y = ( this.location.y + 0.5 ) * CELL_HEIGHT + verticalAdjustment;

  this.collisionBox.center.x = x;
  this.collisionBox.center.y = y;
  this.collisionBox.width = width;
  this.collisionBox.height = height;
};
Enemy.prototype.checkCollisions = function() {
  this.isColliding = false;

  // Get all rock and laser obstacles
  var obstacles = BoardManager.currentLevelMap.obstacleLayout.filter(function(obstacle) {
    return obstacle.type !== OBSTACLE_TYPE.web;
  });
  // var obstacles = BoardManager.currentObstacleLayout.filter(function(obstacle) {
  //   return obstacle.type !== OBSTACLE_TYPE.web;
  // });

  // Check whether `this` has run into an obstacle
  var obstacle;
  for ( var i = 0; i < obstacles.length; ++i ) {
    obstacle = obstacles[i];
    if ( this.isCollidingWithEntity(obstacle) ) {
      this.isColliding = true;

      // Change enemy direction after it 'hits' the obstacle
      this._changeDirection();
      break;
    }
  }

  // Check if enemy has collided with player
  if ( this.isCollidingWithEntity(player) ) {
    this.isColliding = true;

    // Player dies: start level over
    // TODO
  }
};

// Causes the enemy to change directions.
// Example: An enemy moving to the right will now move to the left.
// This method is called after an enemy runs into an obstacle
Enemy.prototype._changeDirection = function() {
  // Ghosts don't change directions because they can pass through obstacles!
  if ( this.type === ENEMY_TYPE.ghost ) return;

  this.currentSpeed *= -1;
};
Enemy.prototype._spriteURLForType = function(type) {
  var spriteURL = '';

  switch ( type ) {
    case ENEMY_TYPE.zombie:
    spriteURL = 'images/zombie.png';
    break;

    case ENEMY_TYPE.spider:
    spriteURL = 'images/spider.png';
    break;

    case ENEMY_TYPE.ghost:
    spriteURL = 'images/ghost-right.png';
    break;

    default:
    console.warn('WARNING: ( ' + type + ' ) is not a valid enemy type.');
  }

  return spriteURL;
};

/*
 * Zombie: an enemy zombie
 */
var Zombie = function(x, y, speed) {
  Enemy.call(this, ENEMY_TYPE.zombie, x, y, speed);
};
Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Zombie;

/*
 * Spider: an enemy spider
 */
var Spider = function(x, y, speed, movementDirection, movementRange) {
  Enemy.call(this, ENEMY_TYPE.spider, x, y, speed);
  this.movingSpeed = speed;
  this.movementDirection = movementDirection;
  this.movementRange = movementRange;
};
Spider.prototype = Object.create(Enemy.prototype);
Spider.prototype.constructor = Spider;
Spider.prototype.update = function(dt) {
  var ds, updatedLocation;
  ds = this.currentSpeed * dt;

  switch ( this.movementDirection ) {
    case MOVEMENT_DIRECTION.horizontal:
    this.location.x += ds;
    updatedLocation = this.location.x;
    break;

    case MOVEMENT_DIRECTION.vertical:
    this.location.y += ds;
    updatedLocation = this.location.y;
    break;

    default:
    console.warn("WARNING: movement direction ( " + this.movementDirection + " ) is an invalid movement direction.");
  }

  var spiderHasReachedEndOfWeb = ( updatedLocation <= this.movementRange[0] && this.currentSpeed < 0 ) ||
                                 ( updatedLocation >= this.movementRange[1] && this.currentSpeed > 0 );
  if ( spiderHasReachedEndOfWeb ) {
    this.currentSpeed = 0;
    var spider = this;
    setTimeout(function() {
      spider._changeDirection();
    }, 1000);
  }

  this._updateCollisionBox();
};
Spider.prototype._changeDirection = function() {
  this.movingSpeed *= -1;
  this.currentSpeed = this.movingSpeed;
};

/*
 * Ghost: an enemy ghost
 */
var Ghost = function(x, y, speed) {
  Enemy.call(this, ENEMY_TYPE.ghost, x, y, speed);
  this.normalSpeed = speed;
  this.attackSpeed = 2 * speed;
};
Ghost.prototype = Object.create(Enemy.prototype);
Ghost.prototype.constructor = Ghost;
// Returns true iff player is in enemy's horizontal line of sight.
Ghost.prototype._canSeePlayer = function() {
  if ( player.location.y !== this.location.y ) return false;
  if ( player._isGhost() ) return false;

  if ( this._movingRight() && player.location.x >= this.location.x ||
        this._movingLeft() && player.location.x <= this.location.x ) {
          return true;
  }

  return false;
};
Ghost.prototype._movingRight = function() {
  return this.currentSpeed > 0;
};
Ghost.prototype._movingLeft = function() {
  return this.currentSpeed < 0;
};
Ghost.prototype.update = function(dt) {
  Enemy.prototype.update.call(this, dt)

  this._updateAttackMode();
};
Ghost.prototype._updateSpriteURL = function() {
  var spriteURL;
  if ( this._movingRight ) {
    spriteURL = this._canSeePlayer() ? 'images/ghost-right-attacking.png' : 'images/ghost-right.png';
  } else {
    spriteURL = this._canSeePlayer() ? 'images/ghost-left-attacking.png' : 'images/ghost-left.png';
  }
  this.spriteURL = spriteURL;
};
Ghost.prototype._updateAttackMode = function() {
  if ( this.type !== ENEMY_TYPE.ghost ) return;

  // If ghost can see player, set the sprite to the attacking ghost and
  // increase speed to attacking speed.
  this.currentSpeed = this._canSeePlayer() ? this.attackSpeed : this.normalSpeed;
  this._updateSpriteURL();
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
 *    * webStatus: identifies whether Player is caught in a spider web obstacle, and
 *          whether or not Player has attempted to move out of that web.
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
 *    * _laserShieldAnimation: Reference to the laser shield surrounding the player
 *          while passing through a laser with the LaserMan costume.
 */
var Player = function(spriteURL, x, y) {
  Entity.call(this, spriteURL, x, y);
  this.costumes = [];
  this._laserShieldAnimation = null;
  this.webStatus = {
    caughtInWeb: false,
    hasAttemptedToMove: false
  };
  this.collisionBox;
  //this._setCollisionBox();
  this._updateCollisionBox();
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
// Player.prototype._setCollisionBox = function() {
//   var verticalAdjustment = SPRITE_Y_POSITION_ADJUST + 75;
//
//   this.collisionBox = {
//     width: 50,
//     height: 80,
//     center: {
//       x: ( this.location.x + 0.5 ) * CELL_WIDTH,
//       y: ( this.location.y + 0.5 ) * CELL_HEIGHT + verticalAdjustment
//     }
//   };
// };
Player.prototype._updateCollisionBox = function() {
  var x, y, width, height, verticalAdjustment;
  verticalAdjustment = SPRITE_Y_POSITION_ADJUST + 70;
  x = ( this.location.x + 0.5 ) * CELL_WIDTH;
  y = ( this.location.y + 0.5 ) * CELL_HEIGHT + verticalAdjustment;
  width = 67;
  height = 75;

  this.collisionBox = {
    width: width,
    height: height,
    center: {
      x: x,
      y: y
    }
  };
};
Player.prototype.canSmashRock = function(rock) {
  if ( this._isDwarf() ) {
    return this._dwarfCostume().color === rock.color;
  }
};
Player.prototype.update = function(dt) {
  this._updateCollisionBox();
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
  this._renderCollisionBox();
};
Player.prototype.startLaserShieldAnimation = function() {

  var animation = new Animation.laserShield(this._laserManCostume().color, this.location.x, this.location.y);
  AnimationQueue.addAnimation(animation);

  this._laserShieldAnimation = animation;
  this.laserShieldIsOn = true;
};
Player.prototype.endLaserShieldAnimation = function() {
  if ( this._laserShieldAnimation !== null ) {
    this._laserShieldAnimation.complete = true;
    this.laserShieldIsOn = false;
  }
};
Player.prototype.handleInput = function(direction) {

  // If player is caught in a spider web and has not yet attempted to move away,
  // do not let player move. Instead, show an animation acknowledging the attempt.
  // ( A player can only move out of a spider web on the second attempt to move. )
  if ( player.webStatus.caughtInWeb && !player.webStatus.hasAttemptedToMove ) {
    player.webStatus.hasAttemptedToMove = true;
    // Show web animation here
    // TODO
    var animation = new Animation.webStruggle(player.location.x, player.location.y);
    AnimationQueue.addAnimation(animation);
    return;
  }


  // Attempt to move player
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
      var numCols = BoardManager.boardDimensions().numCols;
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
      var numRows = BoardManager.boardDimensions().numRows;
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
  var playerStartLocation = BoardManager.currentLevelMap.playerStart;
  player = new Player('images/char-boy.png', playerStartLocation.x, playerStartLocation.y);

  // create two enemies
  var enemy1 = new Ghost(0, 5, 1);
  var enemy2 = new Spider(1, 3, 1, MOVEMENT_DIRECTION.horizontal, [1, 3]);
  var movingSpider = new Spider(0, 5, 0.5, MOVEMENT_DIRECTION.horizontal, [0, 5]);
  allEnemies.push(enemy1);
  allEnemies.push(enemy2);
  allEnemies.push(movingSpider);
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
