window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
	this.platforms = [];
	this.zombies = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
	
	for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

/** Helper method to create hero.*/
GameEngine.prototype.createHero = function() {
	var animationSprites = [];
	animationSprites["jump"] = AM.getAsset("./img/jump.png");
	animationSprites["jumpb"] = AM.getAsset("./img/jumpB.png");
	animationSprites["idle"] = AM.getAsset("./img/idle.png");
	animationSprites["idleb"] = AM.getAsset("./img/idleB.png");
	animationSprites["walk"] = AM.getAsset("./img/walk.png");
	animationSprites["walkb"] = AM.getAsset("./img/walkb.png");
	animationSprites["standFire"] = AM.getAsset("./img/fire_still.png");
	animationSprites["standFireb"] = AM.getAsset("./img/fire_stillB.png");
	animationSprites["walkFire"] = AM.getAsset("./img/walk_fire.png");
	animationSprites["walkFireb"] = AM.getAsset("./img/walk_fireB.png");
	animationSprites["jumpFire"] = AM.getAsset("./img/jump_fire.png");
	animationSprites["jumpFireb"] = AM.getAsset("./img/jump_fireB.png");
	animationSprites["hurt"] = AM.getAsset("./img/hurt.png");
	animationSprites["hurtb"] = AM.getAsset("./img/hurtB.png");
	animationSprites["dead"] = AM.getAsset("./img/defeated.png");
	animationSprites["deadb"] = AM.getAsset("./img/defeatedB.png");
	var hero = new Hero(gameEngine, animationSprites, 0, 0);
	gameEngine.Hero = hero;
}


/** Helper method to create tiles on the map.*/
GameEngine.prototype.createTile = function (x, y, numberOfTiles) {
	var tile = new Tile(gameEngine, AM.getAsset("./img/tiles_castle.png"), 0, 0, 992 / 8, 480 / 3, x, y, numberOfTiles);
	this.platforms.push(tile);
	this.addEntity(tile);
}

/** Helper method to get width of the previous tile.*/
GameEngine.prototype.getWidth = function(tilePos) {
	return this.platforms[tilePos].getTotalWidth();
}

/** Helper method to get tile top position.*/
GameEngine.prototype.getBoundingTop = function(tilePos) {
	return this.platforms[tilePos].boundingBox.top;
}

/** Helper method to get tile object specified by position in the list.*/
GameEngine.prototype.getTile =  function(pos) {
	return this.platforms[pos];
}

/** Helper method to get number of tiles in platforms.*/
GameEngine.prototype.getPlatformLength = function() {
	return this.platforms.length;
}

/** Helper method to get position of a tile on the map.*/
GameEngine.prototype.getTileIndex = function(theTile) {
	for (var i = 0; i < this.platforms.length; i++) {
		if (theTile === this.platforms[i]) {
			return i;
		}
	}
}

GameEngine.prototype.createMap = function() {
	this.createTile(-30, 680, 10);
	this.createTile(this.getWidth(0) + 250, 680, 10);
	this.createTile(this.getTile(this.getPlatformLength() - 1).x 
						+ this.getWidth(this.getPlatformLength() - 1) + 250, 560, 15);
	this.createTile(this.getTile(this.getPlatformLength() - 1).x 
						+ this.getWidth(this.getPlatformLength() - 1) + 250, 680, 20);
	this.createTile(this.getTile(this.getPlatformLength() - 1).x 
						+ this.getWidth(this.getPlatformLength() - 1) + 250, 680, 15);
	this.createTile(this.getTile(this.getPlatformLength() - 1).x 
						+ this.getWidth(this.getPlatformLength() - 1) + 250, 510, 15);	
	this.createTile(this.getTile(this.getPlatformLength() - 1).x 
						+ this.getWidth(this.getPlatformLength() - 1) + 250, 680, 20);							
}


/** Helper method to create zombie.*/
GameEngine.prototype.createZombie = function(x, y, direction, speed) {
	var zombieSprites = [];
	zombieSprites["walk"] =  AM.getAsset("./img/zombie_walk.png");
	zombieSprites["walkb"] =  AM.getAsset("./img/zombie_walkB.png");
	zombieSprites["attack"] =  AM.getAsset("./img/zombie_attack.png");
	zombieSprites["attackb"] =  AM.getAsset("./img/zombie_attackB.png");
	zombieSprites["idle"] =  AM.getAsset("./img/zombie_idle.png");
	zombieSprites["idleb"] =  AM.getAsset("./img/zombie_idleB.png");
	zombieSprites["dead"] =  AM.getAsset("./img/zombie_dead.png");
	zombieSprites["deadb"] =  AM.getAsset("./img/zombie_deadB.png");
	var zombie = new Zombie(this, zombieSprites,  x , y - 68, direction, speed);
	zombie.moan = new Sound(SM.getAsset("./sound/zombie_moan.mp3"));
	zombie.pain = new Sound(SM.getAsset("./sound/zombie_pain.mp3"));
	zombie.bite = new Sound(SM.getAsset("./sound/zombie_bite.mp3"));
	this.zombies.push(zombie);
	this.addEntity(zombie);
}

/** Helper method to get number of zombies in zombies.*/
GameEngine.prototype.getZombieNumbers = function() {
	return this.zombies.length;
}

/** Helper method to create Wave 1 of the zombie apocalypse.*/
GameEngine.prototype.createWaveOne = function() {
	var distance = -30;
	var pos = gameEngine.getWidth(0) - 25;
	var speed = 3;
	// first tile
	for (var i = 1; i <= 5; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(0), -1, LEVEL_ONE_SPEED);
		
		this.zombies[this.getZombieNumbers() - 1].speed += 3 + speed;
		speed += speed;
	}
	
	// second tile
	distance = -40;
	pos = this.getTile(1).x + this.getWidth(1) - 100;
	speed = 3;
	for (var i = 1; i <= 5; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(0), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 3 + speed;
		speed += speed;
	} 
	
	// third tile
	distance = -30;
	pos = this.getTile(2).x + this.getWidth(2) - 200;
	speed = 0.1;
	for (var i = 1; i <= 10; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(2), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 0.1 + speed;
		speed += speed;
	} 
	
	
	// fourth tile
	distance = -40;
	pos = this.getTile(3).x + this.getWidth(3) - 550;
	speed = 0.005;
	for (var i = 1; i <= 15; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(3), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 0.005 + speed;
		speed += speed;
	} 
	
	// fifth tile
	distance = -35;
	pos = this.getTile(4).x + this.getWidth(4) - 200;
	speed = 0.1;
	for (var i = 1; i <= 10; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(4), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 0.1 + speed;
		speed += speed;
	} 
	
	
	// sixth tile
	distance = -35;
	pos = this.getTile(5).x + this.getWidth(5) - 200;
	speed = 0.005;
	for (var i = 1; i <= 15; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(5), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 0.005 + speed;
		speed += speed;
	} 
	
	// seventh tile
	distance = -35;
	pos = this.getTile(6).x + this.getWidth(6) - 200;
	speed = 0.004;
	for (var i = 1; i <= 20; i++) {
		this.createZombie(pos + (i * distance), this.getBoundingTop(6), -1, LEVEL_ONE_SPEED);
		this.zombies[this.getZombieNumbers() - 1].speed += 0.004 + speed;
		speed += speed;
	} 
}

/** Helper method to create Wave 2 of the zombie apocalypse.*/
GameEngine.prototype.createWaveTwo = function() {
	
	for (var i = 0; i < this.zombies.length; i++) {
		var zombie = this.zombies[i];
		zombie.speed += 0.03;
	}
	
}


/** Helper method to create Wave 3 of the zombie apocalypse.*/
GameEngine.prototype.createWaveThree = function() {
	
	for (var i = 0; i < this.zombies.length; i++) {
		var zombie = this.zombies[i];
		zombie.speed += 0.001;
		zombie.damage +=0.003;
	}
	
}


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}