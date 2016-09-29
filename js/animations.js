// Dependencies:
//  app.js
(function() {

  /*
   *  AnimationQueue: A container for all the active finite animations.
   *    Handles the updating, rendering, and completion of these animations.
   *
   *  Properties:
   *    * animations: an array that holds all the active animations
   *    * currentAnimationID: the unique animation ID to assign to the next
   *        animation added to the animations array. Used for identifying the
   *        animation once it has completed and needs to be removed from the
   *        animations array.
   *
   *  Methods:
   *    update(): Updates all active animations
   *    render(): Renders all active animations to the canvas
   *    addAnimation(animation): Adds `animation` the the animations array
   */
  var AnimationQueue = function() {
    this.animations = [];
    this.currentAnimationID = 0;
  };
  AnimationQueue.prototype.addAnimation = function(animation) {
    animation.id = this.currentAnimationID++;
    animation.animationQueue = this;

    this.animations.push(animation);
  };
  AnimationQueue.prototype.update = function(dt) {
    this.animations.forEach(function(animation) {
      animation.update(dt);
    });
  };
  AnimationQueue.prototype.render = function() {
    this.animations.forEach(function(animation) {
      animation.render();
    });
  };

  /*
   * Animation: An animation to render to the canvas.
   *
   *  Class Hierarchy: Object > Entity > Animation
   *
   *  Parameters:
   *    x: The column of this animation on the canvas grid
   *    y: The row of this animation on the canvas grid
   *
   *  Properties:
   *    id: Identifies this Animation. Useful for identifying this specific
   *      animation when contained inside an AnimationQueue.
   *    animationQueue: Reference to the animation queue containing this animation
   *    complete: A flag that marks whether or not this animation has completed
   *
   *  Methods:
   *    _checkForCompletion(): Checks if this animation is complete, and removes it from
   *        its animation queue if it is.
   */
  var Animation = function(x, y) {
    Entity.call(this, null, x, y);
    this.id = null;
    this.animationQueue = null;
    this.complete = false;
  };
  Animation.prototype = Object.create(Entity.prototype);
  Animation.prototype.constructor = Animation;
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

  /*
   *  RockSmash: Animates the smashing of a colored rock by the player.
   *
   *  Class Hierarchy: Object > Entity > Animation > RockSmash
   *
   *  Parameters:
   *    color: the color of the smashed rock
   *    x: The column of this animation on the canvas grid
   *    y: The row of this animation on the canvas grid
   *
   *  Properties:
   *    color: the color of the rock being smashed
   *    animationOrigin: The position within the cell where the particle animations
   *        originate
   *    particles: an array storing the animating particle objects that are drawn to the canvas
   *
   *  Public Methods:
   *    perform(): executes the animation
   *    update(): updates the properties of the animating particles
   *    render(): renders the animation to the canvas
   */
  var RockSmash = function(color, x, y) {
    Animation.call(this, x, y);
    this.color = {
      name: color,
      stroke: "",
      fill: ""
    };
    this._setColor(color);
    this.animationOrigin = {
      x: ( this.location.x + 0.5 ) * CELL_WIDTH,
      y: ( this.location.y + 0.5 ) * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST + 70
    };
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
  RockSmash.prototype.update = function(dt) {
    var animationComplete = false;
    this.particles.forEach(function(particle) {
      particle.update(dt);
      if ( particle.alpha === 0 ) {
        animationComplete = true;
      }
    });
    this.complete = animationComplete;
  };
  RockSmash.prototype.render = function() {
    ctx.save();
    ctx.lineWidth = 20;

    var self = this;
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


  /*
   * LaserShield: Animation for the shield that surrounds the player while
   *      that player is passing throught a laser beam in a LaserMan costume.
   */
  var LaserShield = function(color, x, y) {
    Animation.call(this, x, y);
    this._setColor(color);
    this.animationOrigin = {
      x: ( this.location.x + 0.5 ) * CELL_WIDTH,
      y: ( this.location.y + 0.5 ) * CELL_HEIGHT + SPRITE_Y_POSITION_ADJUST + 70
    };
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
  LaserShield.prototype.update = function(dt) {
    this.particles.backgroundCircle.update(dt);
    this.particles.expandingCircle.update(dt);
    this.particles.orbitingParticle.update(dt);
  };
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
    //ctx.stroke();
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


  // Make AnimationQueue and animations available globally
  window.AnimationQueue = new AnimationQueue();
  window.Animation = {
    rockSmash: RockSmash,
    laserShield: LaserShield
  };

}());
