import {width as screenWidth, height as screenHeight, bounds} from './data.js';
import {aabb, partial_collision} from './collision.js';
import {Graphics} from './pixi.min.mjs';

class BallEvents {
	
	onInit = [];	
	onMove = [];
	onGoal = [];
	onPaddleCollide = [];
	onBoundsCollide = [];
	
	call(listener, event) {
		for(let func of this[listener]) {
			func(event);
		}
	}
}

class Ball extends Graphics {
	
	constructor(paddle) {
		super();
		this.beginFill(0xffffff);
		this.drawRect(0, 0, 20, 20);
		
		this.listener = new BallEvents();
		this.paddle    = paddle;
		this.goal 	   = bounds.goal;
		this.obstacle  = bounds.arena;
		
		this.#init();
	}
	
	#init() {
		let params = {};
			// Selection between 30 & 150 degrees (game canvas is first quadrant flipped over the x-axis)
			params.direction = (Math.random() * 4 * Math.PI + Math.PI) / 6;
			params.speed = 7;
			
			// Center ball & initialize velocity (dy, dx)
			params.x = (screenWidth - this.width) / 2;
			params.y = (screenHeight - this.height) / 2;
			params.dx = Math.cos(params.direction) * params.speed;
			params.dy = Math.sin(params.direction) * params.speed;
		
		let event = {'event': params, 'object': this, 'canceled': false};
		this.listener.call("onInit", event);
		
		if(!event['canceled']) {
			for(let field in params)
				this[field] = params[field];
		}
	}
	
	move() {
		if(aabb(this, this.goal)['collision']) {
			let event = {'object': this, 'canceled': false};
			this.listener.call("onGoal", event);
			
			if(!event['canceled']) 
				this.#init();
				
			return;
		}
		
		if(aabb(this, this.paddle)['collision']) {
			let params = {};
				let paddle_center = this.paddle.width / 2;
				
				// Position of ball relative to paddle center
				let x_relative = (this.x + this.dx + this.width / 2) - (this.paddle.x + this.paddle.dx + paddle_center) ;
	
				// Angle ball should bounce off paddle, defined in quadrant 2 (game canvas is first quadrant flipped over x-axis)
				let quad2angle = Math.PI * 3 / 4;
				let up = Math.PI / 2;
				
				// This equation satisfies 3 main properties
				// 1. if x is -paddle_center (left edge), ball bounces at quad2angle
				// 2. if x is 0 (middle), ball bounces at 90 degrees
				// 3. if x is +paddle_center (right edge), ball bounces at 180 degrees - quad2angle
				let direction = up + (x_relative * (up - quad2angle)) / paddle_center;

				// Increase speed by 0.5, reset to 7 if direction is within 4 degrees of 90
				params.speed = Math.min(21, this.speed + 0.5);
				
				if(Math.abs(up - direction) <= Math.PI / 45) 
					params.speed = 7;

				params.dx = Math.cos(direction) * params.speed;
				params.dy = Math.sin(direction) * params.speed;
				
				params.x = this.x + params.dx;
				params.y = this.y + params.dy;
		
			let event = {'event': params, 'object': this, 'canceled': false};
			this.listener.call("onPaddleCollide", event);
			
			if(!event['canceled']) {
				for(let field in params)
					this[field] = params[field];
			}
				
			return;
		}
		
		// partial_collision is good for keeping an object inside of an area
		let collide = partial_collision(this, this.obstacle);
		if(collide['collision']) {
			
			let params = {};
			
			if(collide['x']) {
				params.x = this.obstacle.x;
				
				if(this.dx > 0)
					params.x += this.obstacle.width - this.width;

				params.dx = this.dx * -1;
			}
			
			if(collide['y']) {
				params.y = this.obstacle.y;

				if(this.dy > 0)
					params.y += this.obstacle.height - this.height;
				
				params.dy = this.dy * -1;
			}
			
			let event = {'event': params, 'object': this, 'canceled': false};
			this.listener.call("onBoundsCollide", event);
			
			if(!event['canceled']) {
				for(let field in params)
					this[field] = params[field];
			}	
		}
		
		let params = {};
		
		params.x = this.x + this.dx;
		params.y =  this.y + this.dy;
		params.dx = this.dx;
		params.dy = this.dy;
			
		let event = {'event': params, 'object': this, 'canceled': false};
		this.listener.call("onMove", event);
		
		if(!event['canceled']) {
			for(let field in params) {
				this[field] = params[field];
			}
		}
			
	}
}

export default Ball;