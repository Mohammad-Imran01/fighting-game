function result({ player, enemy, timerId }) {
	clearTimeout(timerId);
	resultLabel.style.display = "flex";

	ans = "";
	if (player.health === enemy.health) {
		ans = "Tie";
	} else if (player.health < enemy.health) {
		ans = "Players 2 wins";
	} else {
		ans = "Players 1 wins";
	}
	return ans;
}

let timer = 50,
	timerId;
function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		liveScore.innerText = timer;
	}
	if (timer < 1 || player.health <= 0 || enemy.health <= 0) {
		resultLabel.innerText = result({ player, enemy, timerId });
	}
}
function rectangularCollison({ rec1, rec2 }) {
	return (
		rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
		rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
		rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
		rec1.attackBox.position.y <= rec2.position.y + rec2.height
	);
}
