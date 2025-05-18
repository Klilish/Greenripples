let palette = [
  "#10002D", "#99035A", "#017A97", "#F31B86", "#53FFFF",
  "#04CED8", "#C26DAE", "#524678", "#FFC3FF", "#9AC3D7"
];

let metricLabels = [
  "Water Use",
  "Household Waste",
  "Waste Sorting",
  "Composting",
  "Non-Degradable Waste",
  "Eco Purchases",
  "Recycle Rate",
  "Energy Use",
  "Reuse Actions",
  "Repair Actions"
];

let threads = [];
let hoveredThreadIndex = -1;
let paused = false;

let canvasHeight = 750;
let legendHeight = 60;

function setup() {
  createCanvas(800, canvasHeight + legendHeight);
  noFill();
  textFont('monospace');
  textSize(12);
  strokeWeight(1.2);

  for (let i = 0; i < metricLabels.length; i++) {
    let col = color(palette[i]);
    threads.push({
      metric: metricLabels[i],
      colorA: col,
      colorB: col,
      lerpAmt: 0,
      lerpSpeed: 0,
      phase: random(TWO_PI),
      amplitude: random(30, 80),
      frequency: random(0.005, 0.02),
      baseY: map(i, 0, metricLabels.length - 1, canvasHeight * 0.2, canvasHeight * 0.8),
      speedY: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(16, 0, 45, 20);
  hoveredThreadIndex = -1;
  let hovering = false;

  // 🧵 Animate threads
  for (let i = 0; i < threads.length; i++) {
    let t = threads[i];
    let col = t.colorA;
    stroke(col);
    let foundHover = false;
    let isHovered = false;

    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = t.baseY +
        sin(x * t.frequency + t.phase) * t.amplitude +
        sin(t.phase * 0.5 + x * 0.002) * 20;
      let xOffset = sin(x * 0.005 + t.phase) * 20;
      let px = x + xOffset;
      let py = y;
      vertex(px, py);

      if (!foundHover && dist(mouseX, mouseY, px, py) < 10 && mouseY < canvasHeight) {
        hoveredThreadIndex = i;
        foundHover = true;
        hovering = true;
        isHovered = true;
      }
    }
    endShape();

    // Optional highlight if hovered
    if (isHovered) {
      strokeWeight(2);
      stroke(255, 255, 255, 80);
      noFill();
      beginShape();
      for (let x = 0; x <= width; x += 10) {
        let y = t.baseY +
          sin(x * t.frequency + t.phase) * t.amplitude +
          sin(t.phase * 0.5 + x * 0.002) * 20;
        let xOffset = sin(x * 0.005 + t.phase) * 20;
        vertex(x + xOffset, y);
      }
      endShape();
      strokeWeight(1.2);
    }

    if (!hovering) {
      t.phase += 0.01;
      t.baseY -= t.speedY;
      if (t.baseY < -100) {
        t.baseY = canvasHeight + 100;
      }
    }
  }

  // 🖱 Tooltip
  if (hoveredThreadIndex !== -1) {
    let t = threads[hoveredThreadIndex];
    let hexColor = getHexFromColor(t.colorA);
    drawTooltip(mouseX, mouseY - 30, t.metric + "\n");
  }

  paused = hovering;

  // 📘 Draw solid-bottom legend
  drawHorizontalLegend();
}

function drawHorizontalLegend() {
  let padding = 20;
  let boxSize = 12;
  let spacingX = 160;
  let startY = canvasHeight;

  // Solid background
  push();
  noStroke();
  fill(16, 0, 45); // Deep Winter background
  rect(0, canvasHeight, width, legendHeight);
  pop();

  // Legend entries
  push();
  textAlign(LEFT, CENTER);
  textSize(11);
  for (let i = 0; i < threads.length; i++) {
    let x = padding + (i % 5) * spacingX;
    let y = startY + 20 + floor(i / 5) * 20;

    fill(threads[i].colorA);
    noStroke();
    rect(x, y, boxSize, boxSize, 2);

    fill(255);
    noStroke();
    text(threads[i].metric, x + boxSize + 6, y + boxSize / 2);
  }
  pop();
}

function drawTooltip(x, y, label) {
  let lines = label.split('\n');
  let maxWidth = max(textWidth(lines[0]), textWidth(lines[1]));
  let boxHeight = lines.length * 16 + 8;

  push();
  fill(0, 200);
  stroke(255, 100);
  strokeWeight(0.5);
  rectMode(CENTER);
  rect(x, y, maxWidth + 10, boxHeight, 5);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text(lines[0], x, y - 8);
  text(lines[1], x, y + 8);
  pop();
}

function getHexFromColor(c) {
  return (
    '#' +
    hex(c.levels[0], 2) +
    hex(c.levels[1], 2) +
    hex(c.levels[2], 2)
  ).toUpperCase();
}
