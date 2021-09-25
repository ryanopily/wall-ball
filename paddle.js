	function newPaddle() {
	
		let paddle = new PIXI.Graphics();
		paddle.beginFill(0xff1f1f);
		paddle.drawRect(0, 0, 75, 15);
		
		paddle.x = (screenWidth - paddle.width) / 2;
		paddle.y += 10;
		paddle.speed = 6;
		paddle.dx = 0;
		paddle.dy = 0;
		
		paddle.move = (obstacles) => {
			for(const rect2 of obstacles) {
				if(aabb(paddle, rect2)['collision']) {
					if(paddle.dx < 0) paddle.x = rect2.x + rect2.width;
					else paddle.x = rect2.x - paddle.width;
					return;
				}
			}
			paddle.x += paddle.dx;
		};
		
		paddle.moveRight = (obstacles) => {
			paddle.dx = paddle.speed;
			paddle.move(obstacles);
		};
		
		paddle.moveLeft = (obstacles) => {
			paddle.dx = paddle.speed * -1;
			paddle.move(obstacles);
		};
		
		return paddle;
	}