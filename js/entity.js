/** Background Class.*/
function Background(game, spritesheet, x, y, speed, numberOfRepeats) {
    this.animation = new Animation(spritesheet, 480, 800, 1, 0.1, 1, true, 1);
    this.spritesheet = spritesheet;
    this.speed = speed;
	// this.ctx = game.ctx;
	this.game = game;
	this.numberOfRepeats = numberOfRepeats;
	
    Entity.call(this, game, x, y);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    // if (this.game.Hero.walk) this.x -= this.game.clockTick * this.speed * this.game.Hero.direction;
	if (this.x >= this.game.ctx.canvas.width) {
		this.x = 0;
	}
    Entity.prototype.update.call(this);
}

Background.prototype.draw = function () {
	
    for (var i = 0; i < this.numberOfRepeats; i++) {
		this.animation.drawFrame(this.game.clockTick, this.game.ctx, 
			this.x - this.game.Camera.x + (i * this.animation.frameWidth / 2), this.y);
	} 
	
	if (!this.game.startGame) {
		this.game.ctx.font = "30px Verdana";
		this.game.ctx.fillStyle = "#FFFFFF";
		this.game.ctx.fillText("Press S to Start", 275, 400);
	} else {
		
		if (this.game.wave1) {
			
			this.game.ctx.font = "30px Verdana";
			this.game.ctx.fillStyle = "#FFFFFF";
			this.game.ctx.fillText("Wave 1", 350, 400);
			
		} else if (this.game.wave2) {
			this.game.ctx.font = "30px Verdana";
			this.game.ctx.fillStyle = "#FFFFFF";
			this.game.ctx.fillText("Wave 2", 350, 400);
		} else if (this.game.gameOver) {
			this.game.ctx.font = "30px Verdana";
			this.game.ctx.fillStyle = "#FFFFFF";
			this.game.ctx.fillText("Game Over", 350, 360);
			this.game.ctx.fillText("Press R to Restart", 300, 400);
		}
		
		// draw game status
		this.game.ctx.fillStyle = "#FF0000";
		this.game.ctx.fillRect(70, 8, this.game.Hero.health, 15);
		this.game.ctx.fillStyle = "#FFFFFF";
		this.game.ctx.font = "15px Verdana";
		this.game.ctx.fillText(Math.floor(this.game.Hero.health) < 0 ? 0 : Math.floor(this.game.Hero.health), 105, 20);
		this.game.ctx.fillText("Health", 10, 20);
		
		this.game.ctx.fillText("Zombie Kills: ", 650, 20);
		this.game.ctx.fillText(this.game.Hero.kills, 760, 20);
	}
	
    Entity.prototype.draw.call(this);
}

/** Tiles Class.*/
function Tile(game, spriteSheet, frameX, frameY, width, height, x, y, numberOfTiles) {
	this.game = game;
	this.spriteSheet = spriteSheet;
	this.frameX = frameX;
	this.frameY = frameY;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.distance = 85;
	this.numberOfTiles = numberOfTiles;
	this.boundingBox =  new BoundingBox(this.x, this.y,  this.getTotalWidth(), this.height);
	
	Entity.call(this, game, this.x, this.y);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function() {
	this.boundingBox = new BoundingBox(this.x, this.y, this.getTotalWidth(), this.height);
	Entity.prototype.update.call(this);
}
Tile.prototype.draw = function() {
	

	for (var i = 0; i < this.numberOfTiles; i++) {
		
		this.game.ctx.drawImage(this.spriteSheet, 
						this.frameX * this.width, this.frameY * this.height, 
						this.width, this.height, 
						this.x + (i * this.distance) - this.game.Camera.x, this.y,
						this.width, this.height);
	
	}
	

	Entity.prototype.draw.call(this);
}

Tile.prototype.getTotalWidth = function() {
	return this.x <= 0 ? (this.numberOfTiles) * this.distance + this.x : (this.numberOfTiles) * this.distance - 30;
}


/** Zombie Class.*/
function Zombie(game, spriteSheet, x, y, direction, speed) {
	this.zombieWalk = new Animation(spriteSheet.walk, spriteSheet.walk.width / 10, spriteSheet.walk.height,
										10, 0.06, 10, true, 1);	
	this.zombieWalkb = new Animation(spriteSheet.walkb, spriteSheet.walkb.width / 10, spriteSheet.walkb.height,
										10, 0.06, 10, true, 1);		
	this.zombieAttack = new Animation(spriteSheet.attack, spriteSheet.attack.width / 8, spriteSheet.attack.height,
										8, 0.06, 8, true, 1);										
	this.zombieAttackb = new Animation(spriteSheet.attackb, spriteSheet.attackb.width / 8, spriteSheet.attackb.height,
										8, 0.06, 8, true, 1);
	this.zombieDead = new Animation(spriteSheet.dead, spriteSheet.dead.width / 12, spriteSheet.dead.height,
										12, 0.06, 12, false, 1);
	this.zombieDeadb = new Animation(spriteSheet.deadb, spriteSheet.deadb.width / 12, spriteSheet.deadb.height,
										12, 0.06, 12, false, 1);
	this.zombieIdle = new Animation(spriteSheet.idle, spriteSheet.idle.width / 15, spriteSheet.idle.height,
										15, 0.06, 15, true, 1);
	this.zombieIdleb = new Animation(spriteSheet.idleb, spriteSheet.idleb.width / 15, spriteSheet.idleb.height,
										15, 0.06, 15, true, 1);		

	this.game = game;
	this.x = x;
	this.y = y;
	this.width = spriteSheet.walkb.width / 10;
	this.height = spriteSheet.walkb.height;
	this.direction = direction;
	this.walk = false;
	this.attack = false;
	this.damage = 3;
	this.hurt = false;
	this.health = 100;
	this.speed = speed;
	// this.isOnEdge = false;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	Entity.call(this, game, this.x, this.y);
}

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	
	// get current platform of the zombie
	for (var i = 0; i < this.game.platforms.length; i++) {
		var tile = this.game.platforms[i];
		if (this.boundingBox.collide(tile.boundingBox)) {
			this.currentPlatform = this.game.platforms[i];
			break;
		}

	}
	     

	if (this.game.Hero.falling || this.game.Hero.dead) {
		this.walk = false;
		this.attack = false;
		this.hurt = false;
		return;
	}
	

	
	if (this.boundingBox.left - this.game.Hero.boundingBox.right < 550 && !this.attack) {
		this.walk = true;
	}


	// zombies can't walk off the edge
	if (this.currentPlatform.boundingBox.right - this.x < 10 && this.direction === 1) {
		this.walk = false;
	} else if (this.x - this.currentPlatform.boundingBox.left < 10 && this.direction === -1) {
		this.walk = false;
	}
	
	
	if (this.boundingBox.left - this.game.Hero.boundingBox.left < 0 ) {
		this.direction = 1;
	} else {
		this.direction = -1;
	}
	
	if (this.health < 0) {
		
		this.hurt = true;
		this.walk = false;
		this.attack = false;
	}
	
	if (this.hurt && (this.zombieDeadb.isDone() || this.zombieDead.isDone())) {
		this.moan.stop();
		this.pain.play();
		this.removeZombies();
		this.game.Hero.kills++;
		this.hurt = false;
		
	}
	
	if (this.walk) {
		this.x += this.game.clockTick * this.direction * this.speed;
		this.bite.stop();
		this.moan.play();
	} 

	if (this.direction === -1) {
		if (this.boundingBox.collide(this.game.Hero.boundingBox)
			&& this.game.Hero.boundingBox.right - this.boundingBox.right < 10) {
			this.walk = false;
			this.attack = true;
			
			
		}
	} else {
		if (this.boundingBox.collide(this.game.Hero.boundingBox)
			&& this.game.Hero.boundingBox.left - this.boundingBox.right > 10) {
			this.walk = false;
			this.attack = true;
		
		}
	}
	
	if (this.attack && !this.hurt) {
		this.moan.play();
		this.pain.stop();
		this.bite.play();
		
		if (this.direction === 1) {
			if (!this.boundingBox.collide(this.game.Hero.boundingBox)) {
				this.attack = false;
				this.walk = true;
			} 
		} else {
			if (!this.boundingBox.collide(this.game.Hero.boundingBox)
					&& Math.abs(this.game.Hero.boundingBox.right - this.boundingBox.left) > 70) {
				this.attack = false;
				this.walk = true;
			} 
		}
		
	}
	
	Entity.prototype.update.call(this);
}


Zombie.prototype.draw = function() {
	
	
	if (this.walk) {
		this.drawAnimation(this.zombieWalk, this.zombieWalkb);
	} else if (this.attack) {
		this.drawAnimation(this.zombieAttack, this.zombieAttackb);
	} else if (this.hurt) {
		this.drawAnimation(this.zombieDead, this.zombieDeadb);
	} else this.drawAnimation(this.zombieIdle, this.zombieIdleb);
	Entity.prototype.draw.call(this);
}


/** Helper method to draw animation.*/
Zombie.prototype.drawAnimation = function(rightAnimation, leftAnimation) {
	if (this.direction === 1) rightAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.Camera.x, this.y);
	else leftAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.Camera.x, this.y);
}

/** Helper method to remove zombies.*/
Zombie.prototype.removeZombies = function() {
	this.removeFromWorld = true;
	for (var i = 0; i < this.game.zombies.length; i++) {
		var zombie = this.game.zombies[i];
		if (this === zombie) {
			this.game.zombies.splice(i, 1);
		}
	}
}


/** Bullet Class.*/
function Bullet(game, spriteSheet, x, y, direction) {
	this.animationBullet = new Animation(spriteSheet, spriteSheet.width, spriteSheet.height,
											1, 0.05, 1, true, 1);
	this.game = game;
	this.x = x;
	this.y = y;
	this.originX = x;
	this.speed = 300;
	this.maxDistance = 180;
	this.damage = 10;
	this.width = spriteSheet.width;
	this.height = spriteSheet.height;
	this.direction = direction;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	Entity.call(this, game, this.x, this.y);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
	this.x += this.direction * this.speed * this.game.clockTick;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	var distance = Math.abs(this.x - this.originX);
	
	if (distance > this.maxDistance) {
		this.removeBullet();
	} else {
		for (var i = 0; i < this.game.zombies.length; i++) {
			var zombie = this.game.zombies[i];
			if (zombie.direction === -1) {
				if (this.boundingBox.collide(zombie.boundingBox) 
					&& this.boundingBox.right - zombie.boundingBox.left > 50) {
					zombie.health -= this.damage;
					this.removeBullet();
				}
			} else {
				if (this.boundingBox.collide(zombie.boundingBox) 
					&& this.boundingBox.right - zombie.boundingBox.left < 50) {
					zombie.health -= this.damage;
					this.removeBullet();
				}
			}
			
		}
	}
	
	
	
	Entity.prototype.update.call(this);
}

Bullet.prototype.draw = function() {
	
	this.animationBullet.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.Camera.x, this.y);
	
	Entity.prototype.draw.call(this);
}

/** Helper method to remove bullets.*/
Bullet.prototype.removeBullet = function() {
	this.removeFromWorld = true;
	for (var i = 0; i < this.game.bullets.length; i++) {
		var bullet = this.game.bullets[i];
		if (this === bullet) {
			this.game.bullets.splice(i, 1);
		}
	}
}




/** Hero Class.*/
function Hero(game, animationSprites, x, y) {
	this.animationFall = new Animation(animationSprites.jump, animationSprites.jump.width / 5, animationSprites.jump.height, 
													5, 0.8, 5, true, 1);
	this.animationFallb = new Animation(animationSprites.jumpb, animationSprites.jumpb.width / 5, animationSprites.jumpb.height, 
													5, 0.8, 5, true, 1);
	this.animationStand = new Animation(animationSprites.idle, animationSprites.idle.width / 8, animationSprites.idle.height, 
													8, 0.045, 8, true, 1);
													
	this.animationStandb = new Animation(animationSprites.idleb, animationSprites.idleb.width / 8, animationSprites.idleb.height, 
													8, 0.045, 8, true, 1);												
	this.animationWalk = new Animation(animationSprites.walk, animationSprites.walk.width / 14, 
													animationSprites.walk.height, 
													14, 0.045, 14, true, 1);
	this.animationWalkb = new Animation(animationSprites.walkb, animationSprites.walkb.width / 14, 
													animationSprites.walkb.height, 
													14, 0.045, 14, true, 1);
	this.animationJump = new Animation(animationSprites.jump, animationSprites.jump.width / 5, 
													animationSprites.jump.height, 
													5,  0.25, 5, false, 1);
	this.animationJumpb = new Animation(animationSprites.jumpb, animationSprites.jumpb.width / 5, 
													animationSprites.jumpb.height, 
													5, 0.25, 5, false, 1);												
	
	this.animationStandFire = new Animation(animationSprites.standFire, animationSprites.standFire.width / 5, 
													animationSprites.standFire.height, 
													5, 0.05, 5, true, 1);
	
	this.animationStandFireb = new Animation(animationSprites.standFireb, animationSprites.standFireb.width / 5, 
													animationSprites.standFireb.height, 
													5, 0.05, 5, true, 1);
	
	this.animationWalkFire = new Animation(animationSprites.walkFire, animationSprites.walkFire.width / 14, 
													animationSprites.walkFire.height, 
													14, 0.045, 14, true, 1);
	this.animationWalkFireb = new Animation(animationSprites.walkFireb, animationSprites.walkFireb.width / 14, 
													animationSprites.walkFireb.height, 
													14, 0.045, 14, true, 1);												
	
	
	this.animationJumpFire = new Animation(animationSprites.jumpFire, animationSprites.jumpFire.width / 5, 
													animationSprites.jumpFire.height, 
													5, 0.05, 5, true, 1);
	
	this.animationJumpFireb = new Animation(animationSprites.jumpFireb, animationSprites.jumpFireb.width / 5, 
													animationSprites.jumpFireb.height, 
													5, 0.05, 5, true, 1);
													
	this.animationHurt = new Animation(animationSprites.hurt, animationSprites.hurt.width / 6, 
													animationSprites.hurt.height, 
													6, 0.05, 6, true, 1);	
	this.animationHurtb = new Animation(animationSprites.hurtb, animationSprites.hurtb.width / 6, 
													animationSprites.hurtb.height, 
													6, 0.05, 6, true, 1);	

	this.animationDead = new Animation(animationSprites.dead, animationSprites.dead.width / 13, 
													animationSprites.deadb.height, 
													13, 0.08, 13, false, 1);	
	this.animationDeadb = new Animation(animationSprites.deadb, animationSprites.deadb.width / 13, 
													animationSprites.deadb.height, 
													13, 0.08, 13, false, 1);	
	this.width = animationSprites.jump.width / 5;
	
	
	this.height = animationSprites.jump.height - 30;
	this.game = game;
	this.animationSprites = animationSprites;
	this.direction = 1;
	this.speed = 100;
	this.health = 100;
	this.falling = true;
	this.walk = false;
	this.jump = false;
	this.shoot = false;
	this.hurt = false;
	this.dead = false;
	this.kills = 0;
	this.jumpHeight = 200;
	this.currentPlatform = null;
	
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	
	Entity.call(this, game, x, y);
	
}

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

Hero.prototype.reset = function() {
	this.falling = true;
	this.x = 0;
	this.y = 0;
	this.game.Camera.x = 0;
	this.speed = 100;
	this.direction = 1;
	this.health = 100;
	this.kills = 0;
	this.walk = false;
	this.jump = false;
	this.shoot = false;
	this.hurt = false;
	this.dead = false;
	this.game.clockTick = 0;
	// Entity.prototype.draw.call(this.draw);
}


Hero.prototype.update = function() {
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	
	if (this.game.wave2) this.game.wave2 = false;
	
	if (this.kills === 20) {
		this.game.wave2 = true;
		this.game.wave1 = false;
		this.game.createWaveTwo();
	}
	
	
	if (this.health < 1) {
		this.dead = true;
		this.hurt = false;
		this.jump = false;
		this.walk = false;
		this.shoot = false;
		this.game.gameOver = true;
		this.painSound.play();
	}
	
	if (this.dead && (this.animationDead.isDone() || this.animationDeadb.isDone() || this.falling)) {
		this.removeFromWorld = true;
		backgroundMusic.stop();
	}
	
	// free falling
	if (this.falling) {
		
		this.y += this.game.clockTick / this.animationFall.totalTime * 6 * this.jumpHeight;
		// this.x += 2;
		for (var i = 0; i < this.game.platforms.length; i++) {
			var tile = this.game.platforms[i];
			if (this.boundingBox.collide(tile.boundingBox)) {
				this.y = tile.boundingBox.top - this.height + 10;
				// this.x += 2;
				
				this.currentPlatform = tile;
				this.falling = false;
				this.jump = false;
				this.animationJump.elapsedTime = 0;
				this.animationJumpb.elapsedTime = 0;
				this.game.wave1 = false;
				break;
				
			}
		}
		this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
		
	} 
	
	// walking
	if (this.walk && !this.jump && !this.shoot) {
		
		this.handleWalkingAnimation();

	}
	
	// walk and shoot
	if (this.walk && !this.jump && this.shoot && !this.hurt) {
		this.handleWalkingAnimation();
	}
	
	// jumping still
	if (this.jump && !this.falling) {
		
		if (this.direction === 1) this.handleJumpAnimation(this.animationJump);
		else this.handleJumpAnimation(this.animationJumpb);
	
	}
	
	// jumping and moving
	if (this.jump && this.walk && !this.falling && !this.shoot) {
		if (this.direction === 1) this.handleJumpAnimation(this.animationJump);
		else this.handleJumpAnimation(this.animationJumpb);
		
		if (this.x >= 0 ) this.x += this.direction * 5;
		else this.x = 0;
		if (this.x >= this.game.ctx.canvas.width / 2) this.game.Camera.x += this.direction * 5;
		
	}

	
	// shooting 
	if (this.shoot && !this.jump && !this.hurt) {
		
		if (this.direction === 1) this.handleShootingAnimation(this.animationStandFire, 150, 80);
		else this.handleShootingAnimation(this.animationStandFireb, 0, 80);
		
		
		
	}
	
	// shooting and jumping
	if (this.shoot && this.jump && !this.hurt) {
		
		if (this.direction === 1) this.handleShootingAnimation(this.animationJumpFire, 150, 80);
		else this.handleShootingAnimation(this.animationJumpFireb, 0, 80);
		
	}
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	// getting attacked
	for (var i = 0; i < this.game.zombies.length; i++) {
		var zombie = this.game.zombies[i];
		if (zombie.attack) {
			this.hurt = true;
			this.health -= zombie.damage * this.game.clockTick;
			break;
			
		} else this.hurt = false;
	}
	

	// fall off edge
	if (this.y > this.game.ctx.canvas.height) {
		this.y = -50;
		this.health -= 5;
	}
	
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	
	Entity.prototype.update.call(this);
}

Hero.prototype.draw = function() {
	
	
	if (this.falling) {
		this.drawAnimation(this.animationFall, this.animationFallb);
	} else if (this.hurt) {
		this.drawAnimation(this.animationHurt, this.animationHurtb);
	} else if (this.walk && !this.jump && this.shoot) {
		this.drawAnimation(this.animationWalkFire, this.animationWalkFireb);
	}else if (this.walk && !this.jump && !this.shoot) {
		this.drawAnimation(this.animationWalk, this.animationWalkb);
	} else if (this.shoot && this.jump) {
		this.drawAnimation(this.animationJumpFire, this.animationJumpFireb);
	}else if (this.jump) {
		this.drawAnimation(this.animationJump, this.animationJumpb);
	} else if(this.shoot && !this.jump) {
		this.drawAnimation(this.animationStandFire, this.animationStandFireb);
	} else if (this.dead) {
		this.drawAnimation(this.animationDead, this.animationDeadb);
	} else {
		this.drawAnimation(this.animationStand, this.animationStandb);
	}
	

	
	Entity.prototype.draw.call(this);
}

/** Helper method to handle jump animation for both directions.*/
Hero.prototype.handleJumpAnimation = function(jumpAnimation) {
		
	if (jumpAnimation.isDone()) {
		for (var i = 0; i < this.game.platforms.length; i++) {
			var tile = this.game.platforms[i];
			if (!this.boundingBox.collide(tile.boundingBox)) {
				
				this.falling = true;
				
				this.jump = false;
				jumpAnimation.elapsedTime = 0;
				break;
			}		
		}
		
		
	}

	var jumpDistance = jumpAnimation.elapsedTime / jumpAnimation.totalTime;
	var totalHeight = this.jumpHeight;

	if (jumpDistance > 0.5)
		jumpDistance = 1 - jumpDistance;
	var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
	this.y = this.base - height;
	this.previousBottom = this.boundingBox.bottom;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	
	for (var i = 0; i < this.game.platforms.length; i++) {
		var tile = this.game.platforms[i];
		if (this.boundingBox.collide(tile.boundingBox) && this.previousBottom < tile.boundingBox.top) {
			this.currentPlatform = tile;
			
			this.y = this.currentPlatform.boundingBox.top - this.height + 10;
			jumpAnimation.elapsedTime = 0;
			this.jump = false;
			
		}		
	}
	
	
	
	
	
}

/** Helper method to handle shooting animation.*/
Hero.prototype.handleShootingAnimation = function(shootAnimation, offsetX, offsetY) {
	shootAnimation.elapsedTime += this.game.clockTick;
	var bullet;
	if (shootAnimation.elapsedTime > 0.21 && this.game.bullets.length < 5) {
		
		bullet = new Bullet(gameEngine, AM.getAsset("./img/bullet1.png"), gameEngine.Hero.x + offsetX,  
										gameEngine.Hero.y + offsetY, this.direction);
		
		this.game.bullets.push(bullet);
		this.game.addEntity(bullet);
		shootAnimation.elapsedTime = 0;
		this.gunSound.play();
	}
}

/** Helper method to handle walking animation.*/
Hero.prototype.handleWalkingAnimation = function() {
	if (this.x >= 0) {
			this.x += this.direction * this.speed * this.game.clockTick;
	} else this.x = 0;
	
	if (this.x >= this.game.ctx.canvas.width / 2) {
		this.game.Camera.x += this.direction * this.speed * this.game.clockTick;
	} 
	this.boundingBox = new BoundingBox(this.x, this.y, this.width - 100, this.height);
	
	var isOnPlatform = false;
	for (var i = 0; i < this.game.platforms.length; i++) {
		var tile = this.game.platforms[i];
		if (this.boundingBox.collide(tile.boundingBox)) {
			this.currentPlatform = tile;
			isOnPlatform = true;
			break;
		}
	}

	if (!isOnPlatform) {
		this.falling = true;
	}
	
	
}


/** Helper method to draw each type of animations frame for both directions.*/
Hero.prototype.drawAnimation = function (rightAnimation, leftAnimation) {
	if (this.direction === 1) {
		rightAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.Camera.x, this.y);
	} else leftAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.game.Camera.x, this.y);
}

