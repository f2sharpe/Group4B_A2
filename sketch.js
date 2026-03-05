let gameStarted = false;
let player;
let tasks = [];
let currentTask = null;
let progress = 0;
let interruption = null;
let interruptionTimer = 0;

function setup() {
  createCanvas(800, 600);
  player = new Player(400, 300);

  tasks.push(new Task(150, 150, "Build Tower"));
  tasks.push(new Task(650, 150, "Color Match"));
  tasks.push(new Task(400, 450, "Find Bottle"));

  loadProgress();
}

function draw() {
  if (!gameStarted) {
    background(200);
    textAlign(CENTER);
    textSize(28);
    text("ADHD Task Game", width / 2, 200);

    textSize(18);
    text("Move with WASD or Arrow Keys", width / 2, 260);
    text("Click tasks to complete them", width / 2, 290);
    text("Interruptions will distract you!", width / 2, 320);

    text("Press SPACE to start", width / 2, 380);
    return;
  }

  background(220, 240, 255);

  drawRoom();
  player.update();
  player.display();

  tasks.forEach((task) => task.display());

  handleInterruptions();
  drawProgressBar();
}

function drawRoom() {
  fill(255);
  rect(50, 50, 700, 450);
  fill(0);
  textSize(20);
  text("Daycare - Baby Level", 60, 40);
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = 3;
  }

  update() {
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.y += this.speed;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    this.x = constrain(this.x, 70, width - 70);
    this.y = constrain(this.y, 70, height - 120);
  }

  display() {
    fill(255, 200, 200);
    ellipse(this.x, this.y, this.size);
  }
}

class Task {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.completed = false;
    this.inProgress = false;
  }

  display() {
    if (this.completed) return;

    if (this.inProgress) {
      fill(255, 255, 0); // yellow
    } else {
      fill(0, 255, 0); // green
    }

    rect(this.x - 40, this.y - 40, 80, 80);

    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(this.name, this.x, this.y + 60);
  }

  interact() {
    if (!this.completed) {
      this.inProgress = true;

      setTimeout(() => {
        this.completed = true;
        this.inProgress = false;
        progress += 10;
        saveProgress();
      }, 2000); // simulate doing task
    }
  }
}

function mousePressed() {
  tasks.forEach((task) => {
    let d = dist(mouseX, mouseY, task.x, task.y);
    if (d < 40) task.interact();
  });
}

function drawProgressBar() {
  fill(200);
  rect(100, 550, 600, 20);

  fill(0, 200, 0);
  rect(100, 550, progress * 6, 20);

  fill(0);
  textSize(16);
  text("Progress", 100, 540);

  if (progress >= 30) {
    textSize(32);
    text("Parent Pick Up! Level Complete!", 200, 300);
  }
}

function handleInterruptions() {
  if (frameCount % 600 === 0 && progress < 30) {
    interruption = random(["Crying!", "Poopoo!", "Meal Time!"]);
    interruptionTimer = 180;

    // cancel any task
    tasks.forEach((task) => {
      if (task.inProgress) {
        task.inProgress = false;
      }
    });
  }

  if (interruptionTimer > 0) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text(interruption, width / 2, 100);
    interruptionTimer--;
  }
}

function saveProgress() {
  localStorage.setItem("adhdProgress", progress);
}

function loadProgress() {
  let saved = localStorage.getItem("adhdProgress");
  if (saved) progress = int(saved);
}

function keyPressed() {
  if (key === " ") gameStarted = true;
}
