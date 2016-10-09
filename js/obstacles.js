// This file contains definitions for obstacles that in some way
// impede Player or Enemy objects' movement across the board.
//
// Obstacle class constructors can be accessed globally through
// the Obstacle object.
//    (i.e. var myRock = new Obstacle.rock() )
//
// Summary:
//  - Rock:   _solid_ impassable obstacle.
//  - Web:    _sticky_ obstacle.
//  - Laser:  _dangerous_ obstace.
//
// Dependencies: app.js
//
var COLOR = {
  red:    "red",
  blue:   "blue",
  yellow: "yellow",
  gray:   "gray",
};

var OBSTACLE_TYPE = {
  rock: "rock",
  web: "web",
  laser: "laser"
};

(function() {

  /*
   *  OBSTACLE: Represents an obstacle Enemy and Player instances generally
   *  cannot pass through.
   *
   *  Class Hierarchy: Object > Entity > Obstacle
   */
  var Obstacle = function(type, spriteURL, x, y) {
    Entity.call(this, spriteURL, x, y);
    this.type = type;
  };
  Obstacle.prototype = Object.create(Entity.prototype);
  Obstacle.prototype.constructor = Obstacle;

  /*
   *  ROCK: A solid obstacle through which Enemy and Player instances
   *  cannot pass.
   *
   *  Colored rocks ( red, blue, and yellow ) can be broken by a Dwarf
   *  of the same color;
   *
   *  Class Hierarchy: Object > Entity > Obstacle > Rock
   */
  var Rock = function(color, x, y) {
    var spriteURL;
    spriteURL = spriteURLForColor(color);
    Obstacle.call(this, OBSTACLE_TYPE.rock, spriteURL, x, y);
    this.color = color;
    var verticalAdjustment = 50;
    this.collisionBox = {
      width: 85,
      height: 77,
      center: {
        x: ( this.location.x + 0.5 ) * CELL_WIDTH,
        y: ( this.location.y + 0.5 ) * CELL_HEIGHT + verticalAdjustment
      }
    };

    function spriteURLForColor(color) {
      var spriteURL;

      switch ( color ) {
        case COLOR.red:
        spriteURL = "images/rock-red.png";
        break;

        case COLOR.blue:
        spriteURL = "images/rock-blue.png";
        break;

        case COLOR.yellow:
        spriteURL = "images/rock-yellow.png";
        break;

        default:
        spriteURL = "images/Rock.png";
      }

      return spriteURL;
    }
  };
  Rock.prototype = Object.create(Obstacle.prototype);
  Rock.prototype.constructor = Rock;
  Rock.prototype.render = function() {
    Entity.prototype.render.call(this);

    // Development only
    //this._renderCollisionBox();
  };

  /*
   * JackoLantern: A jack-o-lantern obstacle.
   *
   *  Class Hierarchy: Object > Entity > Rock > JackoLantern
   *
   */
  var JackoLantern = function(x, y) {
    Rock.call(this, null, x, y);
    this.spriteURL = 'images/pumpkin.png';
    this.collisionBox = {
      width: 95,
      height: 77,
      center: {
        x: ( this.location.x + 0.5 ) * CELL_WIDTH,
        y: ( this.location.y + 0.5 ) * CELL_HEIGHT + 50
      }
    };
  };
  JackoLantern.prototype = Object.create(Rock.prototype);
  JackoLantern.prototype.constructor = JackoLantern;

  /*
   *  Skull: A skull-shaped obstacle.
   */
  var Skull = function(x, y) {
    Rock.call(this, null, x, y);
    this.spriteURL = 'images/skull.png';
    // this.collisionBox = {
    //
    // };
  };
  Skull.prototype = Object.create(Rock.prototype);
  Skull.prototype.constructor = Skull;

  /*
   * WEB: A sticky obstacle that hampers Player's movement.
   *
   *  Class Hierarchy: Object > Entity > Obstacle > Web
   */
  var Web = function(x, y) {
    Obstacle.call(this, OBSTACLE_TYPE.web, 'images/web.png', x, y);
  };
  Web.prototype = Object.create(Obstacle.prototype);
  Web.prototype.constructor = Web;

  /*
   * LASER: An obstacle that fires a horizontal laser beam between two
   * laser nodes.
   *
   *  Impassable unless player is wearing the LASERMAN costume.
   *
   *  Class Hierarchy: Object > Entity > Obstacle > Laser
   */
  var Laser = function(color, locationLeft, locationRight, y) {
    // Intentionally omit arguments for spriteURL, x, y. These arguments
    // are not amenable to Laser because it requires *two* sprites and
    // *two* locations in order to be placed on the board.
    Obstacle.call(this, OBSTACLE_TYPE.laser);

    this.beamColor = {
      name: color,
      rgb: ""
    };
    this._setBeamColor(color);
    this.locationLeftLaserNode = locationLeft;
    this.locationRightLaserNode = locationRight;
    this.y = y;
    this.SPRITE_URL_LEFT_LASERNODE = 'images/laser-left.png';
    this.SPRITE_URL_RIGHT_LASERNODE = 'images/laser-right.png';
    this.laserNodeCollisionBoxes;
    this._setLaserNodeCollisionBoxes();
    this.laserBeamParticle;
    this._setLaserBeamParticle();
  };
  Laser.prototype = Object.create(Obstacle.prototype);
  Laser.prototype.constructor = Laser;
  Laser.prototype._setLaserNodeCollisionBoxes = function() {
    var width, height, y, verticalAdjustment;
    width = 85;
    height = 50;
    verticalAdjustment = SPRITE_Y_POSITION_ADJUST + 110;
    y = this.y * CELL_HEIGHT + verticalAdjustment;

    this.laserNodeCollisionBoxes = {
      left: {
        width: width,
        height: height,
        center: {
          x: ( this.locationLeftLaserNode + 0.5 ) * CELL_WIDTH,
          y: y
        }
      },
      right: {
        width: width,
        height: height,
        center: {
          x: ( this.locationRightLaserNode + 0.5 ) * CELL_WIDTH,
          y: y
        }
      }
    };
  };
  Laser.prototype._setLaserBeamParticle = function() {
    var verticalAdjustment = SPRITE_Y_POSITION_ADJUST + 110;

    this.laserBeamParticle = {
      width: 0.7 * CELL_WIDTH,
      height: 10,
      color: this.beamColor.rgb,
      center: {
        x: ( this.locationLeftLaserNode + 0.5 ) * CELL_WIDTH,
        y: this.y * CELL_HEIGHT + verticalAdjustment
      },
      maxLeft: ( this.locationLeftLaserNode + 0.5 ) * CELL_WIDTH,
      maxRight: ( this.locationRightLaserNode + 0.5 ) * CELL_WIDTH,
      update: function(dt) {
        var dx, maxDX, frequencyControl;
        maxDX = this.maxRight - this.maxLeft;
        frequencyControl = 50;
        dx = Math.abs(maxDX * Math.sin(Date.now() / frequencyControl));
        this.center.x = this.maxLeft + dx;
      }
    };
  };
  Laser.prototype.update = function(dt) {
    this.laserBeamParticle.update(dt);
  };
  Laser.prototype.render = function() {
    if ( this.locationLeftLaserNode.x !== this.locationRightLaserNode.x ) {
      console.warn("WARNING: Laser's nodes are not on the same row - will not render.");
      return;
    }

    this._renderLaserBeam();
    this._renderLaserNodes();
    // for development only
    //this._renderCollisionBox();
  };
  Laser.prototype._renderLaserBeam = function() {
    ctx.save();

    var laserBeamWidth, laserBeamHeight;
    laserBeamWidth = this.laserBeamParticle.width;
    laserBeamHeight = this.laserBeamParticle.height;
    
    ctx.fillStyle = this.laserBeamParticle.color;
    ctx.fillRect(this.laserBeamParticle.center.x - laserBeamWidth / 2, this.laserBeamParticle.center.y - laserBeamHeight / 2, laserBeamWidth, laserBeamHeight);

    ctx.restore();
  };
  Laser.prototype._renderLaserNodes = function() {

    var x, y, verticalAdjustment;

    verticalAdjustment = SPRITE_Y_POSITION_ADJUST + 25;

    // Draw left laser node
    x = this.locationLeftLaserNode * CELL_WIDTH;
    y = this.y * CELL_HEIGHT + verticalAdjustment;
    ctx.drawImage(Resources.get(this.SPRITE_URL_LEFT_LASERNODE), x, y);

    // Draw right laser node
    x = this.locationRightLaserNode * CELL_WIDTH;
    y = this.y * CELL_HEIGHT + verticalAdjustment;
    ctx.drawImage(Resources.get(this.SPRITE_URL_RIGHT_LASERNODE), x, y);
  };
  Laser.prototype._setBeamColor = function(color) {
    switch ( color ) {
      case COLOR.red:
      this.beamColor.rgb = "rgb(241, 70, 70)";
      break;

      case COLOR.yellow:
      this.beamColor.rgb = "rgb(244, 227, 106)";
      break;

      case COLOR.blue:
      this.beamColor.rgb = "rgb(26, 156, 237)";
      break;

      default:
      console.warn("WARNING: " + color + " is not a valid color.");
      this.beamColor.rgb = "black";
    }
  };
  Laser.prototype._renderCollisionBox = function() {
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Render left collision box
    ctx.save();
    var leftBox = this.laserNodeCollisionBoxes.left;
    ctx.translate(leftBox.center.x, leftBox.center.y);
    ctx.strokeRect(-leftBox.width / 2, -leftBox.height / 2, leftBox.width, leftBox.height);
    ctx.restore();

    // Render right collision box
    var rightBox = this.laserNodeCollisionBoxes.right;
    ctx.translate(rightBox.center.x, rightBox.center.y);
    ctx.strokeRect(-rightBox.width / 2, -rightBox.height / 2, rightBox.width, rightBox.height);


    ctx.restore();
  };
  // // Override Entity implementation
  // Laser.prototype._collisionBoxIntersects = function(entity) {
  //
  // };

  // Allow global access to the Rock, Web, and Laser classes.
  window.Obstacles = {
    rock: Rock,
    web: Web,
    laser: Laser,
    jackolantern: JackoLantern,
    skull: Skull
  };

}());
