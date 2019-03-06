const STATE_NAME = "lastSave";

function Database() {
	// this.socket;
	this.gameData;
	this.init();
}

Database.prototype.init = function() {
	this.socket = io.connect("http://24.16.255.56:8888"); 
	
}

Database.prototype.load = function() {
	this.socket.emit("load", { studentname: "Vecheka Chhourn", statename: STATE_NAME});
	this.socket.on("load", function (data) {
		if (gameEngine.startGame) {
			loadGame(data.data);
			gameEngine.pauseGame = false;
		} else {
			SM.downloadAll(function() {
				loadGame(data.data); 
			});
		}
		
	});
}

Database.prototype.save = function(data) {
	this.socket.emit("save", {studentname: "Vecheka Chhourn", statename: STATE_NAME, data: data});
	console.log("Saved");
}



Database.prototype.connect = function() {
	this.socket.on("connect", function () {
        console.log("Socket connected.")
    });
    
}

Database.prototype.disconnect = function() {
	this.socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    
}