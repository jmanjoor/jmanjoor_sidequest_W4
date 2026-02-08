class Door {
  constructor({ x, y, w, h }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    noStroke();
    fill(40);
    rect(this.x, this.y, this.w, this.h, 6);
    pop();
  }

  overlapsPlayer(player) {
    // player approx as rectangle
    const px = player.x - player.r;
    const py = player.y - player.r;
    const pw = player.r * 2;
    const ph = player.r * 2;

    return (
      px < this.x + this.w &&
      px + pw > this.x &&
      py < this.y + this.h &&
      py + ph > this.y
    );
  }
}
