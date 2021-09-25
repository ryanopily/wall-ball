function aabb(rect1, rect2) {
	let collideX = false, collideY = false;

	if (rect1.x + rect1.dx < rect2.x + rect2.width &&
	   rect1.x + rect1.width + rect1.dx > rect2.x) collideX = true;
	   
	if(rect1.y + rect1.dy < rect2.y + rect2.height &&
	   rect1.y + rect1.height + rect1.dy> rect2.y) collideY = true;
	  
	return {'collision': collideX && collideY};
}
