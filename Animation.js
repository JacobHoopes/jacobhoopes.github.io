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

let room;
let currentDims;

let g1Dims = [300,150,1200]; // Gallery 1 Dimensions
let wallOffset = 10; // The minimum distance from the camera to any wall

let initialJumpVelocity = 6; // initial jump velocity
let jumpVelocity = 0; // How many pixels the camera should move vertically while in the air each time step
let gravity = -0.4; // Number of pixels the jumpVelocity changes by each time step
let standHeight = 50;

let shapes;

let G2;
let G2BoundaryPoints = [[150, 0, 600],[150, 0, -600],[-150, 0, -600],[-150, 0, -600]];
let G2Height = 300;

let img;
let dome;
let dome2;
let arches;


// Inset Camera Testing
// let capture


let camTexture;
let cam3;
// let camTexture2;


let fraction = 0.6; // the fraction of the width of the screen taken up by the strange rect

function preload() {
    img = loadImage('./Franky.jpg');
    // dome = loadModel('./Fancy\ Dome.obj');
    // dome2 = loadModel('./Dome2.obj');
    arches = loadModel('./arches.obj');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);

    // var canvas = createGraphics(windowWidth, windowHeight, WEBGL, document.getElementById("outerDiv"));
    canvas.parent("outerDiv");
    cam2 = createCamera();
    cam2.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));

    camTexture = createGraphics(width, height, WEBGL);
    // camTexture = p5.Framebuffer()
    // cam3 = createCamera();
    // cam3.perspective(PI/3, width*2 / height, 5*sqrt(3), 10000*sqrt(3));
    // camTexture.setCamera(cam3);
    camTexture.cam3 = createCamera()
    camTexture.cam3.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));
 
    currentCamera = 2;

    for (let i = 0; i < 20; i++) {
        boxes[i] = [[random()*400-200], [random()*400-200], [random()*400-200]];
    }

    currentDims = g1Dims;
    // makeGallery();


    // makeComplexGallery([],0,0,0);
    // capture = createCapture(VIDEO)
    // capture.hide()



    // Inset Camera Testing

    // camera(0, 0, (height / 2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
    
    // let fov = PI/3;
    // let aspect = width / height;
    // let near = 0.1;
    // let far = 10000;
    // let cameraX = 0;
    // let cameraY = 0;
    // let cameraZ = 21; // (height / 2) / tan(fov / 2);

    // camTexture.perspective(fov, aspect, near, far);
    // camTexture.camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0)
    // camTexture.cam3 = cam2;
    // camTexture.cam3.perspective(fov, aspect, near, far);
    // camTexture.cam3.camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0)

    setCamera(cam2);
    // camTexture.setCamera(camTexture.cam3)

}

function draw() {
    background(255);
    texture(camTexture)


    for (let i = 0; i < boxes.length; i ++) {
        push()
        translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
        edge = 40;
        camTexture.texture(img)
        box(edge)
        pop();
    }

    // controls the movement of the camera
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
    if (keyIsDown(32) && (camY > currentDims[1]/2 - standHeight - 1)) { // spacebar
        jumpVelocity = initialJumpVelocity;
    } else {
        jumpVelocity += gravity;
    }

    camY -= jumpVelocity; // this makes things fall sometimes

    ensureOnlyFloor()



    cam2.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);


    // to place a stationary rect in the middle of the view
    push();
    translate(camX, camY, camZ);
    rotateY(camPan + PI/2);
    translate(20 * cos(camPan), 0, 20 * sin(camPan))
    rotateY(-camPan - PI/2) // oh my god Frankie was reversed the whole time and I didn't see it
    let s = fraction*23; // 23 fills the page
    // rect(-s*width/height/2, -s/2, s*width/height, s)
    beginShape()
    vertex(-s*width/height/2, -s/2, 0, width/2 - fraction*width/2, height/2 - fraction*height/2) // width/2, height/2 when fraction = 0 vs 0, 0 when fraction = 1
    vertex(s*width/height/2, -s/2, 0, width/2 + fraction*width/2, height/2 - fraction*height/2)
    vertex(s*width/height/2, s/2, 0, width/2 + fraction*width/2, height/2 + fraction*height/2) // width/2, height/2 when fraction = 0 vs width, height when fraction = 1
    vertex(-s*width/height/2, s/2, 0, width/2 - fraction*width/2, height/2 + fraction*height/2)
    // vertex(-s*width/height/2, -s/2, 0, fraction*width/2, fraction*height/2) // width/2, height/2 when fraction = 0 vs 0, 0 when fraction = 1
    // vertex(s*width/height/2, -s/2, 0, width - fraction*width/2, fraction*height/2)
    // vertex(s*width/height/2, s/2, 0, width - fraction*width/2, height - fraction*height/2) // width/2, height/2 when fraction = 0 vs width, height when fraction = 1
    // vertex(-s*width/height/2, s/2, 0, fraction*width/2, height - fraction*height/2)
    endShape(CLOSE)
    pop();

    camTexture.background(255)
    // camTexture.lights()
    lights()


 
    cam2.pan(camPan);
    cam2.tilt(camTilt);

    let viewX = camX - sin(camPan) * cos(camTilt) * 200;
    let viewY = camY + sin(camTilt) * 200;
    let viewZ = camZ - cos(camPan) * cos(camTilt) * 200;
    
    camTexture.camera(camX, camY, camZ, viewX, viewY, viewZ, 0, 1, 0)
    // camTexture.camera(camX - 100 * sin(camPan), camY, camZ - 100 * cos(camPan), viewX - 100 * sin(camPan), viewY, viewZ - 100 * cos(camPan), 0, 1, 0)
    camTexture.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3))

    // camTexture.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0)
    // camTexture.pan(camPan);

    // cam2.camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0)
    // cam3.camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0)
    
    
    // ambientMaterial(231,4,255);
    // to place a stationary rect in the middle of the view

    // model(shapes);
    push()
    translate(0,75,0)
    strokeWeight(0.5)
    fill(255)
    scale(-60);
    // model(dome2); // with scale = -80
    let rows = 8
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

    for (let i = 0; i < boxes.length; i ++) {
        camTexture.push()
        // camTexture.texture(camTexture)
        camTexture.translate(boxes[i][0]*1 + sin(frameCount/100 - 70*i) * 40, boxes[i][1]*1 + sin(frameCount/200 - 59*i) * 20, boxes[i][2]*1 + sin(frameCount/46 - 100*i) * 17);
        edge = 40;
        camTexture.box(edge)
        camTexture.pop();
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
    // ensureHitboxes();
    // remainWithinBounds()

}

function ensureOnlyFloor() {
    if (camY > currentDims[1]/2 - standHeight) {
        camY = currentDims[1]/2 - standHeight;
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

// room bounds for the simple room
function ensureHitboxes() {
    // room hitboxes
    if (camX > currentDims[0]/2 - wallOffset) {
        camX = currentDims[0]/2 - wallOffset;
    }
    if (camX < -currentDims[0]/2 + wallOffset) {
        camX = -currentDims[0]/2 + wallOffset;
    }
    if (camY > currentDims[1]/2 - standHeight) {
        camY = currentDims[1]/2 - standHeight;
    }
    if (camY < -currentDims[1]/2 + wallOffset) {
        camY = -currentDims[1]/2 + wallOffset;
    }
    if (camZ > currentDims[2]/2 - wallOffset) {
        camZ = currentDims[2]/2 - wallOffset;
    }
    if (camZ < -currentDims[2]/2 + wallOffset) {
        camZ = -currentDims[2]/2 + wallOffset;
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
    ensureHitboxes();
}

function mouseReleased() {
    exitPointerLock();
}

function doubleClicked() {
    if (currentCamera === 1) {
        setCamera(cam2);
        currentCamera = 2;
    } else if (currentCamera === 2){
        setCamera(camTexture.cam3);
        currentCamera = 1;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}