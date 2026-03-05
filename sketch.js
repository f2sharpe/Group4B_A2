let gameState = "menu";
let level = 1;

let player;

let tasks = [];
let distractions = [];

let focus = 100;
let timer = 60;

let dragging = null;

function setup() {
  createCanvas(1000, 650);
  player = new Player();
  initLevel();
}

function draw() {
  if (gameState === "menu") drawMenu();
  if (gameState === "game") runGame();
  if (gameState === "win") drawWin();
  if (gameState === "lose") drawLose();
}

function drawMenu() {
  background(20);

  textAlign(CENTER);

  fill(255);

  textSize(50);
  text("FOCUS FRENZY", width / 2, 220);

  textSize(20);
  text(
    "Complete tasks while distractions fight for your attention",
    width / 2,
    280,
  );

  text("WASD to move | Mouse to interact", width / 2, 320);

  text("Press SPACE to start", width / 2, 380);
}

function keyPressed() {
  if (key === " " && gameState === "menu") {
    gameState = "game";
  }
}

function runGame() {
  background(levelColors());

  player.update();
  player.display();

  drawTasks();
  drawDistractions();
  spawnDistractions();

  drawUI();

  timer -= deltaTime / 1000;

  if (timer <= 0 || focus <= 0) {
    gameState = "lose";
  }

  if (tasks.every((t) => t.done)) {
    level++;

    if (level > 3) {
      gameState = "win";
    } else {
      initLevel();
    }
  }
}

function levelColors() {
  if (level === 1) return color(80, 150, 220);
  if (level === 2) return color(180, 120, 220);
  if (level === 3) return color(220, 140, 100);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  update() {
    let speed = 4;

    if (keyIsDown(87)) this.y -= speed;
    if (keyIsDown(83)) this.y += speed;
    if (keyIsDown(65)) this.x -= speed;
    if (keyIsDown(68)) this.x += speed;

    this.x = constrain(this.x, 30, width - 30);
    this.y = constrain(this.y, 60, height - 30);
  }

  display() {
    fill(255, 220, 220);
    ellipse(this.x, this.y, 30);
  }
}

function initLevel() {
  tasks = [];
  distractions = [];
  timer = 60 + level * 10;
  focus = 100;

  for (let i = 0; i < 5 + level; i++) {
    tasks.push({
      x: random(150, width - 150),
      y: random(150, height - 150),

      done: false,

      type: random(["click", "drag"]),
    });
  }
}

function drawTasks() {
  for (let t of tasks) {
    if (!t.done) {
      if (t.type === "click") fill(0, 255, 120);
      if (t.type === "drag") fill(0, 200, 255);

      rect(t.x, t.y, 40, 40);
    }
  }
}

function mousePressed() {
  for (let t of tasks) {
    if (!t.done && dist(mouseX, mouseY, t.x, t.y) < 30) {
      if (t.type === "click") {
        t.done = true;
      } else {
        dragging = t;
      }
    }
  }
}

function mouseReleased() {
  if (dragging) {
    if (dist(mouseX, mouseY, width / 2, height - 80) < 80) {
      dragging.done = true;
    }

    dragging = null;
  }
}

function spawnDistractions() {
  if (frameCount % 100 === 0) {
    distractions.push({
      x: random(width),
      y: random(height),
      life: 120,
    });
  }
}

function drawDistractions() {
  for (let d of distractions) {
    fill(255, 60, 60);

    ellipse(d.x, d.y, 25);

    if (dist(player.x, player.y, d.x, d.y) < 40) {
      focus -= 0.2;
    }

    d.life--;
  }

  distractions = distractions.filter((d) => d.life > 0);
}

function drawUI() {
  fill(255);

  textSize(18);

  text("Level: " + level, 80, 30);

  text(
    "Tasks: " + tasks.filter((t) => t.done).length + "/" + tasks.length,
    220,
    30,
  );

  text("Time: " + ceil(timer), 380, 30);

  text("Focus", 540, 30);

  fill(200);

  rect(600, 18, 200, 16);

  fill(0, 255, 120);

  rect(600, 18, focus * 2, 16);

  fill(255);

  rect(width / 2 - 60, height - 80, 120, 40);

  fill(0);

  text("DROP ZONE", width / 2, height - 55);
}

function drawWin() {
  background(20);

  fill(255);

  textSize(40);

  text("YOU FINISHED!", width / 2, 260);

  textSize(20);

  text("Living with ADHD can mean constant distractions.", width / 2, 310);

  text("Thanks for playing.", width / 2, 340);
}

function drawLose() {
  background(20);

  fill(255);

  textSize(40);

  text("OVERWHELMED", width / 2, 260);

  textSize(20);

  text("Too many distractions drained your focus.", width / 2, 310);
}
