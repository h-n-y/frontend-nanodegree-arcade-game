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
 *      - global Obstacles object
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
  _ObstacleMap.prototype.level1 = function() {
    var obstacles = [
      new Obstacles.rock(COLOR.gray, 2, 3)
    ];
    return obstacles;
  };

  /*
   *  BOARDMANAGER: Provides relevant information about the design layout
   *  of the current level during the render and update stages.
   *
   *  Properties:
   *    * currentLevel: the current level of the game
   *    * _rowMap: provides row layout information for the
   *              levels
   *    * _obstacleMap: provides obstacle layout information for the
   *                   levels
   *
   *  Methods:
   *    *  renderBoard: Renders the game board and all obstacles to the canvas
   *    *  playerCanOccupyLocation: Returns true iff player is allowed to move
   *    *     into the location given by the argument.
   *
   *    * _renderRows: Helper method for renderBoard; renders the board's rows
   *    * _renderObstacles: Helper method for renderBoard; renders the board's obstacles
   *    * _rowLayout: Returns the row layout for the current level
   *    * _obstacleLayout: Returns the obstacle layout for the current level
   */
  var BoardManager = function() {
    this.currentLevel = 0;
    this._rowMap       = new _RowMap();
    this._obstacleMap  = new _ObstacleMap();
  };
  BoardManager.prototype.playerCanOccupyLocation = function(location) {
    var allObstacles, rocks, lasers;
    allObstacles = this._obstacleLayout();

    // Prevent player from moving into a location occupied by a rock.
    rocks = allObstacles.filter(rocksOnly);
    var rock;
    for ( var i = 0; i < rocks.length; ++i ) {
      rock = rocks[i];

      if ( location.x === rock.location.x &&
           location.y === rock.location.y ) {
             return false;
           }
    }

    // Prevent player from moving into a location occupied by a
    // laser node.
    // lasers = allObstacles.filter(lasersOnly);
    // var laser;
    // for ( var i = 0; i < lasers.length; ++i ) {
    //   laser = lasers[i]
    //
    //
    // }

    return true;

    // Filter function to remove all non-rock obstacles from
    // allObstacles array.
    function rocksOnly(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.rock;
    }
    // Filter function to remove all non-laser obstacles from
    // allObstacles array.
    function lasersOnly(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.laser;
    }
  };
  BoardManager.prototype.renderBoard = function() {
    this._renderRows();
    this._renderObstacles();
  };
  BoardManager.prototype._renderRows = function() {
    // Get image urls for all of the board's rows
    var rowImageURLs = this._rowLayout();

    // Draw the rows
    for ( var row = 0; row < numRows; ++row ) {
      for ( var col = 0; col < numCols; ++col ) {
        ctx.drawImage(Resources.get(rowImageURLs[row]), col * CELL_WIDTH, row * CELL_HEIGHT);
      }
    }
  }
  BoardManager.prototype._renderObstacles = function() {
    // Get the board's obstacles
    var obstacles = this._obstacleLayout();
    var image, x, y;

    // Draw the obstacles to the canvas
    obstacles.forEach(function(obstacle) {
      obstacle.render();
    });
  }
  BoardManager.prototype._rowLayout = function() {
    var rowLayout;

    // Get the row layout for the current level
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
  BoardManager.prototype._obstacleLayout = function() {
    var obstacleLayout;

    // Get the obstacle layout for the current level
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
