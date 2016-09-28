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
   */
  var Animation = function(x, y) {
    Entity.call(this, null, x, y);
    this.id = null;
    this.animationQueue = null;
    this.complete = false;
  };
  Animation.prototype = Object.create(Entity.prototype);
  Animation.prototype.constructor = Animation;

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
   *
   *  Public Methods:
   *    perform(): executes the animation
   */
  var RockSmash = function(color, x, y) {
    Animation.call(this, x, y);
    this.color = color;
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
      }
    ];
  };
  RockSmash.prototype = Object.create(Animation.prototype);
  RockSmash.prototype.constructor = RockSmash;
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

    this.particles.forEach(function(particle) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 0, 0, " + particle.alpha + ")";

      ctx.translate(particle.location.x, particle.location.y);
      ctx.rotate(particle.rotation);
      ctx.fillRect(-particle.width / 2, -particle.width / 2, particle.width, particle.width);
      //ctx.strokeRect(-particle.width / 2, -particle.width / 2, particle.width, particle.width);

      ctx.restore();
    });
    ctx.restore();

    this._checkForCompletion();
  };
  RockSmash.prototype._checkForCompletion = function() {
    // If animation has complete, remove it from the animation queue
    if ( this.complete ) {
      var id = this.id;
      var animationIndex = this.animationQueue.animations.findIndex(function(animation) {
        return animation.id === id;
      });
      this.animationQueue.animations.splice(animationIndex, 1);
    }
  };

  // Make AnimationQueue and animations available globally
  window.AnimationQueue = new AnimationQueue();
  window.Animation = {
    rockSmash: RockSmash
  };

}());
