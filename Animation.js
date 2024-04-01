
let variable = 0;
let mouseWidth = 3;
let gravity = 4;
let maxV = 3;

// function setup() {
//     noCursor();
//     var canvas = createCanvas(windowWidth, windowHeight);
//     canvas.parent("outerDiv");
//     userSelectDefault = document.body.style.userSelect;

// }

// function draw() {
//     variable += 2;
//     variable = variable % 510;
//     fill(variable);
//     stroke(variable);
//     if (variable > 255) {
//         fill(510-variable);
//         stroke(510-variable)
//     }
//     strokeWeight(mouseWidth*2);
//     line(pmouseX, pmouseY, mouseX, mouseY);

// }

let angle = 0;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("outerDiv");
    userSelectDefault = document.body.style.userSelect;
    cam1 = createCamera();
    cam1.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
    cam1.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
}

function draw() {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let v = createVector(dx, dy, 0);
    v.div(100);
    // v.normalize();
    directionalLight(255,255,0, v)


    background(175);

    // directionalLight(0,255, 0, 1,0,0);
    // directionalLight(255,0,0,0,1,0);
    // directionalLight(0,0,255,-1,0,1);
    // pointLight(0,0, 255, 0, -300, 200);
    // ambientLight(0, 255, 255);

    ambientMaterial(255,25,255);
    noStroke();
    // plane(200,200);
    box(10);
    angle += 0.007;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    document.body.style.userSelect = "none"; 
}

class ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.a = 0;
        this.v = Math.random()*maxV;
        this.t = Math.random()*360;
    }

    update() {
        this.a += this.v * Math.sin(this.t);
        this.x += this.v 
    }

    display() {
        fill(100);
        ellipse(this.x, this.y, this.r);
    }
}