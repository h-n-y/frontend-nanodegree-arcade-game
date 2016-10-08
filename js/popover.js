(function() {

var PopoverManager = function() {
  var ctx = null;
};
PopoverManager.prototype.showGameStartPopover = function() {
  this._addCanvasToDOMWithID("game-start-popover");

  // Set canvas dimensions
  this.ctx.canvas.width = 720;
  this.ctx.canvas.height = 600;
  var horizontalCenter = this.ctx.canvas.width / 2;

  // Colors
  var blueGray, gray, orange;
  blueGray  = "rgb(71, 70, 81)";
  gray      = "rgb(186, 186, 186)";
  orange    = "rgb(255, 184, 6)";

  this.ctx.font = "32pt Amatic SC";
  this.ctx.textAlign = "center";
  // Add dark blue-gray background
  this.ctx.fillStyle = blueGray;
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.fillStyle = gray;
  this.ctx.fillText("This is Jack:", horizontalCenter, 80);

  this.ctx.fillText("Help Jack find the", horizontalCenter, 300);
  this.ctx.fillStyle = orange;
  this.ctx.fillText("CANDYCORN", horizontalCenter, 350);
  this.ctx.fillStyle = gray;
  this.ctx.fillText("he dropped while", horizontalCenter, 390);
  this.ctx.fillText("trick-or-treating!", horizontalCenter, 430);

  this.ctx.font = "24pt Amatic SC";
  this.ctx.fillText("[ space ] to continue", horizontalCenter, 560);

  // Add orange text
  this.ctx.fillStyle = orange;
  this.ctx.font = "32pt Amatic SC";
  this.ctx.fillText("Jack", horizontalCenter + 36, 80);
  this.ctx.font = "24pt Amatic SC";
  this.ctx.fillText("space", horizontalCenter - 54, 560);

  // Add image of Jack
  this.ctx.drawImage(Resources.get('images/jack.png'), horizontalCenter - 51, 60);
};
PopoverManager.prototype._addCanvasToDOMWithID = function(id) {
  var popover = document.createElement('canvas');
  popover.id = id;

  document.getElementById("container").appendChild(popover);
  //document.body.appendChild(popover);

  this.ctx = popover.getContext('2d');
};
PopoverManager.prototype._removeCanvasFromDOM = function() {
  var canvas = document.getElementById("popover");
  document.body.removeChild(canvas);
};
PopoverManager.prototype.removePopover = function() {
  if ( this.ctx === null ) return;

  // Remove canvas here
  var canvasContainer = document.getElementById("container");
  canvasContainer.removeChild(this.ctx.canvas);
};

// Make an instance of PopoverManager globally available
window.PopoverManager = new PopoverManager();

}());
