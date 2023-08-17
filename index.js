// ************************************
// ************************************
// ************************************
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const enemyHealth = document.getElementById("health--enemy");
const playerHealth = document.getElementById("health--player");
const liveScore = document.querySelector(".container-score");
const resultLabel = document.querySelector(".div-result-label");

// Canvas width, height, background
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
let lastkey;
const gravity = 0.7;

// *************************
// ******  OBJECTS  ********
// *************************
const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: "./img/background.png",
});

const shop = new Sprite({
	position: { x: 600, y: 128 },
	imageSrc: "./img/shop.png",
	scale: 2.75,
	maxFrames: 6,
});
const player = new Fighter({
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	offset: { x: 0, y: 0 },
	imageSrc: "./img/samuraiMack/Idle.png",
	framesMax: 8,
	scale: 2.5,
	offset: { x: 215, y: 157 },
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8,
		},
		run: {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2,
		},
		fall: {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6,
		}, takeHit: {
			imageSrc: './img/samuraiMack/Take hit - white silhouette.png',
			framesMax: 4,
		},
		Death: {
			imageSrc: './img/samuraiMack/Death.png',
			framesMax: 6,
		},
	},
	attackBox: {
		offset: {
			x: 100, y: 50,
		}, width: 160, height: 50,
	}
});
const enemy = new Fighter({
	position: { x: 400, y: 200 },
	velocity: { x: 0, y: 0 },
	color: "blue",
	offset: { x: -50, y: 0 },
	// -----
	imageSrc: "./img/kenji/Idle.png",
	framesMax: 4,
	scale: 2.5,
	offset: { x: 215, y: 167 },
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4,
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2,
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4,
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3,
		},
		Death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7,
		},
	},
	attackBox: {
		offset: {
			x: -170, y: 50,
		}, width: 170, height: 50,
	}
});

// key pressed status
const keys = {
	a: { pressed: false },
	d: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowRight: { pressed: false },
};

decreaseTimer();
player.draw();
enemy.draw();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	background.update();
	shop.update();
	c.fillStyle = `rgba(255,255,255,0.15)`;
	c.fillRect(0,0,canvas.width,canvas.height)
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;


	// player movement and sprite change
	if (keys.a.pressed && player.lastkey === "a") {
		player.switchSprite('run');
		player.velocity.x = -5;
	} else if (keys.d.pressed && player.lastkey === "d") {
		player.switchSprite('run');
		player.velocity.x = 5;
	} else {
		// default status: {idle not running}
		player.switchSprite('idle');
	}
	if (player.velocity.y < 0)
		player.switchSprite('jump');
	else if (player.velocity.y > 0)
		player.switchSprite('fall');


	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
		enemy.switchSprite('run');
		enemy.velocity.x = -5;
	} else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
		enemy.switchSprite('run');
		enemy.velocity.x = 5;
	} else {
		enemy.switchSprite('idle')
	}
	if (enemy.velocity.y < 0)
		enemy.switchSprite('jump');
	else if (enemy.velocity.y > 0)
		enemy.switchSprite('fall');

	// collision or attack player
	if (
		rectangularCollison({ rec1: player, rec2: enemy }) &&
		player.isAttacking && player.framesCurrent === 4
	) {
		// enemy.health -= 20;
		enemy.takeHit();
		player.isAttacking = false;
		// enemyHealth.style.width = enemy.health + "%";
		gsap.to('#health--enemy', { width: enemy.health + "%" })
	}
	if (player.isAttacking && player.framesCurrent === 4)
		player.isAttacking = false;

	// collision or attack enemy
	if (rectangularCollison({ rec1: enemy, rec2: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
		// player.health -= 20;
		player.takeHit();
		// playerHealth.style.width = player.health + "%";
		gsap.to('#health--player', { width: player.health + "%" })

	}
	if (enemy.isAttacking && enemy.framesCurrent === 2)
		enemy.isAttacking = false;


	// Any player lost before timer
	if (player.health <= 0 || enemy.health <= 0) {
		resultLabel.innerText = result({ player, enemy, timerId });
	}

}
animate();

// Move player and enemy
window.addEventListener("keydown", (e) => {
	if (!player.Death)
		switch (e.key) {
			// move player
			case "d":
				keys.d.pressed = true;
				player.lastkey = "d";
				break;
			case "a":
				keys.a.pressed = true;
				player.lastkey = "a";
				break;
			case "w":
				player.velocity.y = -20;
				break;
			case " ":
				player.attack();
				break;
		}
	// move enemy
	if (!enemy.Death)
		switch (e.key) {
			case "ArrowRight":
				keys.ArrowRight.pressed = true;
				enemy.lastkey = "ArrowRight";
				break;
			case "ArrowLeft":
				keys.ArrowLeft.pressed = true;
				enemy.lastkey = "ArrowLeft";
				break;
			case "ArrowUp":
				enemy.velocity.y = -20;
				break;
			case "Control":
				enemy.attack();
				break;
		}
});
// Stop player and enemy
window.addEventListener("keyup", (e) => {
	switch (e.key) {
		// stop player
		case "d":
			keys.d.pressed = false;
			break;
		case "a":
			keys.a.pressed = false;
			break;

		// stop enemy
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
	}
});
