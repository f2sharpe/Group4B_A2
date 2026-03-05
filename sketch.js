let state = "menu";
let level = 1;

let player;

let tasks = [];
let distractions = [];

let focus = 100;
let timer = 70;

function setup() {
  createCanvas(1000, 650);
  player = new Player();
  initLevel();
}

function draw() {
  if (state === "menu") drawMenu();
  if (state === "game") runGame();
  if (state === "win") drawWin();
  if (state === "lose") drawLose();
}

function drawMenu() {
  background(20);

  fill(255);
  textAlign(CENTER);

  textSize(50);
  text("FOCUS FRENZY", width / 2, 220);

  textSize(20);
  text("Move with WASD", width / 2, 300);
  text("Hover over tasks to complete them", width / 2, 330);
  text("Avoid distractions draining your focus", width / 2, 360);

  text("Press SPACE to start", width / 2, 420);
}

function keyPressed() {
  if (key === " " && state === "menu") {
    state = "game";
  }
}

function runGame() {
  drawLevelMap();

  player.update();
  player.draw();

  drawTasks();
  drawDistractions();

  spawnDistractions();

  drawUI();

  timer -= deltaTime / 1000;

  if (timer <= 0 || focus <= 0) {
    state = "lose";
  }

  if (tasks.every((t) => t.done)) {
    level++;

    if (level > 3) {
      state = "win";
    } else {
      initLevel();
    }
  }
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

    this.x = constrain(this.x, 40, width - 40);
    this.y = constrain(this.y, 60, height - 40);
  }

  draw() {
    push();

    translate(this.x, this.y);

    fill(255, 100, 100);
    ellipse(0, 0, 35, 45);

    fill(200);
    rect(-10, 10, 20, 10);

    fill(150, 220, 255);
    ellipse(6, -5, 18, 12);

    pop();
  }
}

function initLevel() {
  tasks = [];
  distractions = [];

  timer = 70;
  focus = 100;

  for (let i = 0; i < 6 + level; i++) {
    tasks.push({
      x: random(120, width - 120),
      y: random(150, height - 120),

      done: false,
    });
  }
}

function drawTasks() {
  for (let t of tasks) {
    if (!t.done) {
      let d = dist(player.x, player.y, t.x, t.y);

      if (d < 40) {
        t.done = true;
      }

      fill(0, 255, 120);
      rect(t.x, t.y, 40, 40, 8);

      fill(0);
      textSize(12);
      text("Task", t.x + 20, t.y + 60);
    }
  }
}

function spawnDistractions() {
  if (frameCount % 90 === 0) {
    distractions.push({
      x: random(width),
      y: random(height),
      size: 70,
      life: 200,
    });
  }
}

function drawDistractions() {
  for (let d of distractions) {
    fill(255, 60, 60);

    ellipse(d.x, d.y, d.size);

    fill(255);

    textSize(14);
    text("!", d.x, d.y + 5);

    if (dist(player.x, player.y, d.x, d.y) < 60) {
      focus -= 0.3;
    }

    d.life--;
  }

  distractions = distractions.filter((d) => d.life > 0);
}

function drawUI() {
  fill(255);

  textSize(18);

  text("Level " + level, 80, 30);

  text(
    "Tasks " + tasks.filter((t) => t.done).length + "/" + tasks.length,
    220,
    30,
  );

  text("Time " + ceil(timer), 380, 30);

  text("Focus", 540, 30);

  fill(100);
  rect(600, 20, 200, 16);

  fill(0, 255, 150);
  rect(600, 20, focus * 2, 16);
}

function drawLevelMap() {
  if (level === 1) {
    background(90, 150, 210);

    drawRoom(150, 200, 300, 200);
    drawRoom(550, 200, 300, 200);
  }

  if (level === 2) {
    background(160, 120, 200);

    drawRoom(120, 150, 250, 250);
    drawRoom(420, 150, 250, 250);
    drawRoom(720, 150, 250, 250);
  }

  if (level === 3) {
    background(220, 140, 100);

    drawRoom(120, 150, 300, 250);
    drawRoom(520, 150, 300, 250);
  }
}

function drawRoom(x, y, w, h) {
  fill(230);
  rect(x, y, w, h, 10);

  stroke(150);
  line(x, y + 50, x + w, y + 50);
  noStroke();
}

function drawWin() {
  background(20);

  fill(255);

  textSize(40);

  text("YOU MADE IT THROUGH!", width / 2, 260);

  textSize(20);

  text("ADHD can feel like constant interruptions.", width / 2, 320);
}

function drawLose() {
  background(20);

  fill(255);

  textSize(40);

  text("OVERWHELMED", width / 2, 260);

  textSize(20);

  text("Too many distractions drained your focus.", width / 2, 320);
}
