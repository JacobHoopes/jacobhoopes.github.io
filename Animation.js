
let variable = 0;
let mouseWidth = 3;

function setup() {
    noCursor();
    var canvas = createCanvas(window.innerWidth,window.innerHeight);
    canvas.parent("outerDiv");
    userSelectDefault = document.body.style.userSelect;

}

function draw() {
    // background(10,10,10,1);
    variable += 2;
    variable = variable % 510;
    fill(variable);
    stroke(variable);
    if (variable > 255) {
        fill(510-variable);
        stroke(510-variable)
    }
    strokeWeight(mouseWidth*2);
    // ellipse(mouseX, mouseY, mouseWidth, mouseWidth);
    rect(width/2-20,height/2-20, 40,40)
    noCursor();
    line(pmouseX, pmouseY, mouseX, mouseY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    document.body.style.userSelect = "none"; 
}