/*
 * This file contains classes for level layout.
 *
 *  The RowMap class provides information about the type of
 *  rows in each level. ( For example, it might say that the third
 *  row in level two is made of stone blocks. )
 *
 *  The ObstacleMap class provides the type and location of every
 *  obstacle in every level.
 *
 *  The BoardManager class is available globally and is in charge of
 *  providing relevant information about each level during the render
 *  and update stages.
 *
 *  Dependencies:
 *    - obstacles.js
 *      - for OBSTACLE_TYPE
 */
(function() {

  /*
   *  _ROWMAP: Provides a complete description of what ground images
   *  to use for each row in each level.
   *  For example, it might say that the top row of level 1 should
   *  be rendered with the water image.
   */
  var _RowMap = function() {

  };
  _RowMap.prototype.level1 = function() {
    var layout = [
      'images/water-block.png',   // Top row is water
      'images/stone-block.png',
      'images/stone-block.png',
      'images/stone-block.png',
      'images/stone-block.png',
      'images/grass-block.png'    // Bottom row is grass
    ];
    return layout;
  };

  /*
   *  _OBSTACLEMAP: Provides a complete description of the locations of
   *  obstacles for every level.
   *
   *  Methods:
   *    - spriteURLForObstacleType: Returns the corresponding sprite url for
   *        the given obstacle type.
   */
  var _ObstacleMap = function() {

  };
  _ObstacleMap.prototype.spriteURLForObstacleType = function(type) {
    var spriteURL = "";

    switch ( type ) {
      case OBSTACLE_TYPE.rock:
      spriteURL = "images/Rock.png";
      break;

      default:
      console.warn("WARNING: Obstacle type ( " + type + " ) is invalid.");
    }

    return spriteURL;
  };
  _ObstacleMap.prototype.level1 = function() {
    var obstacles = [
      {
        type: OBSTACLE_TYPE.rock,
        spriteURL: this.spriteURLForObstacleType(OBSTACLE_TYPE.rock),
        location: {
          x: 2,
          y: 3
        }
      }
    ];
    return obstacles;
  };

  /*
   *  BOARDMANAGER: Provides relevant information about the design layout
   *  of the current level during the render and update stages.
   *
   *  Properties:
   *    - currentLevel: the current level of the game
   *    - _rowMap: provides row layout information for the
   *              levels
   *    - _obstacleMap: provides obstacle layout information for the
   *                   levels
   *
   *  Methods:
   *    - rowLayout: Returns the row layout for the current level
   *    - obstacleLayout: Returns the obstacle layout for the current level
   */
  var BoardManager = function() {
    this.currentLevel = 0;
    this._rowMap       = new _RowMap();
    this._obstacleMap  = new _ObstacleMap();
  };
  BoardManager.prototype.rowLayout = function() {
    var rowLayout;
    switch ( this.currentLevel ) {
      case 1:
      rowLayout = this._rowMap.level1();
      break;

      default:
      console.warn("WARNING: currentLevel ( " + this.currentLevel + " ) is not a valid level.");
      rowLayout = [];
    }

    return rowLayout;
  };
  BoardManager.prototype.obstacleLayout = function() {
    var obstacleLayout;
    switch ( this.currentLevel ) {
      case 1:
      obstacleLayout = this._obstacleMap.level1();
      break;

      default:
      console.warn("WARNING: currentLevel ( " + this.currentLevel + " ) is not a valid level.");
      obstacleLayout = {};
    }

    return obstacleLayout;
  }

  // Make BoardManager available globally
  window.BoardManager = new BoardManager();

}());
