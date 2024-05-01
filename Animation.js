var camX = 0;
var camY = 0;
var camZ = 0;
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
let Scale = -80;

let viewX, viewY, viewZ;
// let camTexture2;


let fraction = 0.2; // the fraction of the width of the screen taken up by the strange rect
let rows = 7 // the number of rows of arches-blocks there are
let numBoxes = 0

let lightColor = color(255,255,255);

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
    setCamera(cam);

    for (let i = 0; i < numBoxes; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }
    noStroke();
    lightFalloff(1,0,0.000006) //0.1,0,0.000009 works okay
}

function draw() {
    background(0);

    // to place floating cubes

    for (let i = 0; i < boxes.length; i ++) {
        push()
        translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
        // ambientMaterial(25,213,24)
        box(50)
        pop();
    }

    push()
    translate(camX, camY, camZ)
    // box(20)
    pop()

    updateCamera();

    push()
    strokeWeight(0.5)
    // translate(5.333,0,5.333);
    for (let i = 0; i < rows; i++) {
        push()
        translate(0,0,Scale*(i*8-4*rows/2))
        // translate(0,0,i*8-5.333*rows/2)
        for (let j = 0; j < rows; j++) {
            push()
            translate(Scale*(j*8-4*rows/2),0,0)
            
            // translate(j*8-5.333*rows/2,0,0)
            // normalMaterial()
            // ambientMaterial();
            box(Scale*8, 1, Scale*8)
            scale(Scale);
            model(arches)
            pop()
        }
        pop()
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


    // to place a stationary rect in the middle of the view

    // viewX = camX - sin(camPan) * cos(camTilt)*20.4;
    // viewY = camY + sin(camTilt)*20.4;
    // viewZ = camZ - cos(camPan) * cos(camTilt)*20.4;
    // let s = fraction * 23.6; // 23.6 fills the page
    // push();
    // translate(viewX, viewY, viewZ); // oh my god Frankie was reversed the whole time and I didn't see it
    // rotateY(camPan);
    // rotateX(camTilt);     
    // rect(-s*width/height/2, -s/2, s*width/height, s)
    // pop();

    // lights()
    // pointLight(255,255,100,camX,camY+600,camZ)

    translate(camX+camTilt*500, camY, camZ-400)

    pointLight(color(255,255,255),camX, camY, camZ)

    // sphere(100)
    translate(-(camX+camTilt*500), -(camY), -(camZ-400))
    // push()
    // translate(camX+400, camY, camZ-400)
    // pop()
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
    push()
    let b = rows - 2; // the number of traversible arch sections
    let border = abs(Scale)*4 + 0 // total width 
    let diff = 0 // 0 makes a buffer of 1 square, abs(Scale)*8 makes a buffer of 0 squares

    if (camX > border + diff) {
        camX = -border + diff
    } 
    else if (camX < -border - diff) {
        camX = border - diff
    }

    if (camZ > border + diff) {
        camZ = -border + diff

    } else if (camZ < -border - diff) {
        camZ = border - diff
    }

    // let diff = 0 
    let test = 0
    let mult = b;
    // if (camX > abs(Scale)*(4+test*(b-1)) + diff) {
    //     camX = -abs(Scale)*(4+test*(b-1)) + diff - abs(Scale)*8* mult
    // } 
    // else if (camX < -abs(Scale)*(4+test*(b-1)) - diff) {
    //     camX = abs(Scale)*(4+test*(b-1)) - diff + abs(Scale)*8* mult
    // }

    // if (camZ > abs(Scale)*(4+test*(b-1)) + diff) {
    //     camZ = -abs(Scale)*(4+test*(b-1)) + diff - abs(Scale)*8* mult

    // } else if (camZ < -abs(Scale)*(4+test*(b-1)) - diff) {
    //     camZ = abs(Scale)*(4+test*(b-1)) - diff +abs(Scale)*8* mult
    // }

    // translate(0,0,i*8-5.333*rows/2)

    pop()
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