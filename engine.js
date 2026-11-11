/**
 * Minimal game runtime for Jessie's Maze Deluxe.
 * Replaces jaws.js + Filtrr2 + jQuery: asset load, rAF loop, keys, sprite, sepia.
 */
var Engine = (function () {
  var pressed = {};
  var assets = {};
  var keyMap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    32: "space"
  };

  function setupInput() {
    window.addEventListener("keydown", function (e) {
      var name = keyMap[e.keyCode];
      if (!name) return;
      pressed[name] = true;
      e.preventDefault();
    });
    window.addEventListener("keyup", function (e) {
      var name = keyMap[e.keyCode];
      if (!name) return;
      pressed[name] = false;
      e.preventDefault();
    });
    window.addEventListener("blur", function () {
      pressed = {};
    });
  }

  function Sprite(options) {
    options = options || {};
    this.image = typeof options.image === "string" ? assets[options.image] : options.image;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.anchor = options.anchor || "top_left";
    this.context = options.context || null;
    this.scale_x = 1;
    this.scale_y = 1;
    this._cacheOffsets();
  }

  Sprite.prototype._cacheOffsets = function () {
    if (!this.image) {
      this.width = 0;
      this.height = 0;
      this.left_offset = 0;
      this.top_offset = 0;
      return;
    }
    this.width = this.image.width * this.scale_x;
    this.height = this.image.height * this.scale_y;
    if (this.anchor === "center") {
      this.left_offset = this.width / 2;
      this.top_offset = this.height / 2;
    } else {
      this.left_offset = 0;
      this.top_offset = 0;
    }
  };

  Sprite.prototype.scaleTo = function (value) {
    this.scale_x = this.scale_y = value;
    this._cacheOffsets();
    return this;
  };

  Sprite.prototype.draw = function () {
    if (!this.image || !this.context) return this;
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.translate(-this.left_offset, -this.top_offset);
    this.context.drawImage(this.image, 0, 0, this.width, this.height);
    this.context.restore();
    return this;
  };

  function loadAssets(list, done) {
    var remaining = list.length;
    if (!remaining) {
      done();
      return;
    }
    for (var i = 0; i < list.length; i++) {
      (function (src) {
        var img = new Image();
        img.onload = img.onerror = function () {
          assets[src] = img;
          remaining -= 1;
          if (remaining === 0) done();
        };
        img.src = src;
      })(list[i]);
    }
  }

  function start(GameCtor, options) {
    options = options || {};
    setupInput();
    loadAssets(options.assets || [], function () {
      var game = typeof GameCtor === "function" ? new GameCtor() : GameCtor;
      if (game.setup) game.setup();
      function frame() {
        if (game.update) game.update();
        if (game.draw) game.draw();
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  /** Snapshot pixels for later restore (sepia toggle). */
  function snapshot(ctx, width, height) {
    return ctx.getImageData(0, 0, width, height);
  }

  function restore(ctx, imageData) {
    if (imageData) ctx.putImageData(imageData, 0, 0);
  }

  /** Classic sepia matrix in-place on the canvas bitmap. */
  function sepia(ctx, width, height) {
    var imageData = ctx.getImageData(0, 0, width, height);
    var d = imageData.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return {
    pressed: function (key) {
      return !!pressed[key];
    },
    asset: function (src) {
      return assets[src];
    },
    Sprite: Sprite,
    start: start,
    snapshot: snapshot,
    restore: restore,
    sepia: sepia
  };
})();
