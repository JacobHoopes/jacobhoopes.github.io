
// var Yangle = 0;
// var Xangle = 0;
// var maxYangle = Math.PI / 4;

var camX = 0;
var camY = 0;
var camZ = 200;
var camTilt = 0;
var maxCamTilt = Math.PI / 2.001;
var camPan = 0;

// settings for pc
var moveSpeed = 4;
var turnSpeed = 0.025;

// settings for mobile
var touchSensitivity = 0.004;
var zoomSensitivity = 2;

var previousTouch = [];
var pinchDistance = 0;
let midX = "none";
let midY = "none";
let viewState = "none";

let cam1;
let cam2;

let currentCamera;

let boxes = [];
let edge;


let g1Dims = [300,150,600]; // Gallery 1 Dimensions
let wallOffset = 10; // The minimum distance from the camera to any wall

let initialJumpVelocity = 5; // initial jump velocity
let jumpVelocity = 0; // How many pixels the camera should move vertically while in the air each time step
let gravity = -0.4; // Number of pixels the jumpVelocity changes by each time step
let standHeight = 50;

let shapes;

let img;

function preload() {
    img = loadImage('./Franky.jpg');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("outerDiv");
    cam2 = createCamera();
    cam2.perspective(PI/3, width / height, 5*sqrt(3), 1000*sqrt(3));
    setCamera(cam2);
    currentCamera = 2;

    for (let i = 0; i < 20; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }
    makeGallery();
}

function draw() {
    // lights()
    background(255);
    // Image(img, 0, 0,0);
    texture(img);
    let dx = width / 2 - mouseX;
    let dy = height / 2 - mouseY;
    let v = createVector(dx, dy, -100);
    let C = createVector(width / 2 - camX, height / 2 - camY, camZ)
    cam2.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);
    C.div(200);
    // C = C*200;
    // v.normalize();
    directionalLight(255,255,255, C)
    ambientLight(200);

    // controls the movement of the camera
    if (currentCamera === 2) {
        if (keyIsDown(188)) {
        }
        if (keyIsDown(190)) {
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
        if (keyIsDown(32) && camY > -g1Dims[1]/2 + standHeight) { // spacebar
            jumpVelocity = initialJumpVelocity;
        } else {
            jumpVelocity += gravity;
        }

        camY -= jumpVelocity;
        // ambientMaterial(255,255,255);
        stroke(0);
        strokeWeight(10);
        cam2.pan(camPan);
        cam2.tilt(camTilt);
    }
    
    // ambientMaterial(231,4,255);

    model(shapes);
    translate(0, 0, 0);
    // box(600);
    for (let i = 0; i < boxes.length; i ++) {
        push()
        // translate(boxes[i][0]*1 +random(), boxes[i][1]*1 + random(), boxes[i][2]*1 + random());
        translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
        // let edge = sin(frameCount/80 + 42*i) * 40;
        edge = 40;
        box(edge)
        pop();
    }
    if (touches.length === 0) {
        previousTouch = [];
        // newPinchDistance = 0;
        pinchDistance = 0;
        midX = "none";
        midY = "none";
        viewState = "none";
    }
    // room hitboxes
    if (camX > g1Dims[0]/2 - wallOffset) {
        camX = g1Dims[0]/2 - wallOffset;
    }
    if (camX < -g1Dims[0]/2 + wallOffset) {
        camX = -g1Dims[0]/2 + wallOffset;
    }
    if (camY > g1Dims[1]/2 - standHeight) {
        camY = g1Dims[1]/2 - standHeight;
    }
    if (camY < -g1Dims[1]/2 + wallOffset) {
        camY = -g1Dims[1]/2 + wallOffset;
    }
    if (camZ > g1Dims[2]/2 - wallOffset) {
        camZ = g1Dims[2]/2 - wallOffset;
    }
    if (camZ < -g1Dims[2]/2 + wallOffset) {
        camZ = -g1Dims[2]/2 + wallOffset;
    }

    for (let i = 0; i < boxes.length; i++) { // to keep the camera outside of the floating boxes
        // let boxesNX = boxes[i][0]*1 + 1;
        let edge = sin(frameCount/80 + 42*i) * 40; // width, height, and depth
        let boxPX = boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40 + edge/2 + 5;
        let boxNX = boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40 - edge/2 - 5;
        let boxPY = boxes[i][1]*1 + sin(frameCount/200 - 59*i) + edge/2 + 5;
        let boxNY = boxes[i][1]*1 + sin(frameCount/200 - 59*i) - edge/2 - 5;
        let boxPZ = boxes[i][2]*1 + sin(frameCount/46 - 100*i) + edge/2 + 5;
        let boxNZ = boxes[i][2]*1 + sin(frameCount/46 - 100*i) - edge/2 - 5;
        let insideBox = (camX < boxPX && camX > boxNX) && (camY < boxPY && camY > boxNY) && (camZ < boxPZ && camZ > boxNZ);
        // let insideBox = (camX > boxPX);
        if (insideBox) {
            // camTilt += 0.01;
            if (camX < boxPX + edge/2 && camX > boxes[i][0]) {
                camX = boxPX + edge/2;
            }
            if (camX > boxNX - edge/2 && camX < boxes[i][0]) {
                camX = boxNX - edge/2;
            }
            if (camY < boxPY + edge/2 && camY > boxes[i][1]) {
                camY = boxPY + edge/2;
            }
            if (camY > boxNY - edge/2 && camY < boxes[i][1]) {
                camY = boxNY - edge/2;
            }
            if (camZ < boxPZ + edge/2 && camZ > boxes[i][2]) {
                camZ = boxPZ + edge/2;
            }
            if (camZ > boxNZ - edge/2 && camZ < boxes[i][2]) {
                camZ = boxNZ - edge/2;
            }
        }
    }
}


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
}

function mouseReleased() {
    exitPointerLock();
}

function doubleClicked() {
    if (currentCamera === 1) {
        setCamera(cam2);
        currentCamera = 2;
    } else {
        setCamera(cam1);
        currentCamera = 1;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function makeGallery() {
    beginGeometry();
    // Negative Z wall (front)
    push()
    translate(0, 0, -g1Dims[2]/2);
    rotateY(0);
    rect(-g1Dims[0]/2, -g1Dims[1]/2, g1Dims[0], g1Dims[1]);
    pop()
    // Positive X wall (right)
    push()
    translate(g1Dims[0]/2, 0, 0);
    rotateY(-PI/2);
    rect(-g1Dims[2]/2, -g1Dims[1]/2, g1Dims[2], g1Dims[1]);
    pop()
    // Positive Z wall (behind)
    push()
    translate(0, 0, g1Dims[2]/2);
    rotateY(PI);
    rect(-g1Dims[0]/2, -g1Dims[1]/2, g1Dims[0], g1Dims[1]);
    pop()
    // Negative X wall (left)
    push()
    translate(-g1Dims[0]/2, 0, 0);
    rotateY(PI/2);
    rect(-g1Dims[2]/2, -g1Dims[1]/2, g1Dims[2], g1Dims[1]);
    pop()
    // Ceiling
    push()
    translate(0, g1Dims[1]/2, 0);
    rotateX(PI/2);
    rect(-g1Dims[0]/2, -g1Dims[2]/2, g1Dims[0], g1Dims[2]);
    pop()
    // Floor
    push()
    translate(0, -g1Dims[1]/2, 0);
    rotateX(-PI/2);
    rect(-g1Dims[0]/2, -g1Dims[2]/2, g1Dims[0], g1Dims[2]);
    pop()
    shapes = endGeometry();
}

// function makeShape(values) { // takes an tuple and builds a shape with pairs of points
//     beginShape();
//     for (let i = 0; i < values.length/2; i++) {
//         vertex(values[i*2], values[i*2 + 1]);
//     }
//     endShape();
// }