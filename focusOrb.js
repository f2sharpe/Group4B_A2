class FocusOrb {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.anim = random(100);
  }

  update() {
    this.anim += 0.1;

    // move away from player
    let dx = this.x - player.x;
    let dy = this.y - player.y;

    this.x += dx * 0.01;
    this.y += dy * 0.01;
  }

  draw() {
    let pulse = sin(this.anim) * 5;

    stroke(0, 255, 255);
    strokeWeight(3);
    noFill();

    ellipse(this.x, this.y, 35 + pulse);

    fill(0, 255, 255);
    noStroke();

    textSize(18);
    textAlign(CENTER);
    text("+", this.x, this.y + 6);

    if (dist(player.x, player.y, this.x, this.y) < 40) {
      focus = min(100, focus + 25);

      this.collected = true;

      spawnParticles(this.x, this.y);
    }
  }
}
