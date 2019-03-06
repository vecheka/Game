var AM = new AssetManager();
var SM = new SoundManager();
var gameEngine = new GameEngine();
var database = new Database();
const WINDOW_WIDTH = 800;
const DEBUG = false;
const LEVEL_ONE_SPEED = 50;
var backgroundMusic;
var LOAD_MESSAGE = "GAME LOADED!";


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
	
	database.connect();
	
    gameEngine.init(ctx);
	gameEngine.startGame = false;
	gameEngine.pauseGame = false;
	gameEngine.showSetting = false;
	gameEngine.showCredit = false;
	gameEngine.goBack = false;
	gameEngine.loaded = false;
	gameEngine.saved = false;
	
	
	gameEngine.gameOver = false;
	gameEngine.gameWon = false;
	gameEngine.wave1 = false;
	gameEngine.wave2 = false;
	gameEngine.wave3 = false;
	startInput();
	
	var playButton = new PlayButton(320, 300, 150, 30);
	var resumeButton = new ResumeButton(320, 300, 150, 30);
	var loadButton = new LoadButton(320, 340, 150, 30);
	var settingButton = new SettingButton(320, 380, 150, 30);
	var saveButton = new SaveButton(320, 380, 150, 30);
	var creditButton = new CreditButton(320, 420, 150, 30);
	var gobackButton = new GoBackButton(350, 400, 100, 30);
	
	
	gameEngine.playButton = playButton;
	gameEngine.resumeButton = resumeButton;
	gameEngine.loadButton = loadButton;
	gameEngine.saveButton = saveButton;
	gameEngine.settingButton = settingButton;
	gameEngine.creditButton = creditButton;
	gameEngine.gobackButton = gobackButton;
	
	
	gameEngine.Camera = Camera;
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg_city.png"), 0, 0, 20, 50));

	
	gameEngine.createHero(0, 0);
	

	
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

function loadGame(data) {
	gameEngine.loaded = true;
	
	
	restartGame();

	gameEngine.Camera.x = data.camera.x;
	// gameEngine.startGame = true;
	gameEngine.createMap();
	backgroundMusic = new Sound(SM.getAsset("./sound/background.mp3"));
	backgroundMusic.sound.loop = true;
	backgroundMusic.sound.volume = 0.5;
	backgroundMusic.play();
	
	// hero
	gameEngine.Hero.x = data.hero.x;
	gameEngine.Hero.y = data.hero.y;
	gameEngine.Hero.kills = data.hero.kills;
	gameEngine.Hero.direction = data.hero.direction;
	gameEngine.Hero.health = data.hero.health;
	gameEngine.Hero.gunSound = new Sound(SM.getAsset("./sound/gunSound1.mp3"));
	gameEngine.Hero.gunSound.loop = true;
	gameEngine.Hero.painSound = new Sound(SM.getAsset("./sound/pain.mp3"));
	gameEngine.Hero.painSound.loop = true;
	gameEngine.addEntity(gameEngine.Hero);
	
	var bullets = [];
	gameEngine.bullets = bullets;
	
	gameEngine.startGame = true;
	// zombies
	for (var i = 0; i < gameEngine.zombies.length; i++) {
		gameEngine.zombies[i].removeFromWorld = true;
	}
	
	for (var i = 0; i < data.zombies.length; i++) {
		var zombie = data.zombies[i];
		gameEngine.createZombie(zombie.x, zombie.y, zombie.direction, zombie.speed);
		gameEngine.zombies[gameEngine.zombies.length - 1].health = zombie.health;
		gameEngine.zombies[gameEngine.zombies.length - 1].damage = zombie.damage;
	}
	
	gameEngine.wave1 = data.wave.wave1;
	gameEngine.wave2 = data.wave.wave2;
	gameEngine.wave3 = data.wave.wave3;
	
}

function restartGame() { 
	gameEngine.Hero.removeFromWorld = true;
	gameEngine.createHero(0, 0);
	for (var i = 0; i < gameEngine.zombies.length; i++) {
		gameEngine.zombies[i].removeFromWorld = true;
	}
}

// setting game status to pause or un-pause - status = true -> pause game
function setGameStatus(status) {
	for (var i = 0; i < gameEngine.zombies.length; i++) {
		gameEngine.zombies[i].pause = status;
	}
}

// save game states to socket
function saveGame() {
	var zombiesData = [];
	
	for (var i = 0; i < gameEngine.zombies.length; i++) {
		var zombie = gameEngine.zombies[i];
		if (!zombie.removeFromWorld) {
			var zombieData = {
			"x": zombie.x, 
			"y": zombie.y + 68, 
			"direction" : zombie.direction, 
			"speed" : zombie.speed, 
			"health" : zombie.health, 
			"damage" : zombie.damage
			}
			zombiesData.push(zombieData);
		}
		
	}
	
	var data = {
		
		"camera" : {"x" : gameEngine.Camera.x},
		"wave" : {
			"wave1" : gameEngine.wave1,
			"wave2" : gameEngine.wave2,
			"wave3" : gameEngine.wave3
		},
		"hero" : {
			"x" : gameEngine.Hero.x,
			"y" : gameEngine.Hero.y,
			"direction" : gameEngine.Hero.direction,
			"health": gameEngine.Hero.health,
			"kills" : gameEngine.Hero.kills
		},
		"zombies": zombiesData
		
	}
	
	// console.log(data.camera.x);
	return data;

}


function startInput() {
	

	// buttons' events to start game, show settings, and credits
	gameEngine.ctx.canvas.addEventListener("click", function(event) {
		
		var rect = gameEngine.ctx.canvas.getBoundingClientRect();
		var pos = {x : event.clientX - rect.left, y : event.clientY - rect.top};
		if (!gameEngine.startGame && !gameEngine.showSetting && !gameEngine.showCredit) {
			if (gameEngine.playButton.isClick(pos)) {
				SM.downloadAll(startGame);
				gameEngine.startGame = true;
				gameEngine.showSetting = false;
				gameEngine.showCredit = false;
			} 
		} 
		
		if (!gameEngine.startGame && !gameEngine.showCredit && gameEngine.settingButton.isClick(pos)) {
				gameEngine.gobackButton.x = 350;
				gameEngine.gobackButton.y = 400;
				gameEngine.showSetting = true;
				
		}
		
				
		if (!gameEngine.startGame && !gameEngine.showSetting && gameEngine.creditButton.isClick(pos)) {
			gameEngine.gobackButton.x = 340;
			gameEngine.gobackButton.y = 257;
			gameEngine.showCredit = true;
		}
		
		if (!gameEngine.startGame && gameEngine.gobackButton.isClick(pos)) {
			gameEngine.showSetting = false;
			gameEngine.startGame = false;
			gameEngine.showCredit = false;
		}
		
		
		if (gameEngine.startGame && gameEngine.pauseGame && gameEngine.settingButton.isClick(pos)) {
			gameEngine.gobackButton.x = 350;
			gameEngine.gobackButton.y = 400;
			gameEngine.showSetting = true;
			gameEngine.pauseGame = false;
		}
		
		if (gameEngine.startGame && !gameEngine.pauseGame && gameEngine.gobackButton.isClick(pos)) {
			gameEngine.pauseGame = true;
			gameEngine.showSetting = false;
		}
		
		if (gameEngine.pauseGame && gameEngine.resumeButton.isClick(pos)) {
			gameEngine.pauseGame = false;
			setGameStatus(false);
		}
		
		if ((!gameEngine.startGame || gameEngine.pauseGame) && gameEngine.loadButton.isClick(pos)) {
			database.load();
			// alert("hi");
		}
		
		if (gameEngine.pauseGame && gameEngine.saveButton.isClick(pos)) {
			database.save(saveGame());
		}
		
		// if (gameEngine.gameOver && gameEngine.playAgainButton.isClick(pos)) {
			// // gameEngine.restartGame = true;
			// gameEngine.startGame = true;
			// gameEngine.gameOver = false;
			
			// resetGame();
			// startGame();
		// }
	
		
	}, false);
	
	
	
	
	/** Key-up and Key-down Events.*/
	document.addEventListener("keydown", function (e) {

		if (!gameEngine.pauseGame) {
			var keyCode = e.keyCode;
			switch(keyCode) {
				case 68: // d
					gameEngine.Hero.walk = true;
					gameEngine.Hero.direction = 1;
					if (gameEngine.loaded) gameEngine.loaded = false;
					break;
				case 27: // esc for pausing the game
					if (gameEngine.startGame) {
						gameEngine.pauseGame = true;
						setGameStatus(true);
						gameEngine.settingButton.x = gameEngine.creditButton.x;
						gameEngine.settingButton.y = gameEngine.creditButton.y;
					}
					if (gameEngine.loaded) gameEngine.loaded = false;
					
					break;
				case 65: // a
					gameEngine.Hero.walk = true;
					gameEngine.Hero.direction = -1;
					if (gameEngine.loaded) gameEngine.loaded = false;
					break;
				case 87: // w
					if (gameEngine.Hero.boundingBox.bottom > gameEngine.Hero.currentPlatform.boundingBox.top
					   && !gameEngine.Hero.falling) {
						gameEngine.Hero.jump = true; 
						gameEngine.Hero.base = gameEngine.Hero.y;
					}
					if (gameEngine.loaded) gameEngine.loaded = false;
					break;
				case 32: // space(shoot)
					if (gameEngine.loaded) gameEngine.loaded = false;
					gameEngine.Hero.shoot = true;
					break;
				case 82: // restart game
					if (gameEngine.gameOver || gameEngine.gameWon) {
						gameEngine.gameWon = false;
						restartGame();
						gameEngine.Hero.reset();
						startGame();
					}
					break;
		
			}
			
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

