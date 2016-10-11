/**
  * @fileOverview BoardManager and helper classes for managing the state of the board. Also an enemy generator class for creating randomly-generated enemies.
  */


 /**
  * @returns {number} a random integer in <tt>[left, right]</tt> assuming <tt>left <= right</tt>
  */
 function randomIntegerInRange(left, right) {
   var small, large;
   small = Math.min(left, right);
   large = Math.max(left, right);

   return Math.floor(Math.random() * ( large - small + 1)) + small;
 }


(function() {

  /*
   * EnemyGenerator: Generates the enemies for each level.
   */

  /**
   * Generates the enemies for each level.
   * @param {number} level - the current level to assign to this enemy generator
   *
   * @property {number} currentLevel - the level for which to generate enemies
   * @property {number} nextEnemyID - a ( unique ) identifier to assign to an enemy before adding it to the global <tt>allEnemies</tt> array
   * @property {number} generatorInterval - a number used to cancel the current enemy generation timer with the <tt>clearInterval</tt> method
   */
  var EnemyGenerator = function(level) {
    this.currentLevel = level;
    this.nextEnemyID = 0;
    this.generatorInterval = null;
  };
  /**
   * Generates enemies for the current level.
   */
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
  /**
   * Generates enemies for level 1.
   */
  EnemyGenerator.prototype._generateLevel1 = function() {
    // Set initial enemies for level
    var zombie1, zombie2;
    zombie1 = new Zombie(0, 1, 1);
    zombie2 = new Zombie(-1, 2, 2);
    zombie1.id = this.nextEnemyID++;
    zombie2.id = this.nextEnemyID++;
    allEnemies = [zombie1, zombie2];

    // Setup randomly-selected enemy properties
    var column, rows, speeds;
    column = -1;
    rows = [1, 2];
    speeds = [1, 2];

    var self = this;
    // Generate future enemies
    this.generatorInterval = setInterval(function() {
      var zombie = new Zombie(column, rows[randomIntegerInRange(0, 1)], speeds[randomIntegerInRange(0, 1)]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, 1800);
  };
  /**
   * Generates enemies for level 2.
   */
  EnemyGenerator.prototype._generateLevel2 = function() {
    // Same enemy generation as level 1
    this._generateLevel1();
  };
  /**
   * Generates enemies for level 3.
   */
  EnemyGenerator.prototype._generateLevel3 = function() {
    // Set initial enemies for level
    var zombie1, zombie2;
    zombie1 = new Zombie(0, 1, 1);
    zombie2 = new Zombie(-1, 2, 2);
    zombie1.id = this.nextEnemyID++;
    zombie2.id = this.nextEnemyID++;
    allEnemies = [zombie1, zombie2];

    // Setup randomly-selected enemy properties
    var column, rows, speeds;
    column = -1;
    rows = [1, 2];
    speeds = [1, 2];

    var self = this;
    // Generate future enemies
    this.generatorInterval = setInterval(function() {
      var zombie = new Zombie(column, rows[randomIntegerInRange(0, 1)], speeds[randomIntegerInRange(0, 1)]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, 250);
  };
  /**
   * Generates enemies for level 4.
   */
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

    // Setup randomly-selected enemy properties
    var columns, rows, speeds;
    rows    = [ 0,  0,  2,  2,  3,  3];
    columns = [-1, -1,  5,  5, -1, -1];
    speeds  = [ 2,  1, -2, -1,  2,  1];

    // Generate random zombies
    this.generatorInterval = setInterval(function() {
      var randomIndex, zombie;
      randIndex = randomIntegerInRange(0, 5);

      // Create random zombie
      zombie = new Zombie(columns[randIndex], rows[randIndex], speeds[randIndex]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, 500);
  };
  /**
   * Generates enemies for level 5.
   */
  EnemyGenerator.prototype._generateLevel5 = function() {
    var spider1, spider2;
    spider1 = new Spider(0, 2, 1, MOVEMENT_DIRECTION.vertical, [1, 4]);
    spider2 = new Spider(4, 3, -1, MOVEMENT_DIRECTION.vertical, [0, 3]);

    allEnemies.push(spider1);
    allEnemies.push(spider2);
  };
  /**
   * Generates enemies for level 6.
   */
  EnemyGenerator.prototype._generateLevel6 = function() {
    // Add spiders
    var spider = new Spider(2, 4, 1, MOVEMENT_DIRECTION.horizontal, [2, 4]);
    allEnemies.push(spider);

    // random speeds
    var speeds = [-1.0, -1.4];

    // Generate random enemies
    this.generatorInterval = setInterval(function() {
      var randIndex, zombie;
      randIndex = randomIntegerInRange(0, 1);
      zombie = new Zombie(6, 2, speeds[randIndex]);
      zombie.id = self.nextEnemyID++;
      allEnemies.push(zombie);
    }, 2500);
  };
  /**
   * Generates enemies for level 7.
   */
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

    // Setup randomly-selected enemy properties
    var rows, delays;
    cols   = [ 6, -1, -1,  6];
    rows   = [ 1,  2,  3,  4];
    speeds = [-1,  1,  1, -1];

    // Generate random enemies
    this.generatorInterval = setInterval(function() {
      var randIndex, ghost;
      randIndex = randomIntegerInRange(0, 3);
      ghost = new Ghost(cols[randIndex], rows[randIndex], speeds[randIndex]);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, 900);
  };
  /**
   * Generates enemies for level 8.
   */
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
  /**
   * Generates enemies for level 9.
   */
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

    // Setup randomly-selected enemy properties
    var col, rows, speeds;
    col = 7;
    rows = [1, 2, 3, 4];
    speeds = [-0.8, -1, -1.3];

    // Generate random ghosts
    this.generatorInterval = setInterval(function() {
      var ghost = new Ghost(col, rows[randomIntegerInRange(0, 3)], speeds[randomIntegerInRange(0, 2)]);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, 1400);
  };
  /**
   * Generates enemies for level 10.
   */
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

    // Setup randomly-selected enemy properties
    var speeds, rows;
    speeds = [1, 2];
    rows = [1, 2];

    // Generate random enemies
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
  /**
   * Generates enemies for level 11.
   */
  EnemyGenerator.prototype._generateLevel11 = function() {
    // Add spider
    var spider = new Spider(6, 0, 1.5, MOVEMENT_DIRECTION.horizontal, [4, 6]);
    spider.id = this.nextEnemyID++;
    allEnemies.push(spider);

    // Setup randomly-selected enemy properties
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
        // ghosts in these rows need to move in the opposite direction
        speed *= -1;
      }

      var ghost = new Ghost(col, row, speed);
      ghost.id = self.nextEnemyID++;
      allEnemies.push(ghost);
    }, 200);
  };
  /**
   * Generates enemies for level 12.
   */
  EnemyGenerator.prototype._generateLevel12 = function() {
    // Add spiders
    var self = this;
    var spider1, spider2, spider3, spider4;
    spider1 = new Spider(0, 2, 2, MOVEMENT_DIRECTION.horizontal, [0, 4]);
    spider2 = new Spider(3, 2, 1.5, MOVEMENT_DIRECTION.vertical, [2, 4]);
    spider3 = new Spider(4, 3, 2.0, MOVEMENT_DIRECTION.horizontal, [3, 4]);
    spider4 = new Spider(3, 4, 2.0, MOVEMENT_DIRECTION.horizontal, [3, 4]);
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
  /**
   * Generates enemies for level 13.
   */
  EnemyGenerator.prototype._generateLevel13 = function() {
    // Create spiders
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

    // Add spiders
    var self = this;
    [spider1, spider2, spider3, spider4, spider5, spider6, spider7, spider8, spider9, spider10].forEach(function(spider) {
      spider.id = self.nextEnemyID++;
      allEnemies.push(spider);
    });
  };
  /**
   * Generates enemies for level 14.
   */
  EnemyGenerator.prototype._generateLevel14 = function() {
    // noop
  };


  /**
   * Manages the state of the game board.
   * @constructor
   *
   * @property {number} currentLevel - the current level being played
   * @property {Object} currentLevelMap - contains level information for the current level (i.e. player start, obstacle, costume locations )
   * @property {EnemyGenerator} _enemyGenerator - the generator used to create enemies for each level
   * @property {boolean} _playerHasPickedUpDwarfCostume - true iff player has *ever* picked up a dwarf costume
   * @property {boolean} _playerHasPickedUpLaserManCostume - true iff player has *ever* picked up a LaserMan costume
   * @property {boolean} _playerHasPickedUpGhostCostume - true iff player has *ever* picked up a ghost costume
   */
  var BoardManager = function() {
    this.currentLevel = 1;
    this.currentLevelMap = this._levelMapForLevel(this.currentLevel);
    this._enemyGenerator = new EnemyGenerator(this.currentLevel);

    this._playerHasPickedUpDwarfCostume     = false;
    this._playerHasPickedUpLaserManCostume  = false;
    this._playerHasPickedUpGhostCostume     = false;
  };
  /**
   * Restarts the current level.
   */
  BoardManager.prototype.restartCurrentLevel = function() {
    this.beginCurrentLevel();
  };
  /**
   * Begins the current level
   */
  BoardManager.prototype.beginCurrentLevel = function() {
    // DEVELOPMENT CODE  ONLY
    // Used for quickly accessing specific levels
    //this.currentLevel = 14;
    // END DEVELOPMENT CODE ONLY

    // Update level map
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
  /**
   * Begins the next level.
   */
  BoardManager.prototype.beginNextLevel = function() {
    ++this.currentLevel;
    this.beginCurrentLevel();
  };
  /**
   * @param {Object} location - the proposed location for the player
   * @returns {boolean} true iff player is able to occupy the proposed location
   */
  BoardManager.prototype.playerCanOccupyLocation = function(location) {
    var allObstacles;

    // Get all obstacles for this level
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

    // Prevent player from moving into a location occupied by a
    // laser node.
    var lasers, laser;
    lasers = this.laserObstacles();
    for ( i = 0; i < lasers.length; ++i ) {
      laser = lasers[i];

      if ( location.x === laser.locationLeftLaserNode && location.y === laser.y ||
            location.x === laser.locationRightLaserNode && location.y === laser.y ) {
              return false;
      }
    }

    return true;
  };
  /**
   * Updates the board in response to player's new location.
   * @param {Object} location - the player's newly occupied location
   */
  BoardManager.prototype.updateBoardForNewPlayerLocation = function(location) {

    player.endLaserShieldAnimation();

    this._checkForCostumePickup(location);
    this._checkForObstacleCollision(location);
    this._checkForLevelCompletion();
  };
  /**
   * Checks if player has picked up a new costume at <tt>location</tt>
   * @param {Object} location - the player's newly occupied location
   */
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
  /**
   * Displays a popover with information about <tt>costume</tt> iff player has picked it up
   * for the first time.
   * @param {Costume} costume - the costume picked up by the player
   */
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
  /**
   * Checks if player has just run into an obstacle at the newly occupied <tt>location</tt>
   * @param {Object} location - the location the player has just occupied
   */
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
      if ( playerInvulnerableToLaser ) {
        // Start laser shield animation around player
        player.endLaserShieldAnimation();
        player.startLaserShieldAnimation();
      } else {
        // Player is vulnerable to laser and dies. Start level over.
        this.showPlayerCollisionAnimation();
        this.restartCurrentLevel();
      }
    }

    function handleWebCollision() {
      player.webStatus.caughtInWeb = true;
      player.webStatus.hasAttemptedToMove = false;
    }
  };
  /**
   * Performs a collision animation at the player's current location. Called after the player has
   * collided with a laser beam or an enemy.
   */
  BoardManager.prototype.showPlayerCollisionAnimation = function() {
    // NOTE
    // The web struggle animation is repurposed here for player collisions.
    var collisionAnimation = new Animation.webStruggle(player.location.x, player.location.y);
    AnimationQueue.addAnimation(collisionAnimation);
  };
  /**
   * Checks if player has completed the level.
   */
  BoardManager.prototype._checkForLevelCompletion = function() {
    // Check if player has completed the level
    var levelFinishLocation, playerCompletedLevel;
    levelFinishLocation = this.currentLevelMap.playerFinish;
    playerCompletedLevel = ( player.location.x === levelFinishLocation.x && player.location.y === levelFinishLocation.y );
    if ( playerCompletedLevel ) {
      var lastLevel = 14;

      if ( this.currentLevel < lastLevel ) {
        this.beginNextLevel();
      } else {
        // Player has beat the game! Remove the game board from the DOM and present
        // the final popover
        var canvas = document.getElementById("game-board");
        document.getElementById("container").removeChild(canvas);
        PopoverManager.presentGameFinishPopover();
      }
    }
  };
  /**
   * Updates the positions of the costumes not picked up by the player.
   */
  BoardManager.prototype.updateCostumes = function(dt) {
    this.currentLevelMap.costumeLayout.forEach(function(collectible) {
      collectible.update();
    });
  };
  /**
   * Checks for enemy collisions with obstacles or the player.
   */
  BoardManager.prototype.checkEnemyCollisions = function() {
    allEnemies.forEach(function(enemy) {
      enemy.checkCollisions();
    });
  };
  /**
   * @returns {Object} the current row and column dimensions of the board
   */
  BoardManager.prototype.boardDimensions = function() {
    return {
      numRows: this.currentLevelMap.numRows,
      numCols: this.currentLevelMap.numCols
    };
  };
  /**
   * Renders the board to the screen
   */
  BoardManager.prototype.renderBoard = function() {
    this._renderRows();
    this._renderFinish();
    this._renderObstacles();
    this._renderCostumes();
  };
  /**
   * Renders the game board's rows to the screen.
   */
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
  };
  /**
   * Renders the level finish marker to the screen.
   */
  BoardManager.prototype._renderFinish = function() {
    var row, col;
    row = this.currentLevelMap.playerFinish.y;
    col = this.currentLevelMap.playerFinish.x;

    ctx.drawImage(Resources.get('images/Selector.png'), col * CELL_WIDTH, row * CELL_HEIGHT - 40);
  };
  /**
   * Renders obstacles to the screen.
   */
  BoardManager.prototype._renderObstacles = function() {

    // Draw the obstacles to the canvas
    this.currentLevelMap.obstacleLayout.forEach(function(obstacle) {
      obstacle.render();
    });
  };
  /**
   * Renders costumes to the screen.
   */
  BoardManager.prototype._renderCostumes = function() {
    // Draw the costumes to the canvas
    this.currentLevelMap.costumeLayout.forEach(function(collectible) {
      collectible.render();
    });
  };
  /**
   * @returns {Array} an array of all the rock obstacles currently on the board
   */
  BoardManager.prototype._rockObstacles = function() {
    return this.currentLevelMap.obstacleLayout.filter(function(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.rock;
    });
  };
  /**
   * @returns {Array} an array of all the laser obstacles on the board
   */
  BoardManager.prototype.laserObstacles = function() {
    return this.currentLevelMap.obstacleLayout.filter(function(obstacle) {
      return obstacle.type === OBSTACLE_TYPE.laser;
    });
  };
  // Returns the object at location or undefined if no such object exists.
  /**
   * @param {Object} location - the location to check
   * @returns {boolean} true iff an obstacle exists at <tt>location</tt>
   */
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
  };
  /**
   * @param {number} levelNum - the level number
   * @returns {Object} the level map for the level given by <tt>levelNum</tt>
   */
  BoardManager.prototype._levelMapForLevel = function(levelNum) {
    return LevelManager.levelMapForLevel(levelNum);
  };

  // Make BoardManager available globally
  window.BoardManager = new BoardManager();

}());
