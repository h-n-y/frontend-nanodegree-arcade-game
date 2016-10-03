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
 *    - animations.js
 */
(function() {

  // Returns a random integer in [left, right] assuming left <= right
  function randomIntegerInRange(left, right) {
    var small, large;
    small = Math.min(left, right);
    large = Math.max(left, right);

    return Math.floor(Math.random() * ( large - small + 1)) + small;
  }

  var EnemyGenerator = function(level) {
    this.currentLevel = level;
    this.nextEnemyID = 0;
  };
  EnemyGenerator.prototype.generate = function() {
    switch ( this.currentLevel ) {
      case 1:
      this._generateLevel1();
      break;

      default:
      console.warn("WARNING: ( " + this.currentLevel + " ) is an invalid level.");
    }
  };
  EnemyGenerator.prototype._generateLevel1 = function() {
    // Set initial enemies for level
    var zombie1, zombie2;
    zombie1 = new Zombie(0, 1, 1);
    zombie2 = new Zombie(-1, 2, 2);
    zombie1.id = this.nextEnemyID++;
    zombie2.id = this.nextEnemyID++;
    allEnemies = [zombie1, zombie2];

    var column, rows, speeds, delays;
    column = -1;
    rows = [1, 2];
    speeds = [1, 2];
    delays = [1000, 1500, 2000];

    var self = this;
    // Generate future enemies 
    setInterval(function() {
      // Random integer in [0, 1]
      var zombie = new Zombie(column, rows[randomIntegerInRange(0, 1)], speeds[randomIntegerInRange(0, 1)]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, delays[randomIntegerInRange(0, 2)]);
  };

  /*
   *  BOARDMANAGER: Provides relevant information about the design layout
   *  of the current level during the render and update stages.
   *
   *  Properties:
   *    * currentLevel: the current level of the game
   *    * currentObstacleLayout: array with information about how obstacles are laid out
   *        on the game board
   *    * currentCostumeLayout: array with information about how costumes are laid
   *        out on the game board
   *    * _rowMap: provides row layout information for the
   *               levels
   *
   *  Methods:
   *    *  renderBoard: Renders the game board and all obstacles to the canvas
   *    *  playerCanOccupyLocation: Returns true iff player is allowed to move
   *    *     into the location given by the argument.
   *    *  updateCostumes: updates the vertical position of each collectible
   *    *  renderCostumes: renders the collectibles to the canvas
   *    *  updateBoardForNewPlayerLocation: conditionally updates the board after player
   *          has moved to a new location. Checks if the player has
   *            - picked up a Candy to complete the level,
   *            - picked up a costume, or
   *            - run into an obstacle
   *
   *    * _renderRows:         Helper method for renderBoard; renders the board's rows
   *    * _renderObstacles:    Helper method for renderBoard; renders the board's obstacles
   *    * _renderCostumes: Helper method for renderBoard; renders the board's collectibles
   *    * _rowLayout:          Returns the row layout for the current level
   *    * _initialObstacleLayout:     Returns the obstacle layout for the current level
   *    * _initialCostumeLayout: Returns the initial collectibles layout for the current level
   */
  var BoardManager = function() {
    this.currentLevel = 1;
    this.currentLevelMap = this._levelMapForLevel(this.currentLevel);
    this._enemyGenerator = new EnemyGenerator(this.currentLevel);
  };
  BoardManager.prototype.beginCurrentLevel = function() {
    // Update level map for the new level
    this.currentLevelMap = this._levelMapForLevel(this.currentLevel);
    // Begin generating enemies for this level.
    this._enemyGenerator.currentLevel = this.currentLevel;
    this._enemyGenerator.generate();
  };
  BoardManager.prototype.playerCanOccupyLocation = function(location) {
    var allObstacles, rocks, lasers;
    allObstacles = this.currentObstacleLayout;

    // Prevent player from moving into a location occupied by a rock.
    var rocks, rock;
    rocks = this._rockObstacles();
    for ( var i = 0; i < rocks.length; ++i ) {
      rock = rocks[i];

      // If player is trying to move into a location occupied by a rock:
      if ( location.x === rock.location.x &&
           location.y === rock.location.y ) {

             return player.canSmashRock(rock) ? true : false;
           }
    }

    // TODO: implement laser node testing
    // Prevent player from moving into a location occupied by a
    // laser node.
    var lasers, laser;
    lasers = this._laserObstacles();
    for ( var i = 0; i < lasers.length; ++i ) {
      laser = lasers[i];

      if ( location.x === laser.locationLeftLaserNode && location.y === laser.y ||
            location.x === laser.locationRightLaserNode && location.y === laser.y ) {
              return false;
            }
    }

    return true;
  };

  BoardManager.prototype.updateBoardForNewPlayerLocation = function(location) {

    player.endLaserShieldAnimation();

    // Check if player has picked up the Candy to complete the level
    // TODO

    // Check if player has picked up a new costume
    var costume;
    //for ( var i = 0; i < this.currentCostumeLayout.length; ++i ) {
    for ( var i = 0; i < this.currentLevelMap.costumeLayout.length; ++i ) {
      costume = this.currentCostumeLayout[i];

      // Check if player picked up this costume
      var playerPickedUpCostume = location.x === costume.location.x && location.y === costume.originalYLocation;
      if ( playerPickedUpCostume ) {
        // Remove costume from the board
        this.currentCostumeLayout.splice(i, 1);

        // Add costume to player
        player.costumes.push(costume);

        break;
      }
    }

    // Check if player has run into an obstacle
    var obstacle = this._obstacleAtLocation(location);
    if ( !obstacle ) return;


    switch ( obstacle.type ) {
      case OBSTACLE_TYPE.rock:
      handleRockCollision.call(this);
      break;

      case OBSTACLE_TYPE.laser:
      handleLaserCollision.call(this);
      break;

      case OBSTACLE_TYPE.web:
      handleWebCollision.call(this);
      break;

    }

    // The player has smashed the rock.
    // Remove the rock from the board and animate its destruction.
    function handleRockCollision() {
      // Rename for clarity
      var rock = obstacle;

      // Remove rock
      var rockIndex = this.currentObstacleLayout.findIndex(function(obstacle) {
        return obstacle.location.x === rock.location.x && obstacle.location.y === rock.location.y;
      });
      this.currentObstacleLayout.splice(rockIndex, 1);

      // Animate rock destruction
      var animation = new Animation.rockSmash(rock.color, location.x, location.y);
      AnimationQueue.addAnimation(animation);
    }

    // Player has run into a laser beam.
    // If player is wearing a LaserMan costume matching laser's color, player can
    // pass through. Otherwise, the player 'dies' and the level starts over.
    function handleLaserCollision() {
      // rename for clarity
      var laser = obstacle;

      var playerInvulnerableToLaser = ( player._isLaserMan() && player._laserManCostume().color ===  laser.beamColor.name );
      if ( playerInvulnerableToLaser/* && !player.laserShieldIsOn*/ ) {
        // Start laser shield animation around player
        player.endLaserShieldAnimation();
        player.startLaserShieldAnimation();
      }

      // Player is vulnerable to laser and dies. Start level over.
      // TODO
    }

    function handleWebCollision() {
      player.webStatus.caughtInWeb = true;
      player.webStatus.hasAttemptedToMove = false;
    }
  };
  BoardManager.prototype.updateCostumes = function(dt) {
    this.currentLevelMap.costumeLayout.forEach(function(collectible) {
      collectible.update();
    });
  };
  // Checks for enemy/obstacle and enemy/player collisions
  BoardManager.prototype.checkEnemyCollisions = function() {
    allEnemies.forEach(function(enemy) {
      enemy.checkCollisions();
    });
  };
  // Returns the current row and column dimensions of the board
  BoardManager.prototype.boardDimensions = function() {
    return {
      numRows: this.currentLevelMap.numRows,
      numCols: this.currentLevelMap.numCols
    }
  };
  BoardManager.prototype.renderBoard = function() {
    this._renderRows();
    this._renderObstacles();
    this._renderCostumes();
  };
  BoardManager.prototype._renderRows = function() {
    // Get image urls for all of the board's rows
    var rowImageURLs, boardDimensions;
    rowImageURLs = this.currentLevelMap.rowLayout;
    boardDimensions = this.boardDimensions();
    // Draw the rows
    for ( var row = 0; row < boardDimensions.numRows; ++row ) {
      for ( var col = 0; col < boardDimensions.numCols; ++col ) {
        ctx.drawImage(Resources.get(rowImageURLs[row]), col * CELL_WIDTH, row * CELL_HEIGHT);
      }
    }
  }
  BoardManager.prototype._renderObstacles = function() {

    // Draw the obstacles to the canvas
    this.currentLevelMap.obstacleLayout.forEach(function(obstacle) {
      obstacle.render();
    });
  }
  BoardManager.prototype._renderCostumes = function() {

    // Draw the collectibles to the canvas
    this.currentLevelMap.costumeLayout.forEach(function(collectible) {
      collectible.render();
    });
  };
  // Returns all of the rock obstacles currently on the board.
  BoardManager.prototype._rockObstacles = function() {
    return this.currentLevelMap.obstacleLayout.filter(function(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.rock;
    });
  };
  // Returns all of the laser obstacles currently on the board.
  BoardManager.prototype._laserObstacles = function() {
    return this.currentLevelMap.obstacleLayout.filter(function(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.laser;
    });
  };
  // Returns the object at location or undefined if no such object exists.
  BoardManager.prototype._obstacleAtLocation = function(location) {
    return this.currentLevelMap.obstacleLayout.find(function(obstacle) {
      if ( obstacle.type === OBSTACLE_TYPE.laser ) {
        // Check if location is occupied by a laser beam
        return (  location.x < obstacle.locationRightLaserNode &&
                  location.x > obstacle.locationLeftLaserNode &&
                  location.y === obstacle.y );
      }

      return obstacle.location.x === location.x && obstacle.location.y === location.y;
    });
  }
  BoardManager.prototype._levelMapForLevel = function(levelNum) {
    var levelMap;

    switch ( levelNum ) {
      case 1:
      levelMap = {
        numCols: 4,
        numRows: 4,
        playerStart: {
          x: 2,
          y: 3
        },
        playerFinish: {
          x: 0,
          y: 0
        },
        rowLayout: [
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png'
        ],
        obstacleLayout: [],
        costumeLayout: []
      }
      break;
    }

    return levelMap;
  };

  // Make BoardManager available globally
  window.BoardManager = new BoardManager();

}());
