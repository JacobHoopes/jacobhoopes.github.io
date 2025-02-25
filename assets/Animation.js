var camX = 0;
var camY = 0;
var camZ = 0;
var camTilt = 0;
var maxCamTilt = Math.PI / 2.001; // div by 2.001 limits view to straight up and down
var camPan = -Math.PI/10;

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

let roomRadius = 340; // room radius is 400
let hallWidth = 100;

let lightColor = color(255,255,255);


let quadrant = 0;
let currentSpaces = [];

let font;
let fontSize = 40;
var space;

var angle_value = "";
var touchesNumber = 0;

function preload() {
    // arches = loadModel('./assets/arches.obj');
    room = loadModel('./assets/room-simple.obj');
    hall = loadModel('./assets/hall-simple.obj');
    font = loadFont('./assets/Roboto-Light.ttf')
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    
    canvas.parent("outerDiv");
    cam = createCamera();
    cam.perspective(PI/3, width / height, 5*sqrt(3), 10000*sqrt(3));
    setCamera(cam);

    // stroke(color(0,0,0));
    // strokeWeight(0);
    noStroke();
    fill(color(73, 104, 65));
    emissiveMaterial(color(100));
    // 46, 142, 133 (stone)
    // 34, 139, 34 (forest green)
    // 73, 104, 65 (light green)

    lightFalloff(1,0.0000,0.000004) //0.1,0,0.000009 works okay

    let divText = createElement('div');
    divText.class('divText');
    divText.position(0,0);  
    
    space = ["none", 0];

}

function draw() {
    background(color(135,206,235));
    
    updateCamera();
    // addInnerRect();
    scale(Scale);

    model(room);
    push()
    
    for (let i = 0; i < 5; i++) {
        push()

        push()
        fill(0);
        strokeWeight(20);
        stroke(0);
        rotateY(TWO_PI/5 * i)
        line(10,5,0, 100,5,0)
        fill(20);
        text("hello", 10, 5, 0)
        pop()
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

    document.getElementsByClassName("divText")[0].innerHTML = "<div class='innerDivText'></div>";
    // document.getElementsByClassName("innerDivText")[0].innerHTML = "<p>Welcome to my site! Navigate with WASD and arrow keys. Or swipe and zoom on mobile.</p>";

    ensureOnlyFloor();
    remainWithinBounds();
    placeCamera();
    // lights();
}

function placeText() {

        textAlign(CENTER, CENTER);
        fill(100);
        text('HELLO', 0, 0);
}

function ensureOnlyFloor() {
    if (camY > groundHeight/2 - standHeight) {
        camY = groundHeight/2 - standHeight;
    }
}

function placeCamera() {
    cam.camera(camX, camY, camZ, camX, camY, camZ-200, 0, 1, 0);
    
    cam.pan(camPan);
    cam.tilt(camTilt);

    pointLight(color(255,255,255),camX, camY, camZ);
}

function addInnerRect() {
    viewX = camX - sin(camPan) * cos(camTilt)*20.4;
    viewY = camY + sin(camTilt) * 20.4;
    viewZ = camZ - cos(camTilt) * cos(camPan) * 20.4;
    s = fraction * 23.6;

    push();
    translate(viewX, viewY, viewZ);
    rotateY(camPan);
    rotateX(camTilt);
    rect(-s*width/height/2, -s/2, s*width/height, s)
    pop();
}

function radialDistance(xPos, zPos, xCenter, zCenter) {
    return sqrt((xPos - xCenter)**2 + (zPos - zCenter)**2);
}

function linearDistance(x1, z1, x2, z2, pointX, pointZ) {
    let A = z2 - z1;
    let B = x1 - x2;
    let C = z1 * x2 - z2 * x1;
    return (abs(A * pointX + B * pointZ + C) / sqrt(A**2 + B**2))
}

function reduceRadialDistance(cX, cZ, newD) {
    let angle = 0;
    if (cZ != 0) {
        angle = atan(cX/cZ) - HALF_PI;
    }
    
    if (cX >= 0 && cZ >= 0) { // quadrant 1
        angle = abs(angle);
    } else if (cX < 0 && cZ > 0) { // quadrant 2
        angle = abs(angle);
    } else if (cX <= 0 && cZ <= 0) { // quadrant 3
        angle = PI - angle;
    } else if (cX > 0 && cZ < 0) { // quadrant 4
        angle = PI - angle;
    }
    let newCamX = newD*cos(angle);
    let newCamZ = newD*sin(angle);

    return [newCamX, newCamZ];
    // return [roomRadius,0]
}

function reduceLinearDistance(cX, cZ, newD) {


    return [0,0];
}

function remainWithinBounds() {
    let dr = radialDistance(camX, camZ, 0, 0);
    let dl = 1000;

    let mod_angle = 0;
    let distance = dl;

    // calculation to get an accurate angle between the camera position and the x-axis
    let est_angle = atan(camX/camZ);
    if (est_angle < 0 ) {
        est_angle = est_angle + PI;
    }
    if (camX > 0) {
        est_angle += PI;
    }
    est_angle = TWO_PI - (est_angle + HALF_PI) % TWO_PI;
    angle_value = floor(est_angle / TWO_PI * 360*100)/100;
    for (let i = 0; i < 5; i++) {
        mod_angle = TWO_PI/5 * i;
        
        distance = linearDistance(-100*cos(mod_angle),-100*sin(mod_angle), 100*cos(mod_angle),100*sin(mod_angle), camX, camZ);
        if (abs(mod_angle - est_angle)%TWO_PI > TWO_PI/10 && distance < dl) {
            dl = distance;
            angle_value = dl;
        }
    }


    let newVals = [camX, camZ];
    
    if (dr < roomRadius) {
        space[0] = "room";
    } else if (dl < hallWidth && dr > roomRadius) {
        space[0] = "hall";

    }
    if (space[0] == "hall" && dl > hallWidth) {
        newVals = reduceLinearDistance(camX, camZ, hallWidth);
        camX = newVals[0];
        camZ = newVals[1];
    }
    if (space[0] == "room" && dr > roomRadius) {
        newVals = reduceRadialDistance(camX, camZ, roomRadius);
        camX = newVals[0];
        camZ = newVals[1];
    } 


    document.getElementsByClassName("innerDivText")[0].innerHTML = `<p>camX: ${floor(camX)}; camZ: ${floor(camZ)}</p><p>Radial distance: ${floor(dr*100)/100}</p><p>Linear Distance: ${floor(dl*100)/100}</p><p>${space[0]} ${space[1]}</p><p>Closest angle value: ${angle_value}</p><p>Number of Touches: ${touchesNumber}</p>`
}

// movement with the mouse and on mobile
function mouseDragged() {
    document.body.style.userSelect = "none"; 
    if (touches.length == 0) { // mouse used on desktop
        requestPointerLock();
        camPan -= movedX * touchSensitivity;
        camTilt += movedY * touchSensitivity;
        if (camTilt <= -maxCamTilt) {
            camTilt = -maxCamTilt;
        } else if (camTilt >= maxCamTilt) {
            camTilt = maxCamTilt;
        }
    } else if (touches.length == 1) { // dragged with one finger on mobile
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
    } else if (touches.length == 2) { // dragged with two fingers on mobile
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
    // ensureOnlyFloor();
    touchesNumber = pinchDistance;
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