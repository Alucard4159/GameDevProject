var Game = function(){
    var twoPi = Math.PI * 2;
    var foregroundSlivers = [];
    var backgroundSlivers = [];
    var raycaster = {
      init: function(){
        this.maxDistance = Math.sqrt(minimap.cellsAcross * minimap.cellsAcross + minimap.cellsDown * minimap.cellsDown);
        var numberOfRays = canvas.width;
        var angleBetweenRays = (60 * Math.PI / 180) / numberOfRays;
        this.castRays = function() {
          foregroundSlivers = [];
          backgroundSlivers = [];
          minimap.rays = [];
          dino.show = false;
          for (var i=0;i<numberOfRays;i++) {
            var rayNumber = -numberOfRays/2 + i;
            var rayAngle = angleBetweenRays * rayNumber + player.angle;
            this.castRay(rayAngle, i);
          }
        }
        this.castRay = function(rayAngle, i){
          rayAngle %= twoPi;
          if (rayAngle < 0) rayAngle += twoPi;
          var right = (rayAngle > twoPi * 0.75 || rayAngle < twoPi * 0.25);
          var up = rayAngle > Math.PI;
          var slope = Math.tan(rayAngle);
          var distance = 0;
          var xHit = 0;
          var yHit = 0;
          var wallX;  
          var wallY;
          var dX = right ? 1 : -1; 
          var dY = dX * slope;  
          var x = right ? Math.ceil(player.x) : Math.floor(player.x);
          var y = player.y + (x - player.x) * slope; 
          var wallType;
          while (x >= 0 && x < minimap.cellsAcross && y >= 0 && y < minimap.cellsDown) {
            wallX = Math.floor(x + (right ? 0 : -1));
            wallY = Math.floor(y);
            if (map[wallY][wallX] > -1) {
              var distanceX = x - player.x;
              var distanceY = y - player.y;
              distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);  
              xHit = x;  
              yHit = y;
              wallType = map[wallY][wallX];
              break;
            } else{
              if(dino.x === wallX && dino.y === wallY){
                dino.show = true;
              };
            }
            x += dX; 
            y += dY;
          }
          slope = 1/slope;
          dY = up ? -1 : 1;
          dX = dY * slope;
          y = up ? Math.floor(player.y) : Math.ceil(player.y);
          x = player.x + (y - player.y) * slope;
          while (x >= 0 && x < minimap.cellsAcross && y >= 0 && y < minimap.cellsDown) {
            wallY = Math.floor(y + (up ? -1 : 0));
            wallX = Math.floor(x);
            if (map[wallY][wallX] > -1) {
              var distanceX = x - player.x;
              var distanceY = y - player.y;
              var blockDistance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
              if (!distance || blockDistance < distance) {
                distance = blockDistance;
                xHit = x;
                yHit = y;
                wallType = map[wallY][wallX];
              }
              break;
            }else{
              if(dino.x === wallX && dino.y === wallY){
                dino.show = true;
              };
            }
            x += dX;
            y += dY;
          }
          if(dino.show === true){
            var dinoDistanceX = dino.x + .5 - player.x;
            var dinoDistanceY = dino.y + .5 - player.y;
            dino.angle = Math.atan(dinoDistanceY/dinoDistanceX) - player.angle;
            dino.distance = Math.sqrt(dinoDistanceX*dinoDistanceX + dinoDistanceY * dinoDistanceY);
          };
          minimap.rays.push([xHit, yHit]);
          var adjustedDistance = Math.cos(rayAngle - player.angle) * distance;
          var wallHalfHeight = canvas.height / adjustedDistance / 2;
          var wallTop = Math.max(0, canvas.halfHeight - wallHalfHeight);
          var wallBottom = Math.min(canvas.height, canvas.halfHeight + wallHalfHeight);
          var percentageDistance = adjustedDistance / this.maxDistance;
          var brightness = 1 - percentageDistance;
          var shade = Math.floor(palette.shades * brightness);
          if (shade < 0) shade = 0;
          if (shade >= palette.shades) shade = palette.shades - 1;
          var color = palette.walls[wallType][shade];
          if(adjustedDistance < dino.distance){
            foregroundSlivers.push([i, wallTop, wallBottom, color]);
          }else{
            backgroundSlivers.push([i, wallTop, wallBottom, color]);
          };
        }
      }
    }
    var player = {
      init: function(){
        this.x = 14;
        this.y = 14; 
        this.direction = 0;
        this.angle = 4.5;
        this.speed = 0;
        this.movementSpeed = 0.1;
        this.turnSpeed = 4 * Math.PI / 180; 
        this.move = function(){
          var moveStep = this.speed * this.movementSpeed;
          this.angle += this.direction * this.turnSpeed;
          var newX = this.x + Math.cos(this.angle) * moveStep;
          var newY = this.y + Math.sin(this.angle) * moveStep;
          if (!containsBlock(newX, newY)){
            this.x = newX;
            this.y = newY;

            if(Math.floor(this.x) === 1 && Math.floor(this.y) === 1)
            {
              setHud("Jessie's Maze Deluxe Level 2", [
                { className: "hud-x", value: "SUCCESS!", valueClass: "hud-success" },
                { className: "hud-stat", value: "" },
                { className: "hud-stat", label: "Percentage Completed- ", value: " 100%" }
              ]);
            }
            else
            {            
              var xCheck = this.x - 1;
              var yCheck = this.y - 1;
              var compCheck = Math.sqrt(13 * 13 + 13 * 13);
              var percentComplete = 100 - (Math.sqrt(xCheck * xCheck + yCheck * yCheck) / compCheck) * 100;
              if (percentComplete < 0) percentComplete = 0;
              if (percentComplete > 100) percentComplete = 100;
              setHud("Jessie's Maze Deluxe Level 2", [
                { className: "hud-x", label: "Player.X- ", value: String(Math.ceil(this.x)) },
                { className: "hud-stat", label: "Player.Y- ", value: String(Math.ceil(this.y)) },
                { className: "hud-stat", label: "Percentage Completed- ", value: Math.ceil(percentComplete) + "%" }
              ]);

            }
            
          };
        };
        this.draw = function(){
          var playerXOnMinimap = this.x * minimap.cellWidth;
          var playerYOnMinimap = this.y * minimap.cellHeight;
          minimap.context.fillStyle = "#000000";
          minimap.context.beginPath();
          minimap.context.arc(minimap.cellWidth*this.x, minimap.cellHeight*this.y, minimap.cellWidth/2, 0, 2*Math.PI, true); 
          minimap.context.fill();
          var projectedX = this.x + Math.cos(this.angle);
          var projectedY = this.y + Math.sin(this.angle);
          minimap.context.fillRect(minimap.cellWidth*projectedX - minimap.cellWidth/4, minimap.cellHeight*projectedY - minimap.cellHeight/4, minimap.cellWidth/2, minimap.cellHeight/2);

        };
      }
    }
    var lastHudKey = "";
    function setHud(title, rows) {
      var key = title;
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        key += "|" + (row.className || "") + "|" + (row.label || "") + "|" + (row.value || "") + "|" + (row.valueClass || "");
      }
      if (key === lastHudKey) return;
      lastHudKey = key;
      var hud = document.getElementById("HUD");
      hud.replaceChildren();
      var h2 = document.createElement("h2");
      h2.textContent = title;
      hud.appendChild(h2);
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var p = document.createElement("p");
        if (row.className) p.className = row.className;
        if (row.label) p.appendChild(document.createTextNode(row.label));
        if (row.value !== undefined) {
          var span = document.createElement("span");
          span.className = row.valueClass || "hud-value";
          span.textContent = row.value;
          p.appendChild(span);
        }
        hud.appendChild(p);
      }
    }
    function fillInstructions(title) {
      var root = document.getElementById("instructions");
      root.replaceChildren();
      var h2 = document.createElement("h2");
      h2.textContent = title;
      var p = document.createElement("p");
      var lines = [
        "Use the arrow keys (up, down) to move the player forward or backward, ",
        "or (left, right) to rotate clockwise or counter-clockwise. ",
        "Space-bar snaps a photo ",
        "Can you find the exit?"
      ];
      for (var i = 0; i < lines.length; i++) {
        p.appendChild(document.createTextNode(lines[i]));
        if (i < lines.length - 1) p.appendChild(document.createElement("br"));
      }
      root.appendChild(h2);
      root.appendChild(p);
    }
    function containsBlock(x,y) {
      var cy = Math.floor(y);
      var cx = Math.floor(x);
      if (cy < 0 || cx < 0 || cy >= map.length || cx >= map[0].length) return true;
      return map[cy][cx] !== -1;
    };
    var map = [ [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
        [1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,1],  ///Done Row
        [1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,1],  ///Done Row
        [1,-1,-1,-1,-1,2,2,-1,-1,2,2,-1,2,2,2,1],  ///Done Row
        [1,2,2,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,1],  ///Done Row
        [1,2,-1,2,-1,-1,-1,2,2,2,-1,-1,-1,2,-1,1], ///Done Row
        [1,-1,-1,2,-1,-1,2,-1,-1,2,2,2,2,-1,-1,1], 
        [1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,1],   ///Done Row
        [1,-1,-1,2,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,1],  ///Done Row
        [1,2,2,-1,-1,-1,-1,2,-1,-1,-1,-1,2,-1,2,1],     ///Done Row
        [1,2,-1,-1,-1,2,-1,-1,-1,2,-1,-1,-1,-1,-1,1],      ///Done Row
        [1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,2,2,2,1],    ///Done Row
        [1,-1,2,-1,-1,2,-1,2,2,-1,-1,-1,-1,-1,-1,1],    ///Done Row
        [1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,2,-1,-1,1],   ///Done Row
        [1,-1,-1,-1,-1,2,-1,-1,-1,-1,2,-1,-1,-1,-1,1],  ///Done Row
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]; 
    var canvas = {
      init: function(){
        this.element = document.getElementById('canvas');
        this.element.width = 600;
        this.element.height = 300;
        this.context = this.element.getContext("2d");
        this.width = this.element.width;
        this.height = this.element.height;
        this.halfHeight = this.height/2;
        this.blank = function(){
          this.context.clearRect(0, 0, this.width, this.height);
          this.context.fillStyle = palette.sky;
          this.context.fillRect(0, 0, this.width, this.halfHeight);
          this.context.fillStyle = palette.ground;
          this.context.fillRect(0, this.halfHeight, this.width, this.height);
        }
        this.drawSliver = function(sliver, wallTop, wallBottom, color){
          this.context.beginPath();
          this.context.strokeStyle = color;
          this.context.moveTo(sliver + .5, wallTop);
          this.context.lineTo(sliver + .5, wallBottom);
          this.context.closePath();
          this.context.stroke();
        }
      }
    };
    
    var minimap = {
      init: function(){
        this.element = document.getElementById('minimap');
        this.context = this.element.getContext("2d");
        this.element.width = 300;
        this.element.height = 300;
        this.width = this.element.width;
        this.height = this.element.height;
        this.cellsAcross = map[0].length;
        this.cellsDown = map.length;
        this.cellWidth = this.width/this.cellsAcross;
        this.cellHeight = this.height/this.cellsDown;
        this.colors = ["#a9a6a7", "#db7fa6", "#a9a6a7"];
        this.draw = function(){
          for(var y = 0; y < this.cellsDown; y++){
            for(var x = 0; x < this.cellsAcross; x++){
              var cell = map[y][x];
              if (cell===-1){
                this.context.fillStyle = "#ffffff"
              }else{
                this.context.fillStyle = this.colors[map[y][x]];
              };
              this.context.fillRect(this.cellWidth*x, this.cellHeight*y, this.cellWidth, this.cellHeight);
            };
          };
          for(var i = 0; i < this.rays.length; i++){
            this.drawRay(this.rays[i][0], this.rays[i][1])
          }
        };
        this.drawRay = function(xHit, yHit){
          this.context.beginPath();
          this.context.moveTo(this.cellWidth*player.x, this.cellHeight*player.y);
          this.context.lineTo(xHit * this.cellWidth, yHit * this.cellHeight);
          this.context.closePath();
          this.context.stroke();
        };
      }
    };
    var camera = {
      init: function(){
        var shot = document.getElementById('screenshot');
        shot.width = 300;
        shot.height = 150;
        this.context = shot.getContext('2d');
        var filtered = false;
        var originalPixels = null;
        var pictureGeneration = 0;
        shot.addEventListener("click", function() {
          if (filtered) {
            filtered = false;
            Engine.restore(camera.context, originalPixels);
          } else {
            originalPixels = Engine.snapshot(camera.context, shot.width, shot.height);
            Engine.sepia(camera.context, shot.width, shot.height);
            filtered = true;
          }
        });
        this.takePicture = function(){
          filtered = false;
          originalPixels = null;
          var generation = ++pictureGeneration;
          var image = new Image();
          image.onload = function() {
             if (generation !== pictureGeneration) return;
             camera.context.clearRect(0, 0, shot.width, shot.height);
             camera.context.drawImage(image, 0, 0, shot.width, shot.height);
          };
          image.src = canvas.element.toDataURL('image/png');
        }
      }
    };
    var palette = {
      init: function(){
        this.ground = '#DFD3C3'; 
        this.sky = '#418DFB'; 
        this.shades = 300;
        var initialWallColors = [[85, 68, 102], 
                                 [255, 53, 91], 
                                 [255, 201, 52], 
                                 [118, 204, 159]];
        this.walls = [];
        for(var i = 0; i < initialWallColors.length; i++){
          this.walls[i] = [];
          for(var j = 0; j < this.shades; j++){
            var red = Math.round(initialWallColors[i][0] * j / this.shades); 
            var green = Math.round(initialWallColors[i][1] * j / this.shades);
            var blue =  Math.round(initialWallColors[i][2] * j / this.shades);
            var color = "rgb("+red+","+green+","+blue+")";
            this.walls[i].push(color);
          };
        };
      }
    }
    var dino = {
      init: function(){
        this.sprite = new Engine.Sprite({
          image: "dino.png",
          x: 0,
          y: canvas.height / 2,
          anchor: "center",
          context: canvas.context
        });
        this.x = 2; 
        this.y = 2;
        this.show = false;
        this.distance = 10000;
        this.draw = function(){
          this.scale = raycaster.maxDistance / dino.distance / 2;
          this.sprite.scaleTo(this.scale);
          this.angle %= twoPi;
          if (this.angle < 0) this.angle += twoPi;
          this.angleInDegrees = this.angle * 180 / Math.PI;
          var potentialWidth = 300*.2;
          var halfAngularWidth = potentialWidth/2;
          this.adjustedAngle = this.angleInDegrees + halfAngularWidth;
          if(this.adjustedAngle > 180 || this.adjustedAngle < -180){
            this.adjustedAngle %= 180;
          };
          this.sprite.x = this.adjustedAngle/potentialWidth*canvas.width;
          this.sprite.draw();

          
        };
        
      }
    };
    this.draw = function(){
      minimap.draw();
      player.draw(); 
      canvas.blank();
      for(var i = 0; i < backgroundSlivers.length; i++){
        canvas.drawSliver.apply(canvas, backgroundSlivers[i]);
      };
      if (dino.show){
        dino.draw();
      };
      for(var i = 0; i < foregroundSlivers.length; i++){
        canvas.drawSliver.apply(canvas, foregroundSlivers[i]);
      };
    };
    var spaceWasDown = false;
    this.setup = function() {
      camera.init();
      minimap.init();
      player.init();
      canvas.init();
      palette.init();
      raycaster.init();
      dino.init();
      fillInstructions("My Maze Deluxe Level 2");
    };
    this.update = function(){
      raycaster.castRays();
      player.direction = 0;
      player.speed = 0;
      if(Engine.pressed("left")) { player.direction = -1 };
      if(Engine.pressed("right")) { player.direction = 1 };
      if(Engine.pressed("up")) { player.speed = 1 };
      if(Engine.pressed("down")) { player.speed = -1 };

      var spaceDown = !!Engine.pressed("space");
      if (spaceDown && !spaceWasDown) {
        camera.takePicture();
      }
      spaceWasDown = spaceDown;
      player.move();
    };
  }

Engine.start(Game, { assets: ["dino.png"] });