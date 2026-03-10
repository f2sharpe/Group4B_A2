let state = "menu";
let level = 1;

let player;

let tasks = [];
let distractions = [];

let focus = 100;
let timer = 60;

let activeTask = null;
let sequence = [];
let progress = 0;

let particles = [];
let focusOrbs = [];
let shake = 0;

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

function runGame() {
  push();

  translate(random(-shake, shake), random(-shake, shake));
  drawLevelMap();

  player.update();
  player.draw();

  for (let t of tasks) {
    t.draw();
    t.checkHover();
  }

  spawnDistractions();

  for (let d of distractions) {
    d.update();
    d.draw();
  }

  drawTaskPanel();
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

  for (let p of particles) {
    p.update();
    p.draw();
  }

  particles = particles.filter((p) => p.life > 0);

  if (frameCount % 900 === 0) {
    focusOrbs.push(
      new FocusOrb(random(100, width - 100), random(100, height - 100)),
    );
  }

  for (let o of focusOrbs) {
    o.update();
    o.draw();
  }

  focusOrbs = focusOrbs.filter((o) => !o.collected);

  pop();

  shake *= 0.9;
}

function initLevel() {
  tasks = [];
  distractions = [];

  timer = 70;
  focus = 100;

  for (let i = 0; i < 3 + level; i++) {
    tasks.push(
      new Task(
        random(150, width - 150),
        random(150, height - 150),
        random(["🧸", "📚", "✏️", "📧", "📁"]),
      ),
    );
  }
}

function spawnDistractions() {
  if (frameCount % 300 === 0) {
    distractions.push(new Distraction(random(width), random(height)));
  }
}

function mousePressed() {
  if (state === "lose") {
    if (
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > 360 &&
      mouseY < 410
    ) {
      level = 1;
      state = "menu";
      initLevel();
    }
  }
}

function keyPressed() {
  if (activeTask) {
    if (key.toUpperCase() === sequence[progress]) {
      progress++;

      if (progress >= sequence.length) {
        activeTask.done = true;
        spawnParticles(activeTask.x + 20, activeTask.y + 20);
        activeTask = null;
        player.locked = false;
      }
    } else {
      progress = 0;
    }
  }

  if (key === " " && state === "menu") {
    state = "game";
  }
}
