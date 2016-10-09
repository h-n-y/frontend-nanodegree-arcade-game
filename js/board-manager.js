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

  /*
   * EnemyGenerator: Generates the enemies for each level.
   */
  var EnemyGenerator = function(level) {
    this.currentLevel = level;
    this.nextEnemyID = 0;
    this.generatorInterval = null;
  };
  EnemyGenerator.prototype.generate = function() {
    switch ( this.currentLevel ) {
      case 1:
      this._generateLevel1();
      break;

      case 2:
      this._generateLevel2();
      break;

      case 3:
      this._generateLevel3();
      break;

      case 4:
      this._generateLevel4();
      break;

      case 5:
      this._generateLevel5();
      break;

      case 6:
      this._generateLevel6();
      break;

      case 7:
      this._generateLevel7();
      break;

      case 8:
      this._generateLevel8();
      break;

      case 9:
      this._generateLevel9();
      break;

      case 10:
      this._generateLevel10();
      break;

      case 11:
      this._generateLevel11();
      break;

      case 12:
      this._generateLevel12();
      break;

      case 13:
      this._generateLevel13();
      break;

      case 14:
      this._generateLevel14();
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
    this.generatorInterval = setInterval(function() {
      var zombie = new Zombie(column, rows[randomIntegerInRange(0, 1)], speeds[randomIntegerInRange(0, 1)]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, delays[randomIntegerInRange(0, 2)]);
  };
  EnemyGenerator.prototype._generateLevel2 = function() {
    this._generateLevel1();
  };
  EnemyGenerator.prototype._generateLevel3 = function() {
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
    speeds = [4, 6];
    delays = [100, 250, 500];

    var self = this;
    // Generate future enemies
    this.generatorInterval = setInterval(function() {
      var zombie = new Zombie(column, rows[randomIntegerInRange(0, 1)], speeds[randomIntegerInRange(0, 1)]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, delays[randomIntegerInRange(0, 2)]);
  };
  EnemyGenerator.prototype._generateLevel4 = function() {
    // Create initial zombies
    var zombie1, zombie2, zombie3;
    zombie1 = new Zombie(1, 3, 1.5);
    zombie2 = new Zombie(2, 0, 2);
    zombie3 = new Zombie(4, 2, -2);
    // Add zombies to global allZombies array
    [zombie1, zombie2, zombie3].forEach(function(zombie) {
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    });

    var columns, rows, speeds, delays;
    rows    = [ 0,  0,  2,  2,  3,  3];
    columns = [-1, -1,  5,  5, -1, -1];
    speeds  = [ 2,  1, -2, -1,  2,  1];
    delays  = [ 100, 250, 500];

    this.generatorInterval = setInterval(function() {
      var randomIndex, zombie;
      randIndex = randomIntegerInRange(0, 5);
      zombie = new Zombie(columns[randIndex], rows[randIndex], speeds[randIndex]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, delays[randomIntegerInRange(0, 2)]);
  };
  EnemyGenerator.prototype._generateLevel5 = function() {
    var spider1, spider2;
    spider1 = new Spider(0, 2, 1, MOVEMENT_DIRECTION.vertical, [1, 4]);
    spider2 = new Spider(4, 3, -1, MOVEMENT_DIRECTION.vertical, [0, 3]);

    allEnemies.push(spider1);
    allEnemies.push(spider2);
  };
  EnemyGenerator.prototype._generateLevel6 = function() {
    // Add spiders
    var spider = new Spider(2, 4, 1, MOVEMENT_DIRECTION.horizontal, [2, 4]);
    allEnemies.push(spider);

    var speeds, delays;
    speeds = [-0.8, -1.0];
    delays = [2500, 2800];
    this.generatorInterval = setInterval(function() {
      var randIndex, zombie;
      randIndex = randomIntegerInRange(0, 1);
      zombie = new Zombie(6, 2, speeds[randIndex]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, delays[randomIntegerInRange(0, 1)]);
  };
  EnemyGenerator.prototype._generateLevel7 = function() {
    // Create initial ghosts
    var ghost1, ghost2, ghost3;
    ghost1 = new Ghost(1, 2, 1);
    ghost2 = new Ghost(2, 3, 1);
    ghost3 = new Ghost(0, 4, 1);
    var self = this;
    [ghost1, ghost2, ghost3].forEach(function(ghost) {
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    });

    var rows, delays;
    cols   = [ 6, -1, -1,  6];
    rows   = [ 1,  2,  3,  4];
    speeds = [-1,  1,  1, -1];
    delays = [1000, 1500];
    this.generatorInterval = setInterval(function() {
      var randIndex, ghost;
      randIndex = randomIntegerInRange(0, 3);
      ghost = new Ghost(cols[randIndex], rows[randIndex], speeds[randIndex]);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, delays[randomIntegerInRange(0, 1)]);
  };
  EnemyGenerator.prototype._generateLevel8 = function() {
    var spider1, spider2, spider3, spider4;
    spider1 = new Spider(0, 3, 1, MOVEMENT_DIRECTION.horizontal, [0, 1]);
    spider2 = new Spider(6, 3, 1, MOVEMENT_DIRECTION.horizontal, [5, 6]);
    spider3 = new Spider(0, 4, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 6]);
    spider4 = new Spider(2, 4, 2.5, MOVEMENT_DIRECTION.horizontal, [2, 4]);

    var self = this;
    [spider1, spider2, spider3, spider4].forEach(function(spider) {
      spider.id = self.nextEnemyID++;
      allEnemies.push(spider);
    });
  };
  EnemyGenerator.prototype._generateLevel9 = function() {
    var ghost1, ghost2, ghost3;
    ghost1 = new Ghost(3, 4, -1);
    ghost2 = new Ghost(5, 3, -1.5);
    ghost3 = new Ghost(6, 1, -0.5);

    var self = this;
    [ghost1, ghost2, ghost3].forEach(function(ghost) {
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    });

    var col, rows, speeds, delays;
    col = 7;
    rows = [1, 2, 3, 4];
    speeds = [-0.8, -1, -1.3];
    //delays = [500, 800, 1200];
    this.generatorInterval = setInterval(function() {
      var ghost = new Ghost(col, rows[randomIntegerInRange(0, 3)], speeds[randomIntegerInRange(0, 2)]);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, 1300);
  };
  EnemyGenerator.prototype._generateLevel10 = function() {
    // Spiders
    var self, spider1, spider2;
    self = this;
    spider1 = new Spider(1, 4, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 3]);
    spider2 = new Spider(3, 5, -1.5, MOVEMENT_DIRECTION.horizontal, [0, 3]);
    [spider1, spider2].forEach(function(spider) {
      spider.id = self.nextEnemyID++;
      allEnemies.push(spider);
    });

    // Generate random enemies
    var speeds, rows;
    speeds = [1, 2];
    rows = [1, 2];
    this.generatorInterval = setInterval(function() {
      var rand, enemy;
      rand = randomIntegerInRange(1, 10);
      if ( rand <= 6 ) {
        // Create ghost 60% of the time
        enemy = new Ghost(7, rows[randomIntegerInRange(0, 1)], -1 * speeds[randomIntegerInRange(0, 1)]);
      } else {
        // Create zombie 40% of the time
        enemy = new Zombie(-1, 3, speeds[randomIntegerInRange(0, 1)]);
      }
      enemy.id = self.nextEnemyID++;
      allEnemies.push(enemy);
    }, 750);
  };
  EnemyGenerator.prototype._generateLevel11 = function() {
    // Add spider
    var spider = new Spider(6, 0, 1.5, MOVEMENT_DIRECTION.horizontal, [4, 6]);
    spider.id = this.nextEnemyID++;
    allEnemies.push(spider);

    var rows, speeds, cols, self;
    rows = [2,  3, 4,  5,  6];
    cols = [7, -1, 7, -1, -1];
    speeds = [0.5, 1, 1.5];
    self = this;
    // Generate random ghosts
    this.generatorInterval = setInterval(function() {
      var rand, row, col, speed;
      rand = randomIntegerInRange(0, 4);
      row = rows[rand];
      col = cols[rand];
      speed = speeds[randomIntegerInRange(0, 2)];
      if ( row === 1 || row === 2 || row === 4 ) {
        speed *= -1;
      }

      var ghost = new Ghost(col, row, speed);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, 200);
  };
  EnemyGenerator.prototype._generateLevel12 = function() {
    // Add spiders
    var self = this;
    var spider1, spider2, spider3, spider4;
    spider1 = new Spider(0, 2, 2, MOVEMENT_DIRECTION.horizontal, [0, 4]);
    spider2 = new Spider(3, 2, 1.5, MOVEMENT_DIRECTION.vertical, [2, 4]);
    spider3 = new Spider(4, 3, 1.5, MOVEMENT_DIRECTION.horizontal, [3, 4]);
    spider4 = new Spider(3, 4, 1.5, MOVEMENT_DIRECTION.horizontal, [3, 4]);
    [spider1, spider2, spider3, spider4].forEach(function(spider) {
      spider.id = self.nextEnemyID++;
      allEnemies.push(spider);
    });

    // Randomly generate new enemies
    var enemy;
    this.generatorInterval = setInterval(function() {
      var rand = randomIntegerInRange(1, 10);
      if ( rand <= 8 ) {
        // Create ghosts 80% of the time
        var col = 6;
        enemy = new Ghost(-1, 6, randomIntegerInRange(0, 1) === 0 ? 1.5 : 2);
      } else {
        // Create zombies 20 % of the time
        var rows, cols, speeds;
        rows = [0, 0, 1, 1];
        cols = [7, 7, -1, -1];
        speeds = [-1.5, -1.0, 1.5, 1.0];
        rand = randomIntegerInRange(0, 3);
        enemy = new Zombie(cols[rand], rows[rand], speeds[rand]);
      }

      enemy.id = self.nextEnemyID++;
      allEnemies.push(enemy);
    }, 400);
  };
  EnemyGenerator.prototype._generateLevel13 = function() {
    // Add spiders
    var spider1, spider2, spider3, spider4, spider5, spider6, spider7, spider8, spider9, spider10;
    spider1 = new Spider(0, 1, 1.5, MOVEMENT_DIRECTION.vertical, [1, 3]);
    spider2 = new Spider(1, 2, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 1]);
    spider3 = new Spider(0, 3, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 1]);

    spider4 = new Spider(5, 1, 1.5, MOVEMENT_DIRECTION.horizontal, [5, 6]);
    spider5 = new Spider(6, 2, 1.5, MOVEMENT_DIRECTION.horizontal, [5, 6]);
    spider6 = new Spider(5, 3, 1.5, MOVEMENT_DIRECTION.horizontal, [5, 6]);

    spider7 = new Spider(0, 0, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 6]);

    spider8  = new Spider(2, 6, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 6]);
    spider9  = new Spider(5, 7, 1.5, MOVEMENT_DIRECTION.horizontal, [0, 6]);
    spider10 = new Spider(2, 6, 2.0, MOVEMENT_DIRECTION.horizontal, [2, 4]);

    var self = this;
    [spider1, spider2, spider3, spider4, spider5, spider6, spider7, spider8, spider9, spider10].forEach(function(spider) {
      spider.id = self.nextEnemyID++;
      allEnemies.push(spider);
    });
  };
  EnemyGenerator.prototype._generateLevel14 = function() {

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

    this._playerHasPickedUpDwarfCostume     = false;
    this._playerHasPickedUpLaserManCostume  = false;
    this._playerHasPickedUpGhostCostume     = false;
  };
  BoardManager.prototype.beginCurrentLevel = function() {
    // Update level map for the new level


    // DEVELOPMENT CODE  ONLY
    // Used for quickly accessing specific levels
    //this.currentLevel = 14;
    // END DEVELOPMENT CODE ONLY


    this.currentLevelMap = this._levelMapForLevel(this.currentLevel);

    // Update player location
    var playerStart = this.currentLevelMap.playerStart;
    player.location.x = playerStart.x;
    player.location.y = playerStart.y;
    // Remove player costumes
    player.costumes = [];

    // Begin generating enemies for this level.
    clearInterval(this._enemyGenerator.generatorInterval);
    allEnemies = [];
    this._enemyGenerator.currentLevel = this.currentLevel;
    this._enemyGenerator.generate();
  };
  BoardManager.prototype.beginNextLevel = function() {
    ++this.currentLevel;
    this.beginCurrentLevel();
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
    lasers = this.laserObstacles();
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

    this._checkForCostumePickup(location);
    this._checkForObstacleCollision(location);
    this._checkForLevelCompletion();
  };
  BoardManager.prototype._checkForCostumePickup = function(location) {
    // Check if player has picked up a new costume
    var costume;
    for ( var i = 0; i < this.currentLevelMap.costumeLayout.length; ++i ) {
      costume = this.currentLevelMap.costumeLayout[i];

      // Check if player picked up this costume
      var playerPickedUpCostume = location.x === costume.location.x && location.y === costume.originalYLocation;
      if ( playerPickedUpCostume ) {
        // Remove costume from the board
        this.currentLevelMap.costumeLayout.splice(i, 1);

        // Check if player is already wearing the same type of costume and remove it
        // before adding the new costume.
        if ( player._isDwarf() && costume.type === COSTUME_TYPE.dwarf ) {
          player.removeDwarfCostume();
        } else if ( player._isLaserMan() && costume.type === COSTUME_TYPE.laserman ) {
          player.removeLaserManCostume();
        }

        // Add costume to player
        player.costumes.push(costume);

        // Display costume popup if player has picked up this costume
        // for the first time
        this._conditionallyDisplayPopoverForCostume(costume);

        break;
      }
    }
  };
  BoardManager.prototype._conditionallyDisplayPopoverForCostume = function(costume) {
    switch ( costume.type ) {
      case COSTUME_TYPE.dwarf:
      if ( !this._playerHasPickedUpDwarfCostume ) {
        this._playerHasPickedUpDwarfCostume = true;
        PopoverManager.presentDwarfPopover();
      }
      break;

      case COSTUME_TYPE.laserman:
      if ( !this._playerHasPickedUpLaserManCostume ) {
        this._playerHasPickedUpLaserManCostume = true;
        PopoverManager.presentLaserManPopover();
      }
      break;

      case COSTUME_TYPE.ghost:
      if ( !this._playerHasPickedUpGhostCostume ) {
        this._playerHasPickedUpGhostCostume = true;
        PopoverManager.presentGhostPopover();
      }
      break;
    }
  };
  BoardManager.prototype._checkForObstacleCollision = function(location) {
    // Check if player has run into an obstacle
    var obstacle = this._obstacleAtLocation(location);
    if ( obstacle ) {
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
    }

    // The player has smashed the rock.
    // Remove the rock from the board and animate its destruction.
    function handleRockCollision() {
      // Rename for clarity
      var rock = obstacle;

      // Remove rock
      var rockIndex = this.currentLevelMap.obstacleLayout.findIndex(function(obstacle) {
        return obstacle.location.x === rock.location.x && obstacle.location.y === rock.location.y;
      });
      this.currentLevelMap.obstacleLayout.splice(rockIndex, 1);

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
  BoardManager.prototype._checkForLevelCompletion = function() {
    // Check if player has completed the level
    var levelFinishLocation, playerCompletedLevel;
    levelFinishLocation = this.currentLevelMap.playerFinish;
    playerCompletedLevel = ( player.location.x === levelFinishLocation.x && player.location.y === levelFinishLocation.y );
    if ( playerCompletedLevel ) {
      // TODO go to next level
      console.log("PLAYER COMPLETED LEVEL");
      this.beginNextLevel();
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
    this._renderFinish();
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
  BoardManager.prototype._renderFinish = function() {
    var row, col;
    row = this.currentLevelMap.playerFinish.y;
    col = this.currentLevelMap.playerFinish.x;

    ctx.drawImage(Resources.get('images/selector.png'), col * CELL_WIDTH, row * CELL_HEIGHT - 40);
  };
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
  BoardManager.prototype.laserObstacles = function() {
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

      // Simple level: zombies only
      case 1:
      levelMap = {
        numCols: 4,
        numRows: 4,
        playerStart: {
          x: 1,
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

      // Zombies bouncing off rocks
      case 2:
      levelMap = {
        numCols: 5,
        numRows: 5,
        playerStart: {
          x: 4,
          y: 2
        },
        playerFinish: {
          x: 4,
          y: 0
        },
        rowLayout: [
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png'
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 4, 1),
          new Obstacles.rock(COLOR.gray, 3, 2),
        ],
        costumeLayout: []
      }
      break;

      // Zombie Apocalypse
      // Introduction to the Dwarf Costume
      case 3:
      levelMap = {
        numCols: 5,
        numRows: 5,
        playerStart: {
          x: 1,
          y: 4
        },
        playerFinish: {
          x: 0,
          y: 0
        },
        rowLayout: [
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png'
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.red, 2, 0),
          new Obstacles.rock(COLOR.red, 3, 0),
          new Obstacles.rock(COLOR.red, 4, 0),
          new Obstacles.rock(COLOR.gray, 3, 1),
          new Obstacles.rock(COLOR.gray, 2, 2),
          new Obstacles.rock(COLOR.gray, 3, 4),
        ],
        costumeLayout: [
          new Costume.dwarf(COLOR.red, 4, 4)
        ]
      }
      break;

      // More rock smashing with the Dwarf
      case 4:
      levelMap = {
        numCols: 5,
        numRows: 5,
        playerStart: {
          x: 1,
          y: 4
        },
        playerFinish: {
          x: 4,
          y: 0
        },
        rowLayout: [
          'images/stone-block.png',
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png'
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.red, 4, 1),

          new Obstacles.rock(COLOR.gray, 3, 0),
          new Obstacles.rock(COLOR.gray, 2, 3),
          new Obstacles.rock(COLOR.gray, 2, 4),
          new Obstacles.rock(COLOR.gray, 4, 3),
        ],
        costumeLayout: [
          new Costume.dwarf(COLOR.red, 4, 4)
        ]
      }
      break;

      // Jack-o-Lanterns and Skulls
      case 5:
      levelMap = {
        numCols: 5,
        numRows: 7,
        playerStart: {
          x: 2,
          y: 6
        },
        playerFinish: {
          x: 2,
          y: 0
        },
        rowLayout: [
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/grass-block.png'
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 0, 5),
          new Obstacles.rock(COLOR.gray, 0, 6),
          new Obstacles.rock(COLOR.gray, 4, 5),
          new Obstacles.rock(COLOR.gray, 4, 6),

          new Obstacles.jackolantern(1, 5),
          new Obstacles.jackolantern(1, 3),
          new Obstacles.jackolantern(1, 1),
          new Obstacles.jackolantern(3, 5),
          new Obstacles.jackolantern(3, 3),
          new Obstacles.jackolantern(3, 1),

          new Obstacles.skull(1, 4),
          new Obstacles.skull(1, 2),
          new Obstacles.skull(1, 0),
          new Obstacles.skull(3, 4),
          new Obstacles.skull(3, 2),
          new Obstacles.skull(3, 0),

          new Obstacles.web(0, 0),
          new Obstacles.web(0, 1),
          new Obstacles.web(0, 2),
          new Obstacles.web(0, 3),
          new Obstacles.web(0, 4),
          new Obstacles.web(4, 0),
          new Obstacles.web(4, 1),
          new Obstacles.web(4, 2),
          new Obstacles.web(4, 3),
          new Obstacles.web(4, 4),
        ],
        costumeLayout: []
      }
      break;

      // Hello Spiders
      case 6:
      levelMap = {
        numCols: 6,
        numRows: 6,
        playerStart: {
          x: 0,
          y: 5
        },
        playerFinish: {
          x: 5,
          y: 0
        },
        rowLayout: [
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png'
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 0, 1),
          new Obstacles.rock(COLOR.gray, 1, 4),

          new Obstacles.rock(COLOR.red, 0, 4),
          new Obstacles.rock(COLOR.red, 5, 4),
          new Obstacles.rock(COLOR. red, 4, 5),

          new Obstacles.rock(COLOR.yellow, 1, 1),

          new Obstacles.laser(COLOR.red, 1, 3, 3),
          new Obstacles.laser(COLOR.red, 2, 5, 1),

          new Obstacles.web(2, 4),
          new Obstacles.web(3, 4),
          new Obstacles.web(4, 4),
        ],
        costumeLayout: [
          new Costume.dwarf(COLOR.red, 0, 3),
          new Costume.dwarf(COLOR.yellow, 5, 5),
        ]
      }
      break;

      // Ghosts
      case 7:
      levelMap = {
        numCols: 6,
        numRows: 6,
        playerStart: {
          x: 4,
          y: 5
        },
        playerFinish: {
          x: 0,
          y: 0
        },
        rowLayout: [
          'images/stone-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/stone-block.png',
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 0, 1),
          new Obstacles.rock(COLOR.gray, 1, 4),

          new Obstacles.rock(COLOR.gray, 0, 1),
          new Obstacles.rock(COLOR.gray, 2, 2),
          new Obstacles.rock(COLOR.gray, 3, 2),
          new Obstacles.rock(COLOR.gray, 5, 3),

          new Obstacles.skull(3, 0),
          new Obstacles.skull(1, 3),
          new Obstacles.skull(4, 4),

          new Obstacles.jackolantern(1, 1),
          new Obstacles.jackolantern(3, 4),
        ],
        costumeLayout: []
      }
      break;

      // Intro to LaserMan
      case 8:
      levelMap = {
        numCols: 7,
        numRows: 6,
        playerStart: {
          x: 3,
          y: 5
        },
        playerFinish: {
          x: 3,
          y: 0
        },
        rowLayout: [
          'images/water-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/grass-block.png',
        ],
        obstacleLayout: [

          new Obstacles.laser(COLOR.blue, 2, 4, 3),
          new Obstacles.laser(COLOR.blue, 1, 5, 2),
          new Obstacles.laser(COLOR.blue, 0, 6, 1),

          new Obstacles.web(0, 2),
          new Obstacles.web(6, 2),
          new Obstacles.web(0, 3),
          new Obstacles.web(1, 3),
          new Obstacles.web(5, 3),
          new Obstacles.web(6, 3),

          new Obstacles.web(0, 4),
          new Obstacles.web(1, 4),
          new Obstacles.web(2, 4),
          new Obstacles.web(3, 4),
          new Obstacles.web(4, 4),
          new Obstacles.web(5, 4),
          new Obstacles.web(6, 4),

        ],
        costumeLayout: [
          new Costume.laserman(COLOR.blue, 0, 2),
          new Costume.laserman(COLOR.blue, 6, 2),
        ]
      }
      break;

      // Lasers
      case 9:
      levelMap = {
        numCols: 7,
        numRows: 6,
        playerStart: {
          x: 1,
          y: 5
        },
        playerFinish: {
          x: 6,
          y: 0
        },
        rowLayout: [
          'images/water-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/grass-block.png',
        ],
        obstacleLayout: [

          new Obstacles.laser(COLOR.yellow, 0, 2, 4),
          new Obstacles.laser(COLOR.blue, 0, 2, 2),
          new Obstacles.laser(COLOR.yellow, 0, 5, 0),
          new Obstacles.laser(COLOR.yellow, 2, 4, 1),
          new Obstacles.laser(COLOR.blue, 2, 4, 3),
          new Obstacles.laser(COLOR.red, 4, 6, 4),
          new Obstacles.laser(COLOR.red, 4, 6, 3),
          new Obstacles.laser(COLOR.red, 4, 6, 2),

          new Obstacles.jackolantern(2, 5),

          new Obstacles.web(1, 3),
          new Obstacles.web(1, 1),
          new Obstacles.web(3, 4),
          new Obstacles.web(5, 1),
          new Obstacles.web(6, 1),
        ],
        costumeLayout: [
          new Costume.laserman(COLOR.yellow, 0, 5),
          new Costume.laserman(COLOR.blue, 0, 3),
          new Costume.laserman(COLOR.yellow, 0, 1),
          new Costume.laserman(COLOR.blue, 3, 2),
          new Costume.laserman(COLOR.red, 6, 5),
        ]
      }
      break;

      // LaserMan, Dwarf, Zombies, Spiders, Ghosts
      case 10:
      levelMap = {
        numCols: 7,
        numRows: 7,
        playerStart: {
          x: 0,
          y: 6
        },
        playerFinish: {
          x: 0,
          y: 0
        },
        rowLayout: [
          'images/grass-block.png',
          'images/stone-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/grass-block.png',
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 2, 0),
          new Obstacles.rock(COLOR.gray, 5, 2),
          new Obstacles.rock(COLOR.gray, 4, 6),
          new Obstacles.rock(COLOR.gray, 6, 6),

          new Obstacles.rock(COLOR.blue, 0, 1),
          new Obstacles.rock(COLOR.blue, 1, 0),

          new Obstacles.laser(COLOR.yellow, 4, 6, 5),

          new Obstacles.jackolantern(0, 2),
          new Obstacles.jackolantern(2, 2),
          new Obstacles.skull(1, 2),

          new Obstacles.web(0, 4),
          new Obstacles.web(1, 4),
          new Obstacles.web(2, 4),
          new Obstacles.web(3, 4),
          new Obstacles.web(0, 5),
          new Obstacles.web(1, 5),
          new Obstacles.web(2, 5),
          new Obstacles.web(3, 5),
        ],
        costumeLayout: [
          new Costume.laserman(COLOR.yellow, 1, 1),
          new Costume.dwarf(COLOR.blue, 5, 6),
        ]
      }
      break;

      // Intro: Ghost Costume
      case 11:
      levelMap = {
        numCols: 7,
        numRows: 7,
        playerStart: {
          x: 0,
          y: 0
        },
        playerFinish: {
          x: 5,
          y: 6
        },
        rowLayout: [
          'images/stone-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
          'images/grass-block.png',
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 2, 1),
          new Obstacles.rock(COLOR.gray, 3, 3),
          new Obstacles.rock(COLOR.gray, 1, 6),
          new Obstacles.rock(COLOR.gray, 5, 4),
          new Obstacles.rock(COLOR.gray, 4, 6),

          new Obstacles.skull(4, 1),
          new Obstacles.skull(6, 1),
          new Obstacles.skull(4, 2),
          new Obstacles.skull(5, 2),
          new Obstacles.skull(6, 2),

          new Obstacles.jackolantern(0, 2),
          new Obstacles.jackolantern(2, 4),
          new Obstacles.jackolantern(5, 5),

          new Obstacles.web(4, 0),
          new Obstacles.web(5, 0),
          new Obstacles.web(6, 0),
        ],
        costumeLayout: [
          new Costume.ghost(5, 1)
        ]
      }
      break;

      // All costumes
      case 12:
      levelMap = {
        numCols: 7,
        numRows: 7,
        playerStart: {
          x: 6,
          y: 5
        },
        playerFinish: {
          x: 6,
          y: 3
        },
        rowLayout: [
          'images/grass-block.png',
          'images/grass-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/grass-block.png',
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.gray, 5, 2),
          new Obstacles.rock(COLOR.gray, 6, 2),
          new Obstacles.rock(COLOR.gray, 5, 3),

          new Obstacles.rock(COLOR.blue, 2, 4),
          new Obstacles.rock(COLOR.blue, 6, 3),


          new Obstacles.jackolantern(0, 3),
          new Obstacles.jackolantern(0, 5),
          new Obstacles.jackolantern(2, 3),
          new Obstacles.jackolantern(2, 5),

          new Obstacles.skull(1, 3),
          new Obstacles.skull(1, 5),
          new Obstacles.skull(0, 4),

          new Obstacles.laser(COLOR.red, 5, 7, 4),

          new Obstacles.web(0, 2),
          new Obstacles.web(1, 2),
          new Obstacles.web(2, 2),
          new Obstacles.web(3, 2),
          new Obstacles.web(4, 2),
          new Obstacles.web(3, 3),
          new Obstacles.web(4, 3),
          new Obstacles.web(3, 4),
          new Obstacles.web(4, 4),
        ],
        costumeLayout: [
          //new Costume.ghost(5, 1)

          new Costume.laserman(COLOR.red, 0, 6),
          new Costume.ghost(1, 4),
          new Costume.dwarf(COLOR.blue, 1, 0),
        ]
      }
      break;

      // Arachnophobia ??
      case 13:
      levelMap = {
        numCols: 7,
        numRows: 8,
        playerStart: {
          x: 3,
          y: 4
        },
        playerFinish: {
          x: 3,
          y: 2
        },
        rowLayout: [
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/water-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
          'images/stone-block.png',
        ],
        obstacleLayout: [

          new Obstacles.web(0, 0),
          new Obstacles.web(1, 0),
          new Obstacles.web(2, 0),
          new Obstacles.web(3, 0),
          new Obstacles.web(4, 0),
          new Obstacles.web(5, 0),
          new Obstacles.web(6, 0),

          new Obstacles.web(0, 1),
          new Obstacles.web(1, 1),
          new Obstacles.web(5, 1),
          new Obstacles.web(6, 1),

          new Obstacles.web(0, 2),
          new Obstacles.web(1, 2),
          new Obstacles.web(5, 2),
          new Obstacles.web(6, 2),

          new Obstacles.web(0, 3),
          new Obstacles.web(1, 3),
          new Obstacles.web(5, 3),
          new Obstacles.web(6, 3),

          new Obstacles.web(0, 5),
          new Obstacles.web(1, 5),

          new Obstacles.web(0, 6),
          new Obstacles.web(1, 6),
          new Obstacles.web(2, 6),
          new Obstacles.web(3, 6),
          new Obstacles.web(4, 6),
          new Obstacles.web(5, 6),
          new Obstacles.web(6, 6),

          new Obstacles.web(0, 7),
          new Obstacles.web(1, 7),
          new Obstacles.web(2, 7),
          new Obstacles.web(3, 7),
          new Obstacles.web(4, 7),
          new Obstacles.web(5, 7),
          new Obstacles.web(6, 7),

          new Obstacles.laser(COLOR.red, 2, 4, 3),
          new Obstacles.laser(COLOR.red, 2, 4, 5),

          new Obstacles.rock(COLOR.gray, 2, 4),
          new Obstacles.rock(COLOR.gray, 5, 5),
          new Obstacles.rock(COLOR.gray, 6, 5),

          new Obstacles.jackolantern(2, 1),
          new Obstacles.jackolantern(4, 1),

          new Obstacles.skull(2, 2),
          new Obstacles.skull(3, 1),
          new Obstacles.skull(4, 2),
        ],
        costumeLayout: [
          new Costume.laserman(COLOR.red, 3, 6)
        ]
      }
      break;

      // Candy: Final Level
      case 14:
      levelMap = {
        numCols: 7,
        numRows: 7,
        playerStart: {
          x: 5,
          y: 6
        },
        playerFinish: {
          x: 2,
          y: 4
        },
        rowLayout: [
          'images/water-block.png',
          'images/water-block.png',
          'images/water-block.png',
          'images/water-block.png',
          'images/water-block.png',
          'images/water-block.png',
          'images/water-block.png',
        ],
        obstacleLayout: [

          new Obstacles.rock(COLOR.blue, 6, 5),
          new Obstacles.rock(COLOR.blue, 6, 4),
          new Obstacles.rock(COLOR.blue, 6, 3),
          new Obstacles.rock(COLOR.blue, 6, 2),
          new Obstacles.rock(COLOR.blue, 6, 1),

          new Obstacles.rock(COLOR.yellow, 1, 0),
          new Obstacles.rock(COLOR.yellow, 2, 0),
          new Obstacles.rock(COLOR.yellow, 3, 0),
          new Obstacles.rock(COLOR.yellow, 4, 0),
          new Obstacles.rock(COLOR.yellow, 5, 0),

          new Obstacles.rock(COLOR.red, 0, 1),
          new Obstacles.rock(COLOR.red, 0, 2),
          new Obstacles.rock(COLOR.red, 0, 3),
          new Obstacles.rock(COLOR.red, 0, 4),
          new Obstacles.rock(COLOR.red, 0, 5),
          new Obstacles.rock(COLOR.red, 4, 6),

          new Obstacles.laser(COLOR.red, 3, 5, 3),
          new Obstacles.laser(COLOR.red, 3, 5, 4),
          new Obstacles.laser(COLOR.red, 3, 5, 5),
          new Obstacles.laser(COLOR.red, 1, 3, 3),

          new Obstacles.jackolantern(5, 1),
          new Obstacles.jackolantern(3, 1),
          new Obstacles.jackolantern(1, 1),
          //new Obstacles.jackolantern(1, 3),
          new Obstacles.jackolantern(1, 5),

          new Obstacles.skull(2, 1),
          new Obstacles.skull(4, 1),
          new Obstacles.skull(1, 2),
          new Obstacles.skull(1, 4),
          new Obstacles.skull(2, 5),
          new Obstacles.skull(5, 2),

          new Candy(2, 4),
        ],
        costumeLayout: [

          new Costume.dwarf(COLOR.blue, 6, 6),
          new Costume.dwarf(COLOR.yellow, 6, 0),
          new Costume.dwarf(COLOR.red, 0, 0),

          new Costume.laserman(COLOR.red, 0, 6)
        ]
      }
      break;

      default:
      console.warn("WARNING: Level ( " + levelNum + " ) is not a valid level.");

    }

    return levelMap;
  };

  // Make BoardManager available globally
  window.BoardManager = new BoardManager();

}());
