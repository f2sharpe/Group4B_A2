class SafeZone {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.spawnTime = millis();
    this.duration = 10000; // 10 seconds
  }

  update() {
    this.timeLeft = this.duration - (millis() - this.spawnTime);
  }

  draw() {
    let flashing = this.timeLeft < 3000;

    if (flashing && frameCount % 20 < 10) return;

    let col = getLevelColor();

    noFill();

    let pulse = sin(frameCount * 0.1) * 5;

    for (let i = 0; i < 3; i++) {
      stroke(red(col), green(col), blue(col), 80 - i * 20);
      strokeWeight(2 + i);

      rect(
        this.x - pulse / 2,
        this.y - pulse / 2,
        this.size + pulse,
        this.size + pulse,
      );
    }
    let isPlayerInside = this.isInside(player.x, player.y);

    for (let i = 0; i < 3; i++) {
      stroke(red(col), green(col), blue(col), 80 - i * 20);

      if (isPlayerInside) {
        strokeWeight(4 + i); // thicker when inside
      } else {
        strokeWeight(2 + i);
      }

      rect(
        this.x - pulse / 2,
        this.y - pulse / 2,
        this.size + pulse,
        this.size + pulse,
      );
    }
  }

  isInside(px, py) {
    return (
      px > this.x &&
      px < this.x + this.size &&
      py > this.y &&
      py < this.y + this.size
    );
  }

  isExpired() {
    return millis() - this.spawnTime > this.duration;
  }
}
function getLevelColor() {
  if (level === 1) return color(0, 255, 180);
  if (level === 2) return color(255, 200, 0);
  if (level === 3) return color(255, 80, 120);
}
