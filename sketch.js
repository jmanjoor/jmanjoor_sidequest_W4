/*
Week 4 — Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026
*/

let data; // raw JSON data
let levelIndex = 0;

let coinsCollected = 0;
let totalCoins = 0;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

function preload() {
  data = loadJSON("levels.json");
}

function setup() {
  // IMPORTANT: create a canvas ONCE before calling resizeCanvas later
  createCanvas(640, 360);

  player = new BlobPlayer();
  loadLevel(0);

  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  world.drawWorld();

  // Update player physics/collisions
  player.update(world.platforms);

  // Collect coins (ONLY once)
  for (const c of world.coins) {
    if (c.tryCollect(player)) coinsCollected++;
  }

  // Door unlock condition (reliable)
  const allCoinsCollected =
    world.coins.length > 0 && world.coins.every((c) => c.collected);

  // Next level when door reached
  if (allCoinsCollected && world.door && world.door.overlapsPlayer(player)) {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }

  player.draw(world.theme.blob);

  // HUD
  fill(0);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑ • Next: N", 10, 36);
  text(`Coins: ${coinsCollected}/${totalCoins}`, 10, 54);
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

function loadLevel(i) {
  levelIndex = i;

  world = new WorldLevel(data.levels[levelIndex]);

  // Reset per-level counters
  coinsCollected = 0;
  totalCoins = world.coins.length;

  // Resize AFTER createCanvas exists
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  player.spawnFromLevel(world);
}
