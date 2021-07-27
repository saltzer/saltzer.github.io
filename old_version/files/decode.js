class Fallout{
	constructor(element, opt){
		this.element = element;
		this.origins = element.textContent.split('');
		this.opt = {
			...Fallout.defaults(),
			...opt
		}
		this.init();
	}

	static defaults(){
		return {
			gibberish : ["*", "#", "?", "&", "@", "/", "%"],
			duration : 950,
		}
	}

	static randomIndex(array){
		return Math.floor(Math.random() * array.length);
	}

	randomGibberish(){
		return this.opt.gibberish[Fallout.randomIndex(this.opt.gibberish)];
	}

	init(){
		this.fakes();
		this.start();
	}

	fakes(){
		this.element.textContent = this.origins.map((char) => char = this.randomGibberish()).join('');
	}

	start(){
		this.interval = setInterval(() => this.replace(), this.opt.duration/this.origins.length);
	}

	stop(){
		clearInterval(this.interval);
	}

	replace(){
		const current = this.element.textContent.split('');
		const chars = current.map((value, index) => {if (this.opt.gibberish.indexOf(value) > -1) return index;} ).filter((value) => value != undefined );
		if (!chars.length) this.stop();
		const randomIndex = Fallout.randomIndex(chars);
		const randomGibberish = chars[randomIndex];
		const realChar = this.origins[randomGibberish];
		current[randomGibberish] = realChar;
		chars.splice(randomIndex, 1);
        for (let i = 0; i < chars.length; i++) current[chars[i]] = this.randomGibberish();
        this.element.textContent = current.join("");
	}
	
}

const pipboys = document.querySelectorAll("[data-action=fallout], [data-action=sk]");
if (pipboys.length) Array.prototype.forEach.call(pipboys, (pipboy) => {
	const fallouts = pipboy.querySelectorAll(pipboy.dataset.fallout);
	if (fallouts.length) Array.prototype.forEach.call(fallouts, (fallout) => new Fallout(fallout) );
});
