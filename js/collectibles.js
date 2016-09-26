// Dependencies:
//  obstacles.js
//    for COLOR
(function() {

  /*
   *  _COLLECTIBLE: Base class for collectibles that can be picked up
   *  by the player.
   *
   *  Class Hierarchy: Object > Entity > _Collectible
   *
   *  Properties:
   *    * centralYLocation: the starting y-position of the _Collectible.
   *        _Collectibles float up and down and oscillate vertically about this
   *        position.
   */
  var _Collectible = function(spriteURL, x, y) {
    Entity.call(this, spriteURL, x, y);
    this.centralYLocation = this.location.y;
  };
  _Collectible.prototype = Object.create(Entity.prototype);
  _Collectible.prototype.constructor = _Collectible;
  // Override Entity implementation
  // Updates the vertical positioning of this _Collectible to make
  // it appear to float up and down.
  _Collectible.prototype.update = function(dt) {
    var dy, maxDY, frequencyControl;

    // Use a sin function to oscillate dy from [-maxDY, maxDY]
    // maxDY and frequencyControl were chosen subjectively
    maxDY = 0.1;
    frequencyControl = 800;
    dy = maxDY * Math.sin(Date.now() / frequencyControl);
    this.location.y = this.centralYLocation + dy;
  };
  _Collectible.prototype.render = function() {
    var x, y;
    x = this.location.x * CELL_WIDTH;
    y = this.location.y * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST;
    ctx.drawImage(Resources.get(this.spriteURL), x, y);
  };

  /*
   *  CANDY: Represents a piece of candy the player is trying to acquire.
   *
   *  Class Hierarchy: Object > Entity > _Collectible > Candy
   */
  var Candy = function(x, y) {
    // TODO: change spriteURL!
    _Collectible.call(this, 'images/enemy-bug.png', x, y);
  };
  Candy.prototype = Object.create(_Collectible.prototype);
  Candy.prototype.constructor = Candy;

  /*
   * LASERMAN: A collectible costume the player can adorn to become
   *           invulnerable to laser beams of the same color!
   *           Comes in three flavors:
   *            - red
   *            - blue
   *            - yellow
   *
   *  Class Hierarchy: Object > Entity > _Collectible > LaserMan
   *
   *  Properties:
   *    * color: the color of the costume
   *        - LaserMan is only invulnerable to lasers of the same color
   */
  var LaserMan = function(color, x, y) {
    var spriteURL = spriteURLForColor(color);
    _Collectible.call(this, spriteURL, x, y);
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

  /*
   *  DWARF: A collectible costume that enables the player to smash
   *        rocks of the same color!
   *        Comes in three flavors:
   *          - red
   *          - blue
   *          - yellow
   *
   *  Class Hierarchy: Object > Entity > _Collectible > Dwarf
   *
   *  Properties:
   *    * color: the color of the costume
   *        - Dwarf can only smash rocks of the same color
   */
  var Dwarf = function(color, x, y) {
    var spriteURL = spriteURLForColor(color);
    _Collectible.call(this, spriteURL, x, y);
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

  var Ghost = function(x, y) {
    _Collectible.call(this, 'images/ghost-costume.png', x, y);
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
