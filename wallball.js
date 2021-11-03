import {width as screenWidth, height as screenHeight, bounds} from './data.js';
import * as PIXI from './pixi.min.mjs';

import Paddle from './paddle.js';
import Ball from './ball.js';

let app = new PIXI.Application({width: screenWidth, height: screenHeight});

let paddle = new Paddle();
	app.stage.addChild(paddle);

let ball = new Ball(paddle);
	app.stage.addChild(ball);
	
let keyboard = [];

function setup() {
	document.body.appendChild(app.view);
	window.addEventListener("keydown", event => keyboard[event.key] = true, false);
	window.addEventListener("keyup", event => keyboard[event.key] = false, false);
	
	options.pause = false; 
}

let timer = 0;

let deltaTime = 0;

let options = {'pause': true};

app.ticker.add((d) => {

	if(options.pause) return;
	
	deltaTime = d;
	
	if(keyboard['ArrowRight'])
		paddle.right();
		
	if(keyboard['ArrowLeft'])
		paddle.left();

	ball.move();
});

export {app, ball, paddle, deltaTime, setup, options, keyboard};

