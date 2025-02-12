var camX = 0;
var camY = 0;
var camZ = 0;
var camTilt = 0;
var maxCamTilt = Math.PI / 2.001; // div by 2.001 limits view to straight up and down
var camPan = 0;

// settings for pc
var moveSpeed = 4;
var turnSpeed = 0.03;

// settings for mobile
var touchSensitivity = 0.004;
var zoomSensitivity = 2;

// jump settings
let initialJumpVelocity = 6; // initial jump velocity
let jumpVelocity = 0; // How many pixels the camera should move vertically while in the air each time step
let gravity = -0.4; // Number of pixels the jumpVelocity changes by each time step
let standHeight = 150;
let groundHeight = 50;

// helpful settings for movement
var previousTouch = [];
var pinchDistance = 0;
let midX = "none";
let midY = "none";
let viewState = "none";

let cam;

let boxes = [];

let wallOffset = 10; // The minimum distance from the camera to any wall

let img;
let dome;
let dome2;
let arches;
let Scale = -20;

let viewX, viewY, viewZ;
// let camTexture2;
let s = 200;


let fraction = 0.5; // the fraction of the width of the screen taken up by the strange rect
let rows = 1 // the number of rows of arches-blocks there are
let numBoxes = 0

let roomRadius = 350; // room radius is 400
let hallWidth = 10;

let lightColor = color(255,255,255);

function preload() {
    arches = loadModel('./assets/arches.obj');
    room = loadModel('./assets/room-simple.obj');
    hall = loadModel('./assets/hall-simple.obj');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    
    canvas.parent("outerDiv");
    cam = createCamera();
    cam.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));
    setCamera(cam);

    stroke(color(0,0,0));
    strokeWeight(1);
    // noStroke();
    fill(color(73,104,65));
    emissiveMaterial(color(73,104,65));
    // brightness(255);
    // color(red);
    // lights();
    lightFalloff(1,0.0000,0.000004) //0.1,0,0.000009 works okay

}

function draw() {
    background(255);

    updateCamera();

    scale(Scale);

    model(room);
    push()
    for (let i = 0; i < 5; i++) {
        push()
        rotateY(TWO_PI / 5 * i);
        translate(30,0,0);
        model(hall);
        translate(20,0,0);
        model(hall);
        translate(30,0,0);
        rotateY(TWO_PI / 5 * (i+1.5));
        model(room);
        for(let j = 0; j < 2; j++) {
            push();
            rotateY(TWO_PI / 5 * (-i-2+j));
            translate(30,0,0);
            model(hall);
            translate(20,0,0);
            model(hall);
            pop();
        }
        pop();
    }
    pop()

    // values to help movement on mobile devices
    if (touches.length === 0) {
        previousTouch = [];
        // newPinchDistance = 0;
        pinchDistance = 0;
        midX = "none";
        midY = "none";
        viewState = "none";
    }
}

function updateCamera() {
    // controls the movement of the camera and various elements in the scene
    if (keyIsDown(188)) {
        fraction -= 0.01;
        if (fraction <= 0) {
            fraction = 0;
        }
    }
    if (keyIsDown(190)) {
        fraction += 0.01;
        if (fraction >= 1) {
            fraction = 1;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        camTilt -= turnSpeed;
        if (camTilt <= -maxCamTilt) {
            camTilt = -maxCamTilt;
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        camTilt += turnSpeed;
        if (camTilt >= maxCamTilt) {
            camTilt = maxCamTilt;
        }
    }
    if (keyIsDown(LEFT_ARROW)) {
        camPan += turnSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        camPan -= turnSpeed;
    }
    if (keyIsDown(87)) { // w
        camZ -= moveSpeed * Math.cos(camPan);
        camX -= moveSpeed * Math.sin(camPan);
    }
    if (keyIsDown(65)) { // a
        camX -= moveSpeed * Math.cos(camPan);
        camZ += moveSpeed * Math.sin(camPan);
    }
    if (keyIsDown(83)) { // s
        camZ += moveSpeed * Math.cos(camPan);
        camX += moveSpeed * Math.sin(camPan);
    }
    if (keyIsDown(68)) { // d
        camX += moveSpeed * Math.cos(camPan);
        camZ -= moveSpeed * Math.sin(camPan);
    }
    if (keyIsDown(16)) { // shift
        // camY += moveSpeed;
    }
    if (keyIsDown(32) && (camY > groundHeight/2 - standHeight - 1)) { // spacebar
        jumpVelocity = initialJumpVelocity;
    } else {
        jumpVelocity += gravity;
    }

    camY -= jumpVelocity; // this makes things fall sometimes

    ensureOnlyFloor()
    remainWithinBounds();
    cam.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);

    cam.pan(camPan);
    cam.tilt(camTilt);

    pointLight(color(255,255,255),camX, camY, camZ);

    
    viewX = camX;
    viewY = camY + sin(camTilt) * 20.4;
    viewZ = camZ - cos(camPan) * cos(camTilt) * 20.4;
    // viewZ = camZ - 200;
    s = fraction * 23.6;

    push();
    let div = createDiv("HELLO");
    div.className = "Center";
    translate(viewX, viewY, viewZ);
    rotateY(-camPan);
    rotateX(camTilt);
    // emissiveMaterial(100,100,100);
    rect(-s*width/height/2, -s/2, s*width/height, s)
    div.position(width/2, height/2)
    strokeWeight(10);
    textSize(40);
    fill(0);
    text("hello", viewX, viewY);
    pop();
    // push();
    // translate(camX, viewY, viewZ)
    // rect(-s*width/height/2, -s/2, s*width/height, s)
    // pop()
    lights();
    
}

function ensureOnlyFloor() {
    if (camY > groundHeight/2 - standHeight) {
        camY = groundHeight/2 - standHeight;
    }
}

function radialDistance(xPos, zPos, xCenter, zCenter) {
    return sqrt((xPos - xCenter)**2 + (zPos - zCenter)**2);
}

function reduceDistance(cX, cZ, newD, xCenter, zCenter) {
    let angle = 0;
    
    if (cZ != 0) {
        angle = atan(cX/cZ);
    }
    // if (cX < 0) {
    //     angle -= PI;
    // }
    // if (cZ > 0) {
    //     angle -= HALF_PI;
    // }
    let newCamX = newD*(1)*cos(angle);
    let newCamZ = newD*(1)*sin(angle);
    return [newCamX + xCenter, newCamZ + zCenter];
    // return [roomRadius,0]
}

function remainWithinBounds() {
    // push()
    if (radialDistance(camX, camZ, 0, 0) > roomRadius) { // if(in-a-room && distance-to-center > roomRadius && not(in-a-hall))
        let newVals = reduceDistance(camX, camZ, roomRadius, 0, 0);
        camX = newVals[0];
        camZ = camZ;
        // distance-to-center = roomRadius;
    } //else if (true) { // if(in-a-hall && distance-to-center > hallWidth)
        // distance-to-center = hallWidth;
   // }
    // if ()
    // let b = rows - 2; // the number of traversible arch sections
    // let border = abs(Scale)*4 + 0 // total width 
    // let diff = 0 // 0 makes a buffer of 1 square, abs(Scale)*8 makes a buffer of 0 squares

    // if (camX > border + diff) {
    //     camX = -border + diff
    // } 
    // else if (camX < -border - diff) {
    //     camX = border - diff
    // }

    // if (camZ > border + diff) {
    //     camZ = -border + diff

    // } else if (camZ < -border - diff) {
    //     camZ = border - diff
    // }
    // pop()
}

// movement with the mouse and on mobile
function mouseDragged() {
    document.body.style.userSelect = "none"; 
    if (touches.length === 0) { // mouse used on desktop
        requestPointerLock();
        camPan -= movedX * touchSensitivity;
        camTilt += movedY * touchSensitivity;
        if (camTilt <= -maxCamTilt) {
            camTilt = -maxCamTilt;
        } else if (camTilt >= maxCamTilt) {
            camTilt = maxCamTilt;
        }
    } else if (touches.length === 1) { // dragged with one finger on mobile
        if (previousTouch.length !== 0) {
            camPan += (touches[0].x - previousTouch.x) * touchSensitivity;
            camTilt -= (touches[0].y - previousTouch.y) * touchSensitivity;
            if (camTilt <= -maxCamTilt) {
                camTilt = -maxCamTilt;
            } else if (camTilt >= maxCamTilt) {
                camTilt = maxCamTilt;
            }
        }
        previousTouch = touches[0];
    } else if (touches.length === 2) { // dragged with two fingers on mobile
        let newPinchDistance = sqrt((touches[0].x - touches[1].x)**2 + (touches[0].y - touches[1].y)**2);
        if (((pinchDistance !== 0) && (abs(pinchDistance-newPinchDistance) >= 2)) && viewState !== "moving") { // Control of Zoom 
            camZ += zoomSensitivity*(pinchDistance - newPinchDistance) * Math.cos(camPan);
            camX += zoomSensitivity*(pinchDistance - newPinchDistance) * Math.sin(camPan);
            viewState = "zooming";
        } else if (((pinchDistance !== 0) && (abs(pinchDistance-newPinchDistance) < 2)) && viewState !== "zooming") { // Control of Panning/Moving
            let newMidX = (touches[0].x + touches[1].x) / 2;
            let newMidY = (touches[0].y + touches[1].y) / 2;
            if (midX !== "none" && midY !== "none") {
                camX -= (newMidX - midX) * Math.cos(camPan);
                camZ += (newMidX - midX) * Math.sin(camPan);
                camY -= (newMidY - midY);
            }
            midX = newMidX;
            midY = newMidY;
            viewState = "moving";
        }
        pinchDistance = newPinchDistance;
    }
    ensureOnlyFloor();
}

// code to adjust the number of arches
function keyPressed() {
    if (keyCode === 75) { // k
        rows -= 2;
        if (rows <= 3) {
            rows = 3;
        }
    } else if (keyCode === 76) { // l
        rows += 2;
        if (rows >= 15) {
            rows = 15;
        }
    }
}

function mouseReleased() {
    exitPointerLock();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = windowWidth;
    height = windowHeight;
    cam.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));
}