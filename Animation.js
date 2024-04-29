var camX = 0;
var camY = 50;
var camZ = 200;
var camTilt = 0;
var maxCamTilt = Math.PI / 6.001; // div by 2.001 limits view to straight up and down
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
let standHeight = 50;
let groundHeight = 150;

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


let doCamTexture = true;
let camTexture;

let viewX, viewY, viewZ;
// let camTexture2;


let fraction = 0.6; // the fraction of the width of the screen taken up by the strange rect
let rows = 2 // the number of rows of arches-blocks there are
let numBoxes = 5

function preload() {
    img = loadImage('./Franky.jpg');
    // dome = loadModel('./Fancy\ Dome.obj');
    // dome2 = loadModel('./Dome2.obj');
    arches = loadModel('./arches.obj');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    
    canvas.parent("outerDiv");
    cam = createCamera();
    cam.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));

    camTexture = createGraphics(width, height, WEBGL);

    setCamera(cam);

    for (let i = 0; i < numBoxes; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }


}

function draw() {
    background(255);

    for (let i = 0; i < boxes.length; i ++) {
        push()
        translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
        texture(camTexture)
        box(40)
        pop();
    }

    if (doCamTexture) {
        for (let i = 0; i < boxes.length; i ++) {
            camTexture.push()
            camTexture.translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
            camTexture.texture(img)
            camTexture.box(40)
            camTexture.pop();
        }
    }


    updateCamera();
    push()
    translate(0,75,0)
    strokeWeight(0.5)
    fill(255)
    scale(-60);
    // model(dome2); // with scale = -80
    for (let i = 0; i < rows; i++) {
        push()
        translate(0,0,i*8-8*rows/2)
        for (let j = 0; j < rows; j++) {
            push()
            translate(j*8-8*rows/2,0,0)
            // normalMaterial()
            // ambientMaterial();
            model(arches)
            pop()
        }
        pop()
    }
    pop()

    if (doCamTexture) {
        camTexture.push()
        camTexture.translate(0,75,0)
        camTexture.strokeWeight(1)
        camTexture.fill(255)
        camTexture.scale(-60);
        for (let i = 0; i < rows; i++) {
            camTexture.push()
            camTexture.translate(0,0,i*8-8*rows/2)
            for (let j = 0; j < rows; j++) {
                camTexture.push()
                camTexture.translate(j*8-8*rows/2,0,0)
                camTexture.normalMaterial()
                camTexture.model(arches)
                camTexture.pop()
            }
            camTexture.pop()
        }
        camTexture.pop()
    }

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
    cam.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);

    cam.pan(camPan);
    cam.tilt(camTilt);


    viewX = camX - sin(camPan) * cos(camTilt)*20.4;
    viewY = camY + sin(camTilt)*20.4;
    viewZ = camZ - cos(camPan) * cos(camTilt)*20.4;

    // to place a stationary rect in the middle of the view
    push();
    translate(viewX, viewY, viewZ); // oh my god Frankie was reversed the whole time and I didn't see it
    rotateY(camPan);
    rotateX(camTilt);     
    let s = fraction*23.6; // 23.6 fills the page
    // rect(-s*width/height/2, -s/2, s*width/height, s)
    if (doCamTexture) {
        texture(camTexture)
        beginShape()
        vertex(-s*width/height/2, -s/2, 0, width/2 - fraction*width/2, height/2 - fraction*height/2) // width/2, height/2 when fraction = 0 vs 0, 0 when fraction = 1
        vertex(s*width/height/2, -s/2, 0, width/2 + fraction*width/2, height/2 - fraction*height/2)
        vertex(s*width/height/2, s/2, 0, width/2 + fraction*width/2, height/2 + fraction*height/2) // width/2, height/2 when fraction = 0 vs width, height when fraction = 1
        vertex(-s*width/height/2, s/2, 0, width/2 - fraction*width/2, height/2 + fraction*height/2)
        endShape(CLOSE)
    }
    pop();
    if (doCamTexture) {
        camTexture.background(255)

        camTexture.camera(camX, camY, camZ, viewX, viewY, viewZ, 0, 1, 0)
        camTexture.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3))
    }
    lights()
}

function ensureOnlyFloor() {
    if (camY > groundHeight/2 - standHeight) {
        camY = groundHeight/2 - standHeight;
    }
    // if (camY < -currentDims[1]/2 + wallOffset) {
    //     camY = -currentDims[1]/2 + wallOffset;
    // }
}

// room bounds for the 
function remainWithinBounds() {
    let b = 1 // half the number of rows of arched spaces
    if (camX > 8*60*b) {
        camX = -8*60*b
    }
    if (camX < -8*60*b) {
        camX = 8*60*b
    }
    if (camZ > 8*60*b) {
        camZ = -8*60*b
    }
    if (camZ < -8*60*b) {
        camZ = 8*60*b
    }
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
        rows --
        if (rows <= 0) {
            rows = 0;
        }
    } else if (keyCode === 76) { // l
        rows ++
        if (rows >= 7) {
            rows = 7;
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
    if (doCamTexture) {
        camTexture.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3))
    }

}

function doubleClicked() {
    doCamTexture = !doCamTexture;
}