/**
 * @fileOverview LevelManager class to provide level layout information.
 */
(function() {

/**
 * Provides layout information for all levels.
 */
var LevelManager = function() {

};
/**
 * @param {number} level - the level number
 * @returns {Object} the level layout for <tt>level</tt>
 */
LevelManager.prototype.levelMapForLevel = function(level) {
  var levelMap;

  switch ( level ) {

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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
    break;

    default:
    console.warn("WARNING: Level ( " + level + " ) is not a valid level.");

  }

  return levelMap;
};

// Make an instance of LevelManager available globally
window.LevelManager = new LevelManager();

}());
