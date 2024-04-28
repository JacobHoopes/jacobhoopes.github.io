function setup() {
    drawingContext.shadowOffsetX = -20;
    drawingContext.shadowOffsetY = -10;
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'red';
    background(200);
    ellipse(width / 2, height / 2, 50, 50);
  }

function draw() {
    background(255)
    drawingContext.shadowOffsetX += random(6)- 3;
    drawingContext.shadowOffsetY += random(6)- 3;
    drawingContext.shadowBlur = random(30);
    drawingContext.shadowColor = color(random(255), random(255), random(255));
    background(0);
    ellipse(width / 2 + random(10)-5, height / 2 + random(10)-5, 50+random(10)-5, 50+random(10)-5);
}