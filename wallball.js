import {width as screenWidth, height as screenHeight, bounds} from './data.js';
import {Application} from './pixi.min.mjs';

import Paddle from './paddle.js';
import Ball from './ball.js';

// Game objects
let paddle = new Paddle();
let ball   = new Ball(paddle);

// Inputs and toggles with their respective bindings

// input[key] is true when 'key' is being pressed
// toggle[key] is true when the action the 'key' is bound to is ready to be toggled 
// Note: both input[key] and toggle[key] are only true for 1 game clock cycle. This is when the toggle happens.

// inputBindings associate an 'inputAction' with several different keys
// you can use inputActive(inputAction) to check if an action is being performed

// toggleBindings associate an 'toggleAction' with several different keys
// you can use toggleActive(toggleAction) to check if an action is being toggled

let input = [];
let toggle = [];

let inputBindings = {
	'movePaddleRight': ['ArrowRight', 'd'],
	'movePaddleLeft' : ['ArrowLeft', 'a']
}

let toggleBindings = {
	'pause': ['p'],
}

function inputActive(id) {
	let inputKeys = inputBindings[id];
	return Object.keys(input).filter(key => input[key] && inputKeys.includes(key)).length > 0;
}

function toggleActive(id) {
	let toggleKeys = toggleBindings[id];
	let keys = Object.keys(toggle).filter(key => input[key] && toggle[key] && toggleKeys.includes(key));
	
	if(keys.length > 0) {
		toggle[keys[0]] = false;
		return true;
	}
	
	toggleKeys.forEach(key => {
			if(!input[key])
				toggle[key] = true;
	});

	return false;
}

let app = new Application({width: screenWidth, height: screenHeight});
	app.stage.addChild(paddle);
	app.stage.addChild(ball);

function defaultSetup() {
	document.body.appendChild(app.view);
	window.addEventListener("keydown", event => input[event.key] = true, false);
	window.addEventListener("keyup", event => input[event.key] = false, false);
	
	options.pause = false; 
}

let deltaTime = 0;
let options = {'pause': true};

app.ticker.add((d) => {
	if(toggleActive('pause'))
		options.pause = !options.pause;

	if(options.pause) return;
		
	deltaTime = d;
	
	if(inputActive('movePaddleRight'))
		paddle.right();
		
	if(inputActive('movePaddleLeft'))
		paddle.left();

	ball.move();
});

export {app, ball, paddle, inputBindings, inputActive, toggleBindings, toggleActive, options, defaultSetup};

