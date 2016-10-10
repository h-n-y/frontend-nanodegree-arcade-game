/**
 * @fileOverview Classes for enemies, player, and event listeners for user input.
 */

/**
 * @constant
 * The width of each cell on the board
 */
var CELL_WIDTH = 101;
/**
 * @constant
 * The height of each cell on the board
 */
var CELL_HEIGHT = 83;

/**
 *  @constant
 *  Offsets Entity sprite image on canvas in order to correctly align
 *  it vertically with the row the Entity occupies.
 */
var SPRITE_Y_POSITION_ADJUST = -20;

/**
 * @constant
 * The types of enemies in the game.
 */
var ENEMY_TYPE = {
  zombie: "zombie",
  spider: "spider",
  ghost: "ghost"
};

/**
 * @constant
 * Describes whether an enemy moves in a horizontal or vertical direction.
 * Used for the <tt>Spider</tt> enemy only.
 */
var MOVEMENT_DIRECTION = {
  vertical: "vertical",
  horizontal: "horizontal"
};

/**
 * Provides basic properties and methods used to position and draw entities
 * on the game board.
 * @constructor
 * @param {string} spriteURL - path to the image representing this entity
 * @param {number} x - horizontal location of the entity on the game board
 * @param {number} y - vertical location of the entity on the game board
 *
 * @property {string} spriteURL - path to the image representing this entity
 * @property {Object} location - the location of this entity on the game board
 * @property {Object} collisionBox - a box centered around the entity used for collision detection
 * @property {boolean} isColliding - <tt>true</tt> iff this entity is colliding with another entity
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
};
/**
 * Called by <tt>Entity.render</tt> to do the actual work of drawing the <tt>Entity</tt>'s sprite onscreen.
 */
Entity.prototype._draw = function() {
  // Get the origin for drawing
  var x = this.location.x * CELL_WIDTH;
  var y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;

  // draw sprite to canvas
  ctx.drawImage(Resources.get(this.spriteURL), x, y);
};
/** Renders the <tt>Entity</tt>'s sprite onscreen */
Entity.prototype.render = function() {
  this._draw();
  // for development only
  //this._renderCollisionBox();
};
/**
 * Updates any data or properties - called continuously by the game loop.
 * Default functionality is to do nothing - subclasses override this method.
 */
Entity.prototype.update = function(dt) {
  // noop
};
/**
 * @returns {boolean} <tt>true</tt> iff this <tt>Entity</tt> is colliding with another <tt>Entity</tt>
 */
Entity.prototype.isCollidingWithEntity = function(entity) {
  return this._collisionBoxIntersects(entity);
};
/**
 * @param {Object} entity - The entity whose collision box is being checked for intersection
 * @returns {boolean} true iff this <tt>Entity</tt>'s collision box intersects with the parameter entity's collision box.
 */
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

    // Check if either of the two laser nodes is intersected
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

    /**
     * @see <a href="http://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection">here</a>
     */
    return ( thisRect.left <= thatRect.right && thisRect.right >= thatRect.left && thisRect.top <= thatRect.bottom && thisRect.bottom >= thatRect.top );
  }
};
/**
 * Renders the entity's collision box to the screen.
 * Used for development only.
 */
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


/**
 * An entity the player must avoid in order to progress through the game.
 * @constructor
 * @extends Entity
 * @param {string} type - the type of enemy
 * @param {number} x - the horizontal location of the enemy on the game board
 * @param {number} y - the vertical location of the enemy on the game board
 * @param {number} speed - the moving speed of the enemy
 *
 * @property {string} type - the type of enemy
 * @property {number} currentSpeed - the current moving speed of the enemy
 * @property {number} id - A unique identifier for this enemy. Used when removing the enemy from the game board.
 */
var Enemy = function(type, x, y, speed) {
  var spriteURL = this._spriteURLForType(type);
  Entity.call(this, spriteURL, x, y);
  this.spriteURL = spriteURL;
  this.type = type;
  this.currentSpeed = speed;
  this.id = 0;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;
/**
 * Updates the enemy's current position
 * @param {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    var ds = this.currentSpeed * dt;
    this.location.x += ds;

    this._updateCollisionBox();
    this._checkIfStillInBounds();
};
/**
 * Updates the enemy's collision box to match the enemy's current position.
 */
Enemy.prototype._updateCollisionBox = function() {
  var x, y, verticalAdjustment, width, height;

  // Set width, height, verticalAdjustment according to what type of enemy this is.
  switch ( this.type ) {
    case ENEMY_TYPE.zombie:
    width = 65;
    height = 72;
    verticalAdjustment = 47;
    break;

    case ENEMY_TYPE.spider:
    width = 65;
    height = 60;
    verticalAdjustment = 55;
    break;

    case ENEMY_TYPE.ghost:
    width = 55;
    height = 72;
    verticalAdjustment = 47;
    break;

    default:
    console.warn("WARNING: ( " + this.type + " ) is an invalid enemy type.");
  }

  x = ( this.location.x + 0.5 ) * CELL_WIDTH;
  y = ( this.location.y + 0.5 ) * CELL_HEIGHT + verticalAdjustment;

  // Update collision box
  this.collisionBox.center.x = x;
  this.collisionBox.center.y = y;
  this.collisionBox.width = width;
  this.collisionBox.height = height;
};
/**
 * Checks if enemy is still on the game board. If not, the enemy is removed from the
 * global <tt>allEnemies</tt> array to conserve memory.
 */
Enemy.prototype._checkIfStillInBounds = function() {
  var outOfBounds = ( this.location.x <= -1 || this.location.x >= BoardManager.currentLevelMap.numCols ||
                      this.location.y <= -1 || this.location.y >= BoardManager.currentLevelMap.numRows );
  if ( outOfBounds ) {
    // Enemy is out of bounds - remove it from the allEnemies array
    var id, enemyIndex;
    id = this.id;
    enemyIndex = allEnemies.findIndex(function(enemy) {
      return enemy.id === id;
    });
    if ( enemyIndex >= 0 ) {
      allEnemies.splice(enemyIndex, 1);
    }
  }
};
/**
 * Checks whether enemy has collided with an obstacle or the player.
 */
Enemy.prototype.checkCollisions = function() {

  this.isColliding = false;

  // Check collisions with rock and laser obstacles, only if enemy is NOT
  // a ghost - ghosts can pass throught these obstacles and will never
  // collide with them.
  var enemyIsNotGhost = !(this.type === ENEMY_TYPE.ghost);
  if ( enemyIsNotGhost ) {

    // Get all rock and laser obstacles
    var obstacles = BoardManager.currentLevelMap.obstacleLayout.filter(function(obstacle) {
      return obstacle.type !== OBSTACLE_TYPE.web;
    });

    // Check whether `this` has run into a rock or laser node
    var obstacle;
    for ( var i = 0; i < obstacles.length; ++i ) {
      obstacle = obstacles[i];
      if ( this.isCollidingWithEntity(obstacle) ) {
        this.isColliding = true;

        // Change enemy direction after it 'hits' the obstacle
        this._changeDirection();
        // NOTE
        // This is just a precaution to move the enemy's collision box out of the obstacle it's
        // collided with to avoid glitching.
        this.location.x += this.currentSpeed * 0.05;
        break;
      }
    }
  }

  // Check if enemy has collided with player
  if ( this.isCollidingWithEntity(player) ) {

    // Do nothing if enemy is a Ghost and player is wearing the Ghost costume
    if ( this.type === ENEMY_TYPE.ghost && player._isGhost() ) return;

    this.isColliding = true;

    // Player dies: start level over
    BoardManager.showPlayerCollisionAnimation();
    BoardManager.restartCurrentLevel();
  }
};
/**
 * Causes the enemy to change direction. Called after an enemy runs into an obstacle.
 */
Enemy.prototype._changeDirection = function() {
  // Ghosts don't change directions because they can pass through obstacles!
  if ( this.type === ENEMY_TYPE.ghost ) return;

  this.currentSpeed *= -1;
};
/**
 * @param {string} type - the type of enemy
 * @returns {string} the sprite url for this enemy
 */
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


/**
* An enemy Zombie
* @constructor
* @extends Enemy
* @param {number} x - the horizontal position of this zombie on the game board
* @param {number} y - the vertical position of this zombie on the game board
* @param {number} speed - the moving speed of this zombie
*/
var Zombie = function(x, y, speed) {
  Enemy.call(this, ENEMY_TYPE.zombie, x, y, speed);
};
Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Zombie;


/**
 * An enemy spider.
 * @constructor
 * @extends Enemy
 * @param {number} x - the horizontal position of this spider on the game board
 * @param {number} y - the vertical position of this spider on the game board
 * @param {string} movementDirection - the direction this spider moves: horizontally or vertically
 * @param {Array} movementRange - array of two ( board grid ) numbers describing the max movement range of this spider
 *
 * @property {number} movingSpeed - the moving speed of this spider
 * @property {string} movementDirection - the direction this spider moves: horiztonally or vertically
 * @property {Array} movementRange - arraw of two ( board grid ) numbers describing the max movement range of this spider
 */
var Spider = function(x, y, speed, movementDirection, movementRange) {
  Enemy.call(this, ENEMY_TYPE.spider, x, y, speed);
  this.movingSpeed = speed;
  this.movementDirection = movementDirection;
  this.movementRange = movementRange;
};
Spider.prototype = Object.create(Enemy.prototype);
Spider.prototype.constructor = Spider;
/**
 * Updates the location, collision box, and movement speed of the spider
 */
Spider.prototype.update = function(dt) {
  var ds, updatedLocation;
  ds = this.currentSpeed * dt;

  // Update the spider's position
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
    // Change directions now that spider has reached the end of its movement range
    this.currentSpeed = 0;
    var spider = this;
    setTimeout(function() {
      spider._changeDirection();
    }, 1000);
  }

  this._updateCollisionBox();
};
/**
 * Reverses the spider's direction.
 */
Spider.prototype._changeDirection = function() {
  this.movingSpeed *= -1;
  this.currentSpeed = this.movingSpeed;
};


/**
 * An enemy ghost.
 * @constructor
 * @param {number} x - the horizontal position of the ghost on the game board
 * @param {number} y - the vertical position of the ghost on the game board
 * @param {number} speed - the movement speed of the ghost
 *
 * @property {number} normalSpeed - the ghost's normal moving speed
 * @property {number} attackSpeed - the ghost's speed when attacking player
 */
var Ghost = function(x, y, speed) {
  Enemy.call(this, ENEMY_TYPE.ghost, x, y, speed);
  this.normalSpeed = speed;
  this.attackSpeed = 2 * speed;
  this._updateSpriteURL();
};
Ghost.prototype = Object.create(Enemy.prototype);
Ghost.prototype.constructor = Ghost;
/**
 * @returns true iff player is in enemy's horizontal line of sight.
 */
Ghost.prototype._canSeePlayer = function() {
  if ( player.location.y !== this.location.y ) return false;
  // Ghosts can't see player dressed in a ghost costume.
  if ( player._isGhost() ) return false;

  if ( this._movingRight() && player.location.x >= this.location.x ||
        this._movingLeft() && player.location.x <= this.location.x ) {
          return true;
  }

  return false;
};
/**
 * @returns true iff ghost is moving to the right
 */
Ghost.prototype._movingRight = function() {
  return this.currentSpeed > 0;
};
/**
 * @returns true iff ghost is moving to the left
 */
Ghost.prototype._movingLeft = function() {
  return this.currentSpeed < 0;
};
/**
 * Updates ghost's location and attack mode.
 */
Ghost.prototype.update = function(dt) {
  Enemy.prototype.update.call(this, dt);

  this._updateAttackMode();
};
/**
 * Updates ghost's sprite url. If ghost can see player, its sprite is an image of
 * an attacking ghost.
 */
Ghost.prototype._updateSpriteURL = function() {
  var spriteURL;
  if ( this._movingRight() ) {
    spriteURL = this._canSeePlayer() ? 'images/ghost-right-attacking.png' : 'images/ghost-right.png';
  } else {
    spriteURL = this._canSeePlayer() ? 'images/ghost-left-attacking.png' : 'images/ghost-left.png';
  }
  this.spriteURL = spriteURL;
};
/**
 * Activates ghost's attack mode if it can see player. Deactivates otherwise.
 */
Ghost.prototype._updateAttackMode = function() {
  //if ( this.type !== ENEMY_TYPE.ghost ) return;

  // If ghost can see player, set the sprite to the attacking ghost and
  // increase speed to attacking speed.
  this.currentSpeed = this._canSeePlayer() ? this.attackSpeed : this.normalSpeed;
  this._updateSpriteURL();
};


/**
 * The player.
 * @constructor
 * @extends Entity
 * @param {string} spriteURL - path to player's sprite image
 * @param {number} x - horizontal position of player on game board
 * @param {number} y - vertical position of player on game board
 *
 * @property {Array} costumes - an array of all the costumes player is currently wearing
 * @property {Animation} _laserShieldAnimation - an animation that appears around player if walking through lasers with the LaserMan costume equipped
 * @property {Object} webStatus - describes whether player is currently trapped in a spider web and if player has attempted to escape
 * @property {Object} collisionBox - a box surrounding the player used for collision detection
 */
var Player = function(spriteURL, x, y) {
  Entity.call(this, spriteURL, x, y);
  this.costumes = [];
  this._laserShieldAnimation = null;
  this.webStatus = {
    caughtInWeb: false,
    hasAttemptedToMove: false
  };
  this.collisionBox = {};
  this._updateCollisionBox();
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
/**
 * Updates player's collision box to match player's current location.
 */
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
/**
 * @param {Rock} rock - the rock to check for smashability
 * @returns true iff player is able to smash <tt>rock</tt>.
 */
Player.prototype.canSmashRock = function(rock) {
  if ( this._isDwarf() ) {
    return this._dwarfCostume().color === rock.color;
  }
};
/** Updates player's collision box */
Player.prototype.update = function(dt) {
  this._updateCollisionBox();
};
/**
 * Draws the player on any worn costumes onscreen.
 */
Player.prototype._draw = function() {
  // Call superclass implementation
  Entity.prototype._draw.call(this);
  if ( this.costumes.length === 0 ) return;


  var x, y;
  x = this.location.x * CELL_WIDTH;
  y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;

  // DRAW ANY COSTUMES PLAYER IS WEARING

  // Check if player is a Ghost
  if ( this._isGhost() ) {
    var spriteURL = 'images/ghost-costume.png';
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
/**
 * @returns true iff player is wearing the ghost costume
 */
Player.prototype._isGhost = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.ghost;
  }).length > 0;
};
/**
 * @returns true iff player is wearing the dwarf costume
 */
Player.prototype._isDwarf = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.dwarf;
  }).length > 0;
};
/**
 * @return true iff player is wearing the LaserMan costume
 */
Player.prototype._isLaserMan = function() {
  return this.costumes.filter(function(costume) {
    return costume.type === COSTUME_TYPE.laserman;
  }).length > 0;
};
/**
 * @returns {Dwarf|undefined} the dwarf costume player is wearing or <tt>undefined</tt>
 */
Player.prototype._dwarfCostume = function() {
  return this.costumes.find(function(costume) {
    return costume.type === COSTUME_TYPE.dwarf;
  });
};
/**
 * @returns {LaserMan|undefined} the LaserMan costume player is wearing or <tt>undefined</tt>
 */
Player.prototype._laserManCostume = function() {
  return this.costumes.find(function(costume) {
    return costume.type === COSTUME_TYPE.laserman;
  });
};
/**
 * Removes any dwarf costume the player may be wearing.
 */
Player.prototype.removeDwarfCostume = function() {
  this._removeCostumeOfType(COSTUME_TYPE.dwarf);
};
/**
 * Removes any LaserMan costume the player may be wearing.
 */
Player.prototype.removeLaserManCostume = function() {
  this._removeCostumeOfType(COSTUME_TYPE.laserman);
};
/**
 * Removes from player a costume matching <tt>type</tt>
 * @param {string} type - the type of costume to remove
 */
Player.prototype._removeCostumeOfType = function(type) {
  var index = this.costumes.findIndex(function(costume) {
    return costume.type === type;
  });
  if ( index >= 0 ) {
    this.costumes.splice(index, 1);
  }
};
/** Draws the player to the screen */
Player.prototype.render = function() {
  this._draw();
  // Development only
  //this._renderCollisionBox();
};
/**
 * Begins the laser shield animation around the player.
 * Used when player is walking through laser beams equipped with the LaserMan costume.
 */
Player.prototype.startLaserShieldAnimation = function() {

  var animation = new Animation.laserShield(this._laserManCostume().color, this.location.x, this.location.y);
  AnimationQueue.addAnimation(animation);

  this._laserShieldAnimation = animation;
  this.laserShieldIsOn = true;
};
/**
 * Ends the laser shield animation shown around the player.
 */
Player.prototype.endLaserShieldAnimation = function() {
  if ( this._laserShieldAnimation !== null ) {
    this._laserShieldAnimation.complete = true;
    this.laserShieldIsOn = false;
  }
};
/**
 * Attempts to move the player in response to user arrow input.
 */
Player.prototype.handleInput = function(direction) {
  if ( direction === undefined ) return;

  // If player is caught in a spider web and has not yet attempted to move away,
  // do not let player move. Instead, show an animation acknowledging the attempt.
  // ( A player can only move out of a spider web on the second attempt to move. )
  if ( player.webStatus.caughtInWeb && !player.webStatus.hasAttemptedToMove ) {
    player.webStatus.hasAttemptedToMove = true;

    // Show web animation
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

    // Attempt to move player
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

  BoardManager.beginCurrentLevel();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
  var space = 32;
  if ( e.keyCode === space ) {
    console.log("space bar pressed");
    PopoverManager.removePopover();
    return;
  }

  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});


//init();

window.onload = function() {
  init();
};
