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
  web: "web"
};

(function() {

  /*
   *  OBSTACLE: Represents an obstacle Enemy and Player instances generally
   *  cannot pass through ( easily ).
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
   *  Colored rocks ( red, blue, and yellow ) can be broken by a hammer
   *  of the same color;
   *
   *  Class Hierarchy: Object > Entity > Obstacle > Rock
   */
  var Rock = function(color, x, y) {
    var spriteURL;
    spriteURL = spriteURLForColor(color);
    Obstacle.call(this, OBSTACLE_TYPE.rock, spriteURL, x, y);
    this.color = color;

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
  var Laser = function(locationLeft, locationRight, y) {
    // Intentionally omit arguments for spriteURL, x, y. These arguments
    // are not amenable to Laser because it requires *two* sprites and
    // *two* locations in order to be placed on the board.
    Obstacle.call(this, OBSTACLE_TYPE.laser);

    this.locationLeftLaserNode = locationLeft;
    this.locationRightLaserNode = locationRight;
    this.y = y;
    this.SPRITE_URL_LEFT_LASERNODE = 'images/laser-left.png';
    this.SPRITE_URL_RIGHT_LASERNODE = 'images/laser-right.png';
  };
  Laser.prototype = Object.create(Obstacle.prototype);
  Laser.prototype.constructor = Laser;

  // Allow global access to the Rock, Web, and Laser classes.
  window.Obstacles = {
    rock: Rock,
    web: Web,
    laser: Laser
  };

}());
