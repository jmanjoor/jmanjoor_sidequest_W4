class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name || "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme || {},
    );

    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    this.tileSize = levelJson.tileSize ?? 40;

    this.platforms = [];
    this.coins = [];
    this.door = null;

    // spawn away from the top coins
    this.start = { x: this.tileSize * 2, y: this.tileSize * 4, r: 26 };

    const map = levelJson.map || [];
    this.mapHeight = map.length;
    this.mapWidth = map[0]?.length ?? 0;

    for (let row = 0; row < map.length; row++) {
      const line = map[row];

      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        const x = col * this.tileSize;
        const y = row * this.tileSize;

        if (ch === "#") {
          // thin ledge at bottom of the tile cell
          this.platforms.push(
            new Platform({
              x,
              y: y + this.tileSize - 12,
              w: this.tileSize,
              h: 12,
            }),
          );
        } else if (ch === "C") {
          // coin centered, slightly raised so it doesn't sit inside the ledge
          this.coins.push(
            new Coin({
              x: x + this.tileSize / 2,
              y: y + this.tileSize / 2 - 8,
              r: 10,
            }),
          );
        } else if (ch === "D") {
          this.door = new Door({ x, y, w: this.tileSize, h: this.tileSize });
        }
      }
    }
  }

  drawWorld() {
    background(color(this.theme.bg));

    for (const p of this.platforms) p.draw(color(this.theme.platform));
    for (const c of this.coins) c.draw();

    const allCoinsCollected =
      this.coins.length > 0 && this.coins.every((c) => c.collected);

    if (allCoinsCollected && this.door) this.door.draw();
  }

  inferWidth(defaultW = 640) {
    if (!this.mapWidth) return defaultW;
    return this.mapWidth * this.tileSize;
  }

  inferHeight(defaultH = 360) {
    if (!this.mapHeight) return defaultH;
    return this.mapHeight * this.tileSize;
  }
}
