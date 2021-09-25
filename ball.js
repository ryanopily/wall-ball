function newBall() {

	let ball = new PIXI.Graphics();
	ball.beginFill(0xffffff);
	ball.drawRect(0, 0, 20, 20);
	
	ball.init = () => {
		// Position ball *around* the middle of the screen and set initial speed
		ball.x = (screenWidth - ball.width) / 2;
		ball.y = (screenHeight - ball.height) / 2;
		ball.speed = 7;
		
		// Set ball direction between 30 and 150 degrees
		ball.direction = ((1/6)*Math.PI)+( ((Math.random()+1)/3)*Math.PI); 
		ball.dx = Math.cos(ball.direction) * ball.speed;
		ball.dy = Math.sin(ball.direction) * ball.speed;
	};
	
	ball.move = (obstacles, paddle, goal) => {
		
		// If ball hits behind the paddle; Game over!
		if(aabb(ball, goal)['collision']) {
			points = 0;
			updateScore();
			
			ball.init();
		}

		// Ball bounces off paddle; Add point and bounce!
		if(aabb(ball, paddle)['collision']) {
			
			addPoint();
			
			let x = ball.x + ball.dx + (ball.width / 2) - paddle.x;	 // Point where the ball hit the paddle
			let step = paddle.width / 3; // Defines hit zones

			let diff = (x-(3*(step/2))); // Just a good number

			// If you hit close enough to the middle, speed resets. Otherwise, ball speeds up.
			if(Math.abs(diff) <= 4) ball.speed = 7;
			else ball.speed = Math.min(21, ball.speed + 0.5);
			
			// (kind of) 'Normalize' velocities.
			ball.dx = (diff)/(step/3);
			ball.dy = Math.sqrt(Math.pow(ball.speed, 2) - Math.pow(ball.dx, 2));

			// Update position - if we don't do this, it's possible that the ball could get stuck in the paddle.
			ball.x += ball.dx;
			ball.y += ball.dy;
			
			return;
		}
		
		// Create two balls based of velocity components
		let ballX = {'x': ball.x, 'y': ball.y, 'width': ball.width, 'height': ball.height, 'dx': ball.dx, 'dy': 0};
		let ballY = {'x': ball.x, 'y': ball.y, 'width': ball.width, 'height': ball.height, 'dx': 0, 'dy': ball.dy};

		for(const rect2 of obstacles) {
			if(aabb(ball, rect2)['collision']) {
				
				// Checks X component for collision
				if(aabb(ballX,rect2)['collision']) {
					if(ballX.dx < 0) ball.x = rect2.x + rect2.width;
					else ball.x = rect2.x - ball.width;
					
					ball.dx *= -1;
				}
				
				// Checks Y component for collision
				if(aabb(ballY,rect2)['collision']) {
					if(ballY.dy < 0) ball.y = rect2.y + rect2.height;
					else ball.y = rect2.y - ball.height;
					
					ball.dy *= -1;
				}
			}
			
		}
		
		ball.x += ball.dx;
		ball.y += ball.dy;

		if(ball.y > screenHeight)
			ball.y = 0 + ball.height;
		
		else if(ball.y < 0)
			ball.y = screenHeight;

	};

	ball.init();

	return ball;
}