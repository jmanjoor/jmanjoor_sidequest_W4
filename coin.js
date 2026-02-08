class Coin {
  constructor({ x, y, r }) {
    this.x = x;
    this.y = y;
    this.r = r ?? 10;
    this.collected = false;
  }

  draw() {
    if (this.collected) return;
    push();
    noStroke();
    fill(255, 200, 0);
    circle(this.x, this.y, this.r * 2);
    pop();
  }

  tryCollect(player) {
    if (this.collected) return false;
    const d = dist(this.x, this.y, player.x, player.y);
    if (d < this.r + player.r * 0.6) {
      this.collected = true;
      return true;
    }
    return false;
  }
}
