/**
 * @fileOverview Contains classes for costumes and other collectibles.
 */

/**
 * @constant
 * Costume types
 */
var COSTUME_TYPE = {
  laserman: "laserman",
  ghost: "ghost",
  dwarf: "dwarf"
};


(function() {

  /**
   * Base class for collectibles ( such as costumes and candy ) that can be picked up by the player.
   * @constructor
   * @extends Entity
   * @param {string} type - the type of collectible
   * @param {string} spriteURL - path to the sprite url for this collectible
   * @param {number} x - horizontal location of this collectible on the game board
   * @param {number} y - vertical location of this collectible on the game board
   *
   * @property {string} type - the type of collectible
   * @property {number} originalYLocation - the initial vertical position of this collectible on the game board: Collectible float up and down about this location.
   */
  var _Collectible = function(type, spriteURL, x, y) {
    Entity.call(this, spriteURL, x, y);
    this.type = type;
    this.originalYLocation = this.location.y;
  };
  _Collectible.prototype = Object.create(Entity.prototype);
  _Collectible.prototype.constructor = _Collectible;
  /**
   * Update the vertical positioning of the collectible to make it float up and down.
   * @param {number} dt - a time delta for updating this collectible
   */
  _Collectible.prototype.update = function(dt) {
    var dy, maxDY, frequencyControl;

    // Use a sin function to oscillate dy from [-maxDY, maxDY]
    // maxDY and frequencyControl chosen subjectively
    maxDY = 0.1;
    frequencyControl = 800;
    dy = maxDY * Math.sin(Date.now() / frequencyControl);
    this.location.y = this.originalYLocation + dy;
  };
  /**
   * Render collectible to the screen.
   */
  _Collectible.prototype.render = function() {
    var x, y;
    x = this.location.x * CELL_WIDTH;
    y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;

    ctx.drawImage(Resources.get(this.spriteURL), x, y);
  };


  /**
   * The precious candy corn player is trying to find!
   * @constructor
   * @extends _Collectible
   * @param {number} x - the horizontal position of the candy on the game board
   * @param {number} y - the vertical position of the candy on the game board
   */
  var Candy = function(x, y) {
    _Collectible.call(this, "candy", 'images/candy-corn.png', x, y);
  };
  Candy.prototype = Object.create(_Collectible.prototype);
  Candy.prototype.constructor = Candy;


  /**
   * The LaserMan costume.
   * @constructor
   * @extends _Collectible
   * @param {string} color - the color of this LaserMan costume
   * @param {number} x - the horizontal position of this costume on the board
   * @param {number} y - the vertical position of this costume on the board
   *
   * @property {string} spriteURL - the sprite url for this costume
   * @property {string} color - the color of this costume
   */
  var LaserMan = function(color, x, y) {
    var spriteURL = spriteURLForColor(color);
    _Collectible.call(this, COSTUME_TYPE.laserman, spriteURL, x, y);
    this.spriteURL = spriteURL;
    this.color = color;

    function spriteURLForColor(color) {
      var spriteURL = "";

      switch ( color ) {
        case COLOR.red:
        spriteURL = 'images/glasses-red.png';
        break;

        case COLOR.blue:
        spriteURL = 'images/glasses-blue.png';
        break;

        case COLOR.yellow:
        spriteURL = 'images/glasses-yellow.png';
        break;

        default:
        console.warn("WARNING: invalid color ( " + color + " ) for LaserMan.");
      }

      return spriteURL;
    }
  };
  LaserMan.prototype = Object.create(_Collectible.prototype);
  LaserMan.prototype.constructor = LaserMan;


  /**
   * The Dwarf costume
   * @constructor
   * @extends _Collectible
   * @param {string} color - the color of this costume
   * @param {number} x - the horizontal position of this costume on the game board
   * @param {number} y - the vertical position of this costume on the game board
   *
   * @property {string} spriteURL - the sprite url for this costume
   * @property {string} color - the color of this costume
   */
  var Dwarf = function(color, x, y) {
    var spriteURL = spriteURLForColor(color);
    _Collectible.call(this, COSTUME_TYPE.dwarf, spriteURL, x, y);
    this.spriteURL = spriteURL;
    this.color = color;

    function spriteURLForColor(color) {
      var spriteURL = "";

      switch ( color ) {
        case COLOR.red:
        spriteURL = 'images/dwarf-red.png';
        break;

        case COLOR.blue:
        spriteURL = 'images/dwarf-blue.png';
        break;

        case COLOR.yellow:
        spriteURL = 'images/dwarf-yellow.png';
        break;

        default:
        console.warn("WARNING: invalid color ( " + color + " ) for Dwarf.");
      }

      return spriteURL;
    }
  };
  Dwarf.prototype = Object.create(_Collectible.prototype);
  Dwarf.prototype.constructor = Dwarf;


  /**
   * The Ghost costume.
   * @constructor
   * @extends _Collectible
   * @param {number} x - the horizontal position of this costume on the game board
   * @param {number} y - the vertical position of this costume on the game board
   *
   * @property {string} spriteURL - the sprite url for this costume
   */
  var Ghost = function(x, y) {
    _Collectible.call(this, COSTUME_TYPE.ghost, 'images/ghost-costume.png', x, y);
    this.spriteURL = 'images/ghost-costume.png';
  };
  Ghost.prototype = Object.create(_Collectible.prototype);
  Ghost.prototype.constructor = Ghost;

  // Make Candy available globally
  window.Candy = Candy;

  // Make Costume a global variable for accessing the various costumes
  window.Costume = {
    laserman: LaserMan,
    dwarf: Dwarf,
    ghost: Ghost
  };

}());
