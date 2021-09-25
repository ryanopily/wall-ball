let points = 0;

if(!('best' in window.localStorage)) 
		window.localStorage['best'] = 0;

function updateScore() {
	text.text = 'Score: ' + points + '\n Best: ' + window.localStorage['best'] + ' ';
}

function addPoint() {
	if(++points > window.localStorage['best']) 
		window.localStorage['best'] = points;
	
	updateScore();
}