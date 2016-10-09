/**
 * @fileOverview Classes for performing and managing animations
 */

(function() {

  /**
   * Manages all the currently active animations.
   * @constructor
   *
   * @property {Array} animations - contains all the currently active animations
   * @property {number} currentAnimationID - a ( unique ) id to assign to the next animation added to the <tt>animations</tt> array
   */
  var AnimationQueue = function() {
    this.animations = [];
    this.currentAnimationID = 0;
  };
  /**
   * Adds <tt>animation</tt> to the array of currently active animations.
   * @param {Animation} animation - the animation to add to the animation queue
   */
  AnimationQueue.prototype.addAnimation = function(animation) {
    // Assign a unique id to this animation
    animation.id = this.currentAnimationID++;
    animation.animationQueue = this;

    // Add animation to array
    this.animations.push(animation);
  };
  /**
   * Updates all currently active animations.
   * @param {number} dt - a time delta used to incrementally update animations
   */
  AnimationQueue.prototype.update = function(dt) {
    this.animations.forEach(function(animation) {
      animation.update(dt);
    });
  };
  /**
   * Renders all active animations to the screen.
   */
  AnimationQueue.prototype.render = function() {
    this.animations.forEach(function(animation) {
      animation.render();
    });
  };


  /**
   * Base class for animations.
   * @constructor
   * @param {number} x - horizontal location of this animation on the game board
   * @param {number} y - vertical location of this animation on the game board
   *
   * @property {number} id - a ( unique ) identifier for this animation. Used by the <tt>AnimationQueue</tt> to remove this animation upon completion.
   * @property {AnimationQueue} animationQueue - the animation queue this animation is contained in
   * @property {boolean} complete - a flag that marks whether or not this animation has completed
   * @property {Object} animationOrigin - the origin of this animation on the game board
   */
  var Animation = function(x, y) {
    Entity.call(this, null, x, y);
    this.id = null;
    this.animationQueue = null;
    this.complete = false;
    this.animationOrigin = {
      x: ( this.location.x + 0.5 ) * CELL_WIDTH,
      y: ( this.location.y + 0.5 ) * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST + 70
    };
  };
  Animation.prototype = Object.create(Entity.prototype);
  Animation.prototype.constructor = Animation;
  /**
   * Checks this animation has completed, and removes it from the animation queue if it has.
   */
  Animation.prototype._checkForCompletion = function() {
    // If animation has complete, remove it from the animation queue
    if ( this.complete ) {
      var id = this.id;
      var animationIndex = this.animationQueue.animations.findIndex(function(animation) {
        return animation.id === id;
      });
      this.animationQueue.animations.splice(animationIndex, 1);
    }
  };


  /**
   * Animation showing rocks being smashed.
   * @constructor
   * @extends Animation
   * @param {string} color - the color of the rock smashed
   * @param {number} x - the horizontal position of this animation on the game board
   * @param {number} y - the vertical position of this animation on the game board
   *
   * @property {Object} color - provides fill and stroke colors for this animation
   * @property {Object} particles - the particles to animate
   */
  var RockSmash = function(color, x, y) {
    Animation.call(this, x, y);
    this.color = {
      name: color,
      stroke: "",
      fill: ""
    };
    this._setColor(color);
    this.particles = [
      {
        location: {
          x: this.animationOrigin.x,
          y: this.animationOrigin.y,
        },
        width: 50,
        alpha: 1.0,
        rotation: 0,
        speed: 2,
        update: function(dt) {
          var ds = this.speed * dt;

          // update this particles properties
          this.location.x += -50 * ds;
          this.location.y +=  50 * ds;
          this.alpha = Math.max(0, this.alpha - 4 * dt);
          this.rotation += 2 * Math.PI * dt;
        }
      }, {
        location: {
          x: this.animationOrigin.x,
          y: this.animationOrigin.y
        },
        width: 80,
        alpha: 1.0,
        rotation: 0,
        speed: 2,
        update: function(dt) {
          var ds = this.speed * dt;

          // update this particles properties
          this.location.x += 50 * ds;
          this.location.y += 20 * ds;
          this.alpha = Math.max(0, this.alpha - 3 * dt);
          this.rotation += Math.PI * dt;
        }
      }, {
        location: {
          x: this.animationOrigin.x,
          y: this.animationOrigin.y
        },
        width: 60,
        alpha: 1.0,
        rotation: 0,
        speed: 10,
        update: function(dt) {
          var ds = this.speed * dt;

          // update this particles properties
          this.location.x -= 5 * ds;
          this.location.y -= 20 * ds;
          this.alpha = Math.max(0, this.alpha - 2 * dt);
          this.rotation += 3 * Math.PI * dt;
        }
      }
    ];
  };
  RockSmash.prototype = Object.create(Animation.prototype);
  RockSmash.prototype.constructor = RockSmash;
  /** Sets this animation's color property. */
  RockSmash.prototype._setColor = function(color) {
    switch ( color ) {
      case COLOR.red:
      this.color.stroke = "rgba(241, 70, 70, %alpha%)";
      this.color.fill = "rgba(89, 7, 7, %alpha%)";
      break;

      case COLOR.yellow:
      this.color.stroke = "rgba(244, 227, 106, %alpha%)";
      this.color.fill = "rgba(183, 161, 14, %alpha%)";
      break;

      case COLOR.blue:
      this.color.fill = "rgba(6, 53, 83, %alpha%)";
      this.color.stroke = "rgba(26, 156, 237, %alpha%)";
      break;

      default:
      console.warn("WARNING: " + color + " is not a valid color.");
      this.color.fill = "black";
      this.color.stroke = "white";
    }
  };
  /**
   * Updates all the particles in this animation.
   * @param {number} dt - time delta for updates
   */
  RockSmash.prototype.update = function(dt) {
    this.complete = false;
    var self = this;

    // Update every particle
    this.particles.forEach(function(particle) {
      particle.update(dt);

      // Mark this animation complete if any of the particles is invisible
      if ( particle.alpha === 0 ) {
        self.complete = true;
      }
    });
  };
  /**
   * Renders this animation to the screen.
   */
  RockSmash.prototype.render = function() {
    // Save and set context
    ctx.save();
    ctx.lineWidth = 20;

    var self = this;

    // Render each particle individually
    this.particles.forEach(function(particle) {
      ctx.save();

      // Set style
      ctx.fillStyle = self.color.fill.replace("%alpha%", particle.alpha);
      ctx.strokeStyle = self.color.stroke.replace("%alpha%", particle.alpha);

      // Set transform
      ctx.translate(particle.location.x, particle.location.y);
      ctx.rotate(particle.rotation);

      // Draw particle
      var halfWidth = particle.width / 2;
      ctx.fillRect(-halfWidth, -halfWidth, particle.width, particle.width);
      ctx.strokeRect(-halfWidth, -halfWidth, particle.width, particle.width);

      ctx.restore();
    });
    ctx.restore();

    this._checkForCompletion();
  };


  /**
   * Laser shield animation for player walking through a laser with the LaserMan costume.
   * @constructor
   * @extends Animation
   * @param {string} color - the primary color for this animation
   * @param {number} x - the horizontal location of this animation on the game board
   * @param {number} y - the vertical location of this animation on the game board
   *
   * @property {Object} color - provides the colors used in this animation
   * @property {Object} particles - the particles to be animated
   */
  var LaserShield = function(color, x, y) {
    Animation.call(this, x, y);
    this._setColor(color);
    this.particles = {
      backgroundCircle: {
        radius: 70,
        alpha: 0.8,
        color: this.color.dark,
        update: function(dt) {
          // noop
        }
      },
      expandingCircle: {
        radius: 0, // 0 --> large
        lineWidth: 20, // large --> 0
        alpha: 1,
        speed: 100,
        color: this.color.light,
        update: function(dt) {
          var ds = this.speed * dt;
          this.radius = Math.min(100, this.radius + ds);
          this.lineWidth = Math.max(0, this.lineWidth - 0.5 * ds);

          // Start animation over
          if ( this.radius === 100 || this.lineWidth === 0 ) {
            this.radius = 0;
            this.lineWidth = 20;
          }
        }
      },
      orbitingParticle: {
        radius: 45,
        width: 8,
        color: "white",
        rotation: 0,
        speed: 2,
        update: function(dt) {
          var ds = this.speed * dt;
          this.rotation += 2 * Math.PI * ds;
        }
      }
    }
  };
  LaserShield.prototype = Object.create(Animation.prototype);
  LaserShield.prototype.constructor = LaserShield;
  /**
   * Updates all the animation's particles.
   * @param {number} dt - a time delta for updating the animation
   */
  LaserShield.prototype.update = function(dt) {
    this.particles.backgroundCircle.update(dt);
    this.particles.expandingCircle.update(dt);
    this.particles.orbitingParticle.update(dt);
  };
  /**
   * Renders the animation to the screen.
   */
  LaserShield.prototype.render = function() {
    ctx.save();

    // Render background circle
    var circle, color, alpha, radius;
    circle = this.particles.backgroundCircle;
    radius = circle.radius;
    alpha = circle.alpha;
    color = circle.color.replace("%alpha%", alpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.animationOrigin.x, this.animationOrigin.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Render expanding circle
    circle = this.particles.expandingCircle;
    radius = circle.radius;
    alpha = circle.alpha;
    color = circle.color.replace("%alpha%", alpha);
    lineWidth = circle.lineWidth;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(this.animationOrigin.x, this.animationOrigin.y, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Render orbiting particle
    var orbitingParticle = this.particles.orbitingParticle;
    radius = orbitingParticle.radius;
    ctx.lineWidth = 4;
    ctx.fillStyle = orbitingParticle.color;
    ctx.translate(this.animationOrigin.x, this.animationOrigin.y);
    ctx.rotate(orbitingParticle.rotation);
    ctx.fillRect(-orbitingParticle.width/2, -orbitingParticle.width/2 - radius, orbitingParticle.width, orbitingParticle.width);

    ctx.restore();

    this._checkForCompletion();
  };
  /**
   * Sets this animation's <tt>color</tt> property.
   * @param {string} color - the name of the color to set
   */
  LaserShield.prototype._setColor = function(color) {
    this.color = {
      name: color,
      light: "",
      dark: ""
    };

    switch ( color ) {
      case COLOR.red:
      this.color.light = "rgba(241, 70, 70, %alpha%)";
      this.color.dark = "rgba(89, 7, 7, %alpha%)";
      break;

      case COLOR.yellow:
      this.color.dark = "rgba(244, 227, 106, %alpha%)";
      this.color.light = "rgba(183, 161, 14, %alpha%)";
      break;

      case COLOR.blue:
      this.color.light = "rgba(26, 156, 237, %alpha%)";
      this.color.dark = "rgba(6, 53, 83, %alpha%)";
      break;

      default:
      console.warn("WARNING: " + color + " is not a valid color");
    }
  };


  /**
   * Animation showing the player struggling to move through a spider web.
   * @constructor
   * @extends Animation
   * @param {number} x - the horizontal position of this animation on the game board
   * @param {number} y - the vertical position of this animation on the game board
   *
   * @property {Object} particles - this particles to animate
   */
  var WebStruggle = function(x, y) {
    Animation.call(this, x, y);
    this.particles = {
      diamond1: {
        width: 80,
        lineWidth: 20,  // large --> 0
        alpha: 0, // 0 --> 1
        speed: 150,
        complete: false,
        update: function(dt) {
          var ds = this.speed * dt;
          this.lineWidth = Math.max(0, this.lineWidth - ds);
          this.alpha = Math.min(1, this.alpha + ds);

          // End animation
          if ( this.lineWidth === 0 && this.alpha === 1 ) {
            this.complete = true;
          }
        }
      },
      diamond2: {
        width: 50,
        lineWidth: 20,
        speed: 100,
        complete: false,
        update: function(dt) {
          var ds = this.speed * dt;
          this.width = Math.min(50, this.width + 2 * ds);
          this.lineWidth = Math.max(0, this.lineWidth - ds);

          // Mark animation complete
          if ( this.lineWidth === 0 && this.width === 50 ) {
            this.complete = true;
          }
        }
      }
    }
  };
  WebStruggle.prototype = Object.create(Animation.prototype);
  WebStruggle.prototype.constructor = WebStruggle;
  /**
   * Updates this animation's particles.
   * @param {number} dt - a time delta for updating this animation
   */
  WebStruggle.prototype.update = function(dt) {
    var diamond1, diamond2;
    diamond1 = this.particles.diamond1;
    diamond2 = this.particles.diamond2;
    diamond1.update(dt);
    diamond2.update(dt);

    if ( diamond1.complete && diamond2.complete ) {
      this.complete = true;
    }
  };
  /**
   * Renders this animation to the screen.
   */
  WebStruggle.prototype.render = function() {
    ctx.save();

    // Set up context
    ctx.strokeStyle = "white";
    ctx.translate(this.animationOrigin.x, this.animationOrigin.y);
    ctx.rotate(Math.PI / 4);

    // Get particles
    var diamond1, diamond2;
    diamond1 = this.particles.diamond1;
    diamond2 = this.particles.diamond2;

    // Render particles
    ctx.lineWidth = diamond1.lineWidth;
    ctx.strokeRect(-diamond1.width/2, -diamond1.width/2, diamond1.width, diamond1.width);
    ctx.strokeStyle = "rgb(241, 70, 70)";
    ctx.lineWidth = diamond2.lineWidth;
    ctx.strokeRect(-diamond2.width/2, -diamond2.width/2, diamond2.width, diamond2.width);

    ctx.restore();
    this._checkForCompletion();
  };


  // Make AnimationQueue and animations available globally
  window.AnimationQueue = new AnimationQueue();
  window.Animation = {
    rockSmash: RockSmash,
    laserShield: LaserShield,
    webStruggle: WebStruggle
  };

}());
