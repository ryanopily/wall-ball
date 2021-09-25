function stage_bounds(width, height) {

	let left = {'x': -50, 'y': -50, 'width': 50, 'height': height + 100};
	let right = {'x': width, 'y': -50, 'width': 50, 'height': height + 100};
	let top = {'x': 0, 'y': -50, 'width': width, 'height': 50};
	let bottom = {'x': 0, 'y': height, 'width': width, 'height': 50};
	
	return {'paddle': [left, right], 'ball': [left, right, bottom], 'goal': top};
}