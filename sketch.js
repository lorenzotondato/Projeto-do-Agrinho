let player;
let energies = [];
let phones = [];
let city;
let score = 0;
let gameOver = false;
let gameStarted = false;
let showTitle = true;
let titleOpacity = 255;
let startButton;

let drones = [];
let bullets = [];

function setup() {
  createCanvas(800, 400);
  initGame();

  startButton = createButton('▶️ START');
  startButton.position(width / 2 - 40, height / 2 + 20);
  startButton.mousePressed(() => {
    gameStarted = true;
    startButton.hide();
  });
}

function initGame() {
  player = createVector(100, height - 60);
  city = createVector(width - 100, height / 2);
  score = 0;
  gameOver = false;
  gameStarted = false;
  showTitle = true;
  titleOpacity = 255;
  energies = [];
  phones = [];
  bullets = [];

  for (let i = 0; i < 7; i++) {
    energies.push(createVector(random(150, width - 150), random(50, height - 50)));
  }

  for (let i = 0; i < 6; i++) {
    phones.push({
      pos: createVector(random(200, width - 200), random(height)),
      dir: random(1) > 0.5 ? 1 : -1
    });
  }

  // Drones fixos que atiram
  drones = [
    { pos: createVector(width / 2 + 100, 100), timer: 0 },
    { pos: createVector(width / 2 + 150, 300), timer: 0 }
  ];

  if (startButton) {
    startButton.show();
    startButton.position(width / 2 - 40, height / 2 + 20);
  }

  loop();
}

function draw() {
  drawBackground();
  drawCity();

  if (showTitle) {
    textAlign(CENTER);
    textSize(40);
    fill(0, 255, 255, titleOpacity);
    text("🚀 Nave Contra a Invasão Tech 📱", width / 2, 60);
    titleOpacity -= 2;
    if (titleOpacity <= 0) showTitle = false;
  }

  if (!gameStarted) {
    drawShip(player.x, player.y);
    textSize(18);
    fill(255);
    textAlign(CENTER);
    text("Inicie a missão no Campo de Cultivo Futurista!", width / 2, height / 2 - 20);
    return;
  }

  if (gameOver) {
    textSize(32);
    fill(255, 80, 80);
    textAlign(CENTER);
    text("💥 Fim de Jogo! Pontos: " + score, width / 2, height / 2);
    textSize(20);
    fill(255);
    text("Pressione 'R' para reiniciar", width / 2, height / 2 + 40);
    noLoop();
    return;
  }

  drawShip(player.x, player.y);

  // Obstáculos: celulares
  for (let phone of phones) {
    drawPhone(phone.pos.x, phone.pos.y);
    phone.pos.y += phone.dir * 2;
    if (phone.pos.y > height || phone.pos.y < 0) phone.dir *= -1;
    if (dist(player.x, player.y, phone.pos.x + 15, phone.pos.y + 30) < 30) {
      gameOver = true;
    }
  }

  // Energias
  fill(0, 255, 255);
  for (let i = energies.length - 1; i >= 0; i--) {
    ellipse(energies[i].x, energies[i].y, 15, 15);
    drawGlow(energies[i].x, energies[i].y, 30, color(0, 255, 255, 100));
    if (dist(player.x, player.y, energies[i].x, energies[i].y) < 20) {
      energies.splice(i, 1);
      score++;
    }
  }

  // Drones e tiros
  for (let drone of drones) {
    drawDrone(drone.pos.x, drone.pos.y);
    drone.timer++;
    if (drone.timer > 90) {
      bullets.push({
        pos: createVector(drone.pos.x, drone.pos.y),
        vel: createVector(player.x - drone.pos.x, player.y - drone.pos.y).setMag(4)
      });
      drone.timer = 0;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.pos.add(b.vel);
    fill(255, 50, 50);
    ellipse(b.pos.x, b.pos.y, 8, 8);
    drawGlow(b.pos.x, b.pos.y, 15, color(255, 50, 50, 80));
    if (dist(player.x, player.y, b.pos.x, b.pos.y) < 15) {
      gameOver = true;
    }
    if (b.pos.x < 0 || b.pos.x > width || b.pos.y < 0 || b.pos.y > height) {
      bullets.splice(i, 1);
    }
  }

  // Vitória
  if (player.x > city.x && energies.length === 0) {
    textSize(28);
    fill(0, 255, 150);
    textAlign(CENTER);
    text("✅ Missão Cumprida! Cidade energizada!", width / 2, height / 2);
    noLoop();
    return;
  }

  // UI
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("Use SETAS ou W A S D para mover e colete as energias!", 10, 20);
  text("Energias: " + energies.length + " | Pontos: " + score, 10, 40);
}

function drawCity() {
  let baseX = city.x;
  let baseY = city.y;

  fill(60, 120, 255);
  rect(baseX, baseY - 80, 40, 120);
  fill(100, 200, 255);
  rect(baseX - 50, baseY - 100, 25, 160);
  rect(baseX + 50, baseY - 60, 30, 90);

  stroke(200, 255, 255);
  line(baseX + 20, baseY - 80, baseX + 20, baseY - 110);
  noStroke();
  fill(255, 0, 200);
  ellipse(baseX + 20, baseY - 115, 6, 6);

  fill(0, 255, 255, 150);
  rect(baseX - 30, baseY + 50, 100, 12, 4);
  fill(255);
  textSize(10);
  textAlign(CENTER);
  text("🌆 NEO CITY 9", baseX + 20, baseY + 60);

  drawGlow(baseX + 10, baseY + 10, 120, color(100, 200, 255, 50));
  fill(100, 200, 255);
  textSize(16);
  text("🏙️ Mega Cidade Tech", width - 180, 30);
}

function drawBackground() {
  background(10, 10, 25);

  for (let i = 0; i < width; i += 40) {
    stroke(30, 60, 90, 40);
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += 40) {
    stroke(30, 60, 90, 40);
    line(0, j, width, j);
  }

  // Campo Futurista
  fill(20, 200, 120, 100);
  rect(0, height - 80, width, 80);

  fill(50, 150, 255);
  for (let x = 60; x < 200; x += 40) {
    rect(x, height - 70, 20, 10, 3);
    drawGlow(x + 10, height - 65, 15, color(50, 150, 255, 60));
  }

  fill(120, 255, 180);
  rect(60, height - 120, 10, 40);
  rect(140, height - 110, 10, 50);
  ellipse(65, height - 125, 10, 10);
  ellipse(145, height - 115, 10, 10);
  drawGlow(65, height - 125, 20, color(0, 255, 200, 50));
  drawGlow(145, height - 115, 20, color(0, 255, 200, 50));

  fill(100, 255, 200);
  textSize(18);
  text("🌱 Campo de Cultivo Futurista", 20, height - 20);
}

function drawGlow(x, y, size, c) {
  noStroke();
  fill(c);
  ellipse(x, y, size);
}

function drawShip(x, y) {
  push();
  translate(x, y);
  fill(0, 255, 180);
  triangle(-15, 10, -15, -10, 15, 0);
  pop();
  drawGlow(x, y, 50, color(0, 255, 180, 80));
}

function drawPhone(x, y) {
  fill(60);
  rect(x, y, 30, 60, 5);
  fill(0);
  rect(x + 5, y + 10, 20, 40, 3);
  fill(255, 0, 0);
  ellipse(x + 15, y + 5, 6, 6);
}

function drawDrone(x, y) {
  fill(200);
  rect(x - 10, y - 10, 20, 20, 5);
  fill(255, 0, 100);
  ellipse(x, y, 8, 8);
  drawGlow(x, y, 30, color(255, 0, 100, 60));
}

function keyPressed() {
  if (!gameOver && gameStarted) {
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') player.y -= 20;
    if (keyCode === DOWN_ARROW || key === 's' || key === 'S') player.y += 20;
    if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') player.x -= 20;
    if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') player.x += 20;

    player.x = constrain(player.x, 0, width);
    player.y = constrain(player.y, 0, height);
  }

  if (gameOver && (key === 'r' || key === 'R')) {
    initGame();
  }
}