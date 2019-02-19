var AM = new AssetManager();
var SM = new SoundManager();
var gameEngine = new GameEngine();
const WINDOW_WIDTH = 800;
const DEBUG = false;
const LEVEL_ONE_SPEED = 50;
var backgroundMusic;
// const LEVEL_ONE_SPEED = 60;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/** BoundingBox Class - use for collision.*/
function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (other) {
    if (this.right > other.left && this.left < other.right && this.top < other.bottom && this.bottom > other.top) return true;
    return false;
	
}

/** Camera Object.*/
var Camera = {
    x: 0,
    width: WINDOW_WIDTH
};


AM.queueDownload("./img/bg_city.png");
AM.queueDownload("./img/tiles_castle.png");
AM.queueDownload("./img/jump.png");
AM.queueDownload("./img/jumpB.png");
AM.queueDownload("./img/idle.png");
AM.queueDownload("./img/idleB.png");
AM.queueDownload("./img/walk.png");
AM.queueDownload("./img/walkb.png");
AM.queueDownload("./img/fire_still.png");
AM.queueDownload("./img/fire_stillB.png");
AM.queueDownload("./img/walk_fire.png");
AM.queueDownload("./img/walk_fireB.png");
AM.queueDownload("./img/jump_fire.png");
AM.queueDownload("./img/jump_fireB.png");
AM.queueDownload("./img/hurt.png");
AM.queueDownload("./img/hurtB.png");
AM.queueDownload("./img/defeated.png");
AM.queueDownload("./img/defeatedB.png");
AM.queueDownload("./img/bullet1.png");

AM.queueDownload("./img/zombie_walkB.png");
AM.queueDownload("./img/zombie_walk.png");
AM.queueDownload("./img/zombie_attack.png");
AM.queueDownload("./img/zombie_attackB.png");
AM.queueDownload("./img/zombie_dead.png");
AM.queueDownload("./img/zombie_deadB.png");
AM.queueDownload("./img/zombie_idle.png");
AM.queueDownload("./img/zombie_idleB.png");

SM.queueDownload("./sound/gunSound1.mp3");
SM.queueDownload("./sound/pain.mp3");
SM.queueDownload("./sound/zombie_moan.mp3");
SM.queueDownload("./sound/zombie_bite.mp3");
SM.queueDownload("./sound/zombie_pain.mp3");
SM.queueDownload("./sound/background.mp3");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
	
    gameEngine.init(ctx);
	gameEngine.startGame = false;
	gameEngine.gameOver = false;
	gameEngine.wave1 = false;
	gameEngine.wave2 = false;
	startInput();
	
	gameEngine.Camera = Camera;
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg_city.png"), 0, 0, 20, 35));

	
	gameEngine.createHero();
	

	
	gameEngine.createMap();
	gameEngine.start();
	

});


function startGame() {
	gameEngine.startGame = true;
	gameEngine.createMap();
	backgroundMusic = new Sound(SM.getAsset("./sound/background.mp3"));
	backgroundMusic.sound.loop = true;
	backgroundMusic.sound.volume = 0.5;
	backgroundMusic.play();
	
	gameEngine.Hero.gunSound = new Sound(SM.getAsset("./sound/gunSound1.mp3"));
	gameEngine.Hero.gunSound.loop = true;
	gameEngine.Hero.painSound = new Sound(SM.getAsset("./sound/pain.mp3"));
	gameEngine.Hero.painSound.loop = true;
	gameEngine.addEntity(gameEngine.Hero);
	
	var bullets = [];
	gameEngine.bullets = bullets;
	
	gameEngine.createWaveOne();
	gameEngine.wave1 = true;
}

function restartGame() {                 
	gameEngine.createHero();
	for (var i = 0; i < gameEngine.zombies.length; i++) {
		gameEngine.zombies[i].removeFromWorld = true;
	}
}


function startInput() {
	/** Key-up and Key-down Events.*/
	document.addEventListener("keydown", function (e) {

		
		var keyCode = e.keyCode;
		switch(keyCode) {
			case 68: // d
				gameEngine.Hero.walk = true;
				gameEngine.Hero.direction = 1;
				break;
			case 83: // s for starting the game
				
				SM.downloadAll(startGame);
				
				break;
			case 65: // a
				gameEngine.Hero.walk = true;
				gameEngine.Hero.direction = -1;
				
				break;
			case 87: // w
				if (gameEngine.Hero.boundingBox.bottom > gameEngine.Hero.currentPlatform.boundingBox.top
				   && !gameEngine.Hero.falling) {
					gameEngine.Hero.jump = true; 
					gameEngine.Hero.base = gameEngine.Hero.y;
				}
				
				break;
			case 32: // space(shoot)
				
				gameEngine.Hero.shoot = true;
				break;
			case 82: // restart game
				if (gameEngine.gameOver) {
					
					restartGame();
					gameEngine.Hero.reset();
					startGame();
				}
				break;
	
		}
		
		
		
	
 }, false);
	
	document.addEventListener("keyup", function (e) {
		
	
		var keyCode = e.keyCode;
		switch(keyCode) {
			case 68: // d
				gameEngine.Hero.walk = false;
				break;
			case 83: // s
				
				// that.keyS = false;
				break;
			case 65: // a
				gameEngine.Hero.walk = false;
				// that.backward = false;
				break;
			case 87: // w
				// gameEngine.Hero.jump = false;
				break;
			case 32:
				// gameEngine.Hero.gunSound.stop();
				gameEngine.Hero.shoot = false;
				break;
			case 82: // restart game
				gameEngine.gameOver = false;
				break;
		}
		
		
}, false);

}

