import {width as screenWidth, bounds} from './data.js';
import {partial_collision} from './collision.js';
import * as PIXI from './pixi.min.mjs';

class PaddleEvents {

	onMove = [];
	onBoundsCollide = [];
	
	call(listener, event) {
		for(let func of this[listener]) {
			func(event);
		}
	}
}

class Paddle extends PIXI.Graphics {
	
	constructor() {
		super();
		
		this.beginFill(0xff1f1f);
		this.drawRect(0,0,75,15);
		
		this.listener = new PaddleEvents();
		this.x = (screenWidth - this.width) / 2;
		this.y = 10;
		this.dx = 0;
		this.dy = 0;
		this.speed = 6;
		
		this.obstacle = bounds.arena;
	}
	
	#move() {
		let collide = partial_collision(this, this.obstacle);
		if(collide['collision']) {
			
			let params = {};
			
			params.x = this.obstacle.x;

			if(this.dx > 0) 
				params.x += this.obstacle.width - this.width;
				
			let event = {'event': params, 'object': this, 'canceled': false};
			this.listener.call("onBoundsCollide", event);
			
			if(!event['canceled'])
				this.x = params.x;
			
			return;
		}
		
		let params = {};
		params.x = this.x + this.dx;
		params.dx = this.dx;
		
		let event = {'event': params, 'object': this, 'canceled': false};
		this.listener.call("onMove", event);
		
		if(!event['canceled']) {
			for(let field in params)
				this[field] = params[field];
		}
	}
	
	right() {
		this.dx = this.speed;
		this.#move();
	}
	
	left() {
		this.dx = -1 * this.speed;
		this.#move();
	}
}

export default Paddle;