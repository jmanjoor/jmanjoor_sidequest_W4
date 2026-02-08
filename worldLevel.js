class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name || "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme || {},
    );

    // Use JSON values as defaults, but we may auto-tune jumpV later
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    this.tileSize = levelJson.tileSize ?? 40;

    this.platforms = [];
    this.coins = [];
    this.door = null;

    const map = levelJson.map || [];
    this.mapHeight = map.length;
    this.mapWidth = map[0]?.length ?? 0;

    // Build objects from tilemap using loops (Week 4 requirement)
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

    // ----------------------------
    // AUTO-TUNE: spawn + jump reach
    // ----------------------------

    const playerR = 26; // matches your Blob default

    // Ground is the lowest platform surface
    let groundY = this.mapHeight * this.tileSize;
    if (this.platforms.length > 0) {
      groundY = Math.max(...this.platforms.map((p) => p.y + p.h));
    }

    // Spawn the player on ground near the left (always valid)
    this.start = {
      x: this.tileSize * 2,
      y: groundY - playerR - 2,
      r: playerR,
    };

    // If there are coins, make sure jump is strong enough to reach the highest one
    if (this.coins.length > 0) {
      const highestCoinY = Math.min(...this.coins.map((c) => c.y));

      // How high the player center must rise (rough, but works well)
      const neededHeight = groundY - playerR - highestCoinY;

      // Current max jump height from physics: v^2 / (2g)
      const currentMaxHeight = Math.abs(this.jumpV) ** 2 / (2 * this.gravity);

      const buffer = 30; // forgiveness so it doesn't feel pixel-perfect
      if (neededHeight + buffer > currentMaxHeight) {
        const newV = Math.sqrt(2 * this.gravity * (neededHeight + buffer));
        this.jumpV = -Math.min(newV, 25); // clamp so it doesn't get ridiculous
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
