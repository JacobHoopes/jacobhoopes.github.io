
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

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("outerDiv");
    // normalMaterial();
    // userSelectDefault = document.body.style.userSelect;
    // cam1 = createCamera();
    // cam1.camera(0.1, 200, 0, 0, 0, 0, 0, 1, 0);
    // cam1.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
    // ortho();
    cam2 = createCamera();
    cam2.perspective(PI/3, width / height, 5*sqrt(3), 500*sqrt(3));
    setCamera(cam2);
    currentCamera = 2;

    for (let i = 0; i <= 20; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }
}

function draw() {
    // lights()
    background(255);
    let dx = width / 2 - mouseX;
    let dy = height / 2 - mouseY;
    let v = createVector(dx, dy, -100);
    let C = createVector(width / 2 - camX, height / 2 - camY, camZ)
    // cam1.camera(0, 0, 200+sin(frameCount * 0.01) * 30, 0, 0, 0, 0, 1, 0);
    cam2.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);
    // cam2.camera(0, 0, 50*sqrt, camX, camY, camZ, 0, 1, 0);
    C.div(200);
    // C = C*200;
    // v.normalize();
    directionalLight(255,255,255, C)
    ambientLight(200);

    // background(170);

    // orbitControl()
    if (currentCamera === 2) {
        if (keyIsDown(188)) {
            // Xangle += 0.01;
        }
        if (keyIsDown(190)) {
            // Xangle -= 0.01;
        }
        if (keyIsDown(UP_ARROW)) {
            // tilt(0.05);
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
            camY += moveSpeed;
        }
        if (keyIsDown(32)) { // spacebar
            camY -= moveSpeed;
        }

        // ambientMaterial(255,255,255);
        stroke(0);
        strokeWeight(10);
        cam2.pan(camPan);
        cam2.tilt(camTilt);
    }
    ambientMaterial(231,4,255);
    translate(0, 0, 0);
    // box(600);
    // box(10);
    for (let i = 0; i < boxes.length; i ++) {
        push()
        // translate(boxes[i][0]*1 +random(), boxes[i][1]*1 + random(), boxes[i][2]*1 + random());
        translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i), boxes[i][2]*1 + sin(frameCount/46 - 100*i));
        let edge = sin(frameCount/80 + 42*i) * 40;
        box(edge)
        pop();
    }
    if (touches.length === 0) {
        previousTouch = [];
        newPinchDistance = 0;
        pinchDistance = 0;
        midX = "none";
        midY = "none";
        viewState = "none";
    }
}


function mouseDragged() {
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
            // if (pinchDistance > newPinchDistance) { // dragging fingers closer together (zooming out), equivalent to "s"
            //     camZ += zoomSensitivity*(pinchDistance - newPinchDistance) * Math.cos(camPan);
            //     camX += zoomSensitivity*(pinchDistance - newPinchDistance) * Math.sin(camPan);
            // } else if (pinchDistance < newPinchDistance) { // dragging fingers further apart (zooming in), equivalent to "w"
            //     camZ -= zoomSensitivity*(newPinchDistance - pinchDistance) * Math.cos(camPan);
            //     camX -= zoomSensitivity*(newPinchDistance - pinchDistance) * Math.sin(camPan);
            // }
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
    // previousTouch = [];
    // pinchDistance = 0;
    // midX = "none";
    // midY = "none";
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

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }

// function mousePressed() {
//     document.body.style.userSelect = "none"; 
// }


// function setup() {
//     var canvas = createCanvas(100, 100, WEBGL);
//     normalMaterial();
//     describe(
//       'Camera orbits around a box when mouse is hold-clicked & then moved.'
//     );
//     camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
//     perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
//   }
//   function draw() {
//     background(200);
  
//     // If you execute the line commented out instead of next line, the direction of rotation
//     // will be the direction the mouse or touch pointer moves, not around the X or Y axis.
//     orbitControl();
//     // orbitControl(1, 1, 1, {freeRotation: true});
  
//     rotateY(0.5);
//     box(30, 50);
//   }