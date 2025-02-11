


// function makeGallery() {
//     beginGeometry();
//     // Negative Z wall (front)
//     push()
//     translate(0, 0, -currentDims[2]/2);
//     rotateY(0);

//     rect(-currentDims[0]/2, -currentDims[1]/2, currentDims[0], currentDims[1]);
//     pop()
//     // Positive X wall (right)
//     push()
//     translate(currentDims[0]/2, 0, 0);
//     rotateY(-PI/2);
//     rect(-currentDims[2]/2, -currentDims[1]/2, currentDims[2], currentDims[1]);
//     pop()
//     // Positive Z wall (behind)
//     push()
//     translate(0, 0, currentDims[2]/2);
//     rotateY(PI);
//     rect(-currentDims[0]/2, -currentDims[1]/2, currentDims[0], currentDims[1]);
//     pop()
//     // Negative X wall (left)
//     push()
//     translate(-currentDims[0]/2, 0, 0);
//     rotateY(PI/2);
//     rect(-currentDims[2]/2, -currentDims[1]/2, currentDims[2], currentDims[1]);
//     pop()
//     // Ceiling
//     push()
//     translate(0, currentDims[1]/2, 0);
//     rotateX(PI/2);
//     rect(-currentDims[0]/2, -currentDims[2]/2, currentDims[0], currentDims[2]);
//     pop()
//     // Floor
//     push()
//     translate(0, -currentDims[1]/2, 0);
//     rotateX(-PI/2);
//     rect(-currentDims[0]/2, -currentDims[2]/2, currentDims[0], currentDims[2]);
//     pop()
//     shapes = endGeometry();
// }

// function makeComplexGallery(points, x, y, z) {

//     texture(camTexture)
//     beginGeometry();

//     texture(camTexture)
//     // Floor
//     push()
//     translate(x, y, z)
//     beginShape()
//     for (let i = 0; i <= points.length; i++) {
//         push()
//         translate(points[i])
//         pop()
//     }
//     endShape()
//     pop()
//     // Walls
//     for (let i = 0; i <= points.length; i++)
//     push()
//     pop()



//     // Negative Z wall (front)
//     push()
//     translate(0, 0, -currentDims[2]/2);
//     rotateY(0);
//     rect(-currentDims[0]/2, -currentDims[1]/2, currentDims[0], currentDims[1]);
//     pop()
//     // Positive X wall (right)
//     push()
//     translate(currentDims[0]/2, 0, 0);
//     rotateY(-PI/2);
//     rect(-currentDims[2]/2, -currentDims[1]/2, currentDims[2], currentDims[1]);
//     pop()
//     // Positive Z wall (behind)
//     push()
//     translate(0, 0, currentDims[2]/2);
//     rotateY(PI);
//     rect(-currentDims[0]/2, -currentDims[1]/2, currentDims[0], currentDims[1]);
//     pop()
//     // Negative X wall (left)
//     push()
//     translate(-currentDims[0]/2, 0, 0);
//     rotateY(PI/2);
//     rect(-currentDims[2]/2, -currentDims[1]/2, currentDims[2], currentDims[1]);
//     pop()
//     // Ceiling
//     push()
//     translate(0, currentDims[1]/2, 0);
//     rotateX(PI/2);
//     rect(-currentDims[0]/2, -currentDims[2]/2, currentDims[0], currentDims[2]);
//     pop()
//     // Floor
//     push()
//     translate(0, -currentDims[1]/2, 0);
//     rotateX(-PI/2);
//     rect(-currentDims[0]/2, -currentDims[2]/2, currentDims[0], currentDims[2]);
//     pop()
//     shapes = endGeometry();
// }

// // function makeShape(values) { // takes an tuple and builds a shape with pairs of points
// //     beginShape();
// //     for (let i = 0; i < values.length/2; i++) {
// //         vertex(values[i*2], values[i*2 + 1]);
// //     }
// //     endShape();
// // }


// function makeArches() {
//     beginGeometry()
    

//     endGeometry()
// }

// function ensureArchesHitboxes(x, y, z) {
//     let x1 = 0;

//     return [x1, y1, z1]
// }