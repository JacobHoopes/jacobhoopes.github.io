
var Yangle = 0;
var Xangle = 0;
var maxYangle = Math.PI / 4;

var camX = 0;
var camY = 0;
var camZ = 200;
var camTilt = 0;
var maxCamTilt = Math.PI / 2.001;
var camPan = 0;

var moveSpeed = 4;
var turnSpeed = 0.025;
var mouseSensitivity = 0.002;

var pinchDistance = 0;

let cam1;
let cam2;

let currentCamera;

let boxes = [];

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("outerDiv");
    normalMaterial();
    // userSelectDefault = document.body.style.userSelect;
    cam1 = createCamera();
    // cam1.camera(0.1, 200, 0, 0, 0, 0, 0, 1, 0);
    cam1.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
    // ortho();
    cam2 = createCamera();
    cam2.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
    setCamera(cam2);
    currentCamera = 2;

    for (let i = 0; i <= 20; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }
}

function draw() {
    lights()
    let dx = width / 2 - mouseX;
    let dy = height / 2 - mouseY;
    let v = createVector(dx, dy, -100);
    cam1.camera(0, 0, 200+sin(frameCount * 0.01) * 30, 0, 0, 0, 0, 1, 0);
    cam2.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);
    // cam2.camera(0, 0, 50*sqrt, camX, camY, camZ, 0, 1, 0);
    v.div(100);
    // v.normalize();
    directionalLight(255,255,0, v)
    ambientLight(100);

    background(170);

    // orbitControl()
    if (currentCamera === 1) {
        if (keyIsDown(188)) {
            // Xangle += 0.01;
        }
        if (keyIsDown(190)) {
            // Xangle -= 0.01;
        }
        if (keyIsDown(UP_ARROW)) {
            Yangle += 0.02;
            if (Yangle >= maxYangle) {
                Yangle = maxYangle;
            }
        }
        if (keyIsDown(DOWN_ARROW)) {
            Yangle -= 0.02;
            if (Yangle <= -maxYangle) {
                Yangle = -maxYangle;
            }
        }
        if (keyIsDown(LEFT_ARROW)) {
            Xangle -= 0.02;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            Xangle += 0.02;
        }
        if (keyIsDown(87)) { // w
            Xangle += 0.02;
        }
        if (keyIsDown(65)) { // a
            Xangle += 0.02;
        }
        if (keyIsDown(83)) { // s
            Xangle += 0.02;
        }
        if (keyIsDown(68)) { // d
            Xangle += 0.02;
        }

        // ambientMaterial(255,255,255);
        noStroke();
        strokeWidth(10);

        rotateZ(Yangle);
        rotateX(Xangle);
    } else if (currentCamera === 2) {
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
    box(600);
    box(10);
    for (let i = 0; i < boxes.length; i ++) {
        push()
        translate(boxes[i][0], boxes[i][1], boxes[i][2]);
        box(10)
        pop();
        
    }
}


function mouseDragged() {
    if (touches.length === 2) {
        let newPinchDistance = sqrt((touches[0].x - touches[1].x)**2 + (touches[0].y - touches[1].y)**2);
        if (pinchDistance != 0) {
            if (pinchDistance > newPinchDistance) { // dragging fingers closer together (zooming out)
                camZ += (pinchDistance - newPinchDistance) * Math.cos(camPan);
                camX += (pinchDistance - newPinchDistance) * Math.sin(camPan);
            } else if (pinchDistance < newPinchDistance) { // dragging fingers further apart (zooming in)
                camZ -= (pinchDistance - newPinchDistance) * Math.cos(camPan);
                camX -= (pinchDistance - newPinchDistance) * Math.sin(camPan);
            }
        }
        pinchDistance = newPinchDistance;
    } else if (touches.length <= 1) {
        requestPointerLock();
        camPan -= movedX * mouseSensitivity;
        camTilt += movedY * mouseSensitivity;
        if (camTilt <= -maxCamTilt) {
            camTilt = -maxCamTilt;
        } else if (camTilt >= maxCamTilt) {
            camTilt = maxCamTilt;
        }
    }
}

function mouseReleased() {
    exitPointerLock();
    pinchDistance = 0;
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