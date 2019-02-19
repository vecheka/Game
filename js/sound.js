function Sound(sound) {
 
	this.sound = sound;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.7;

}

Sound.prototype.play = function() {
	this.sound.play();
}

Sound.prototype.stop = function() {
	this.sound.pause();
}