(function() {

var PopoverManager = function() {
  var ctx = null;
};
PopoverManager.prototype.showGameStartPopover = function() {
  this._addCanvasToDOMWithID("game-start-popover");

  this.ctx.canvas.width = 720;
  this.ctx.canvas.height = 600;

  this.ctx.font = "24pt sans-serif";
  this.ctx.font = "24pt Amatic SC";
  //this.ctx.font = "Times New Roman 48pt";
  this.ctx.textAlign = "center";
  this.ctx.fillStyle = "rgb(71, 70, 81)";
  //this.ctx.font = "12px";
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.fillStyle = "rgb(186, 186, 186)";
  this.ctx.fillText("Hello, Jack", 200, 50);
  //this.ctx.strokeText("Hello, Jack", 100, 10);
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

// Make an instance of PopoverManager globally available
window.PopoverManager = new PopoverManager();

}());
