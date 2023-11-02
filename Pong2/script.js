// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// random number generator
function random(min,max) {
    return  Math.floor(Math.random() * (max-min+1)) + min;
}

// function to generate random color
function randomRGB() {
    return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
} // why doesn't 'rgb(${random(0,255)},${random(0,255)},${random(0,255)})' work?

// a bunch of variables to control the game
const numBalls = 10;
var ballSize = 7; // ball radius

const trailLength = 0.7; // 0 = infinite trail, 1 = no trail

var paddleWidth = 14;
var paddleLength = 80;

var ballMinIXVelocity = 2; // Magnitude of the initial X velocity
var ballMaxIXVelocity = 4;

var ballMinIYVelocity = -3;
var ballMaxIYVelocity = 3;

var ballMaxV = 10;

var bounceSpeedup = 1.5;

var timeBreak = 1000; // time delay between waves of balls (in ms)

var leftScore = 0;
var rightScore = 0;

var winningScore = 6;


/* I wonder if it's possible to find the mouse position immediately upon page startup
var mouseY = 0;

window.addEventListener('load', setInitialMouseY, false);

function setInitialMouseY(event) {
    mouseY = event.clientY;
    while (!mouseY) {
        mouseY = 
    }
    window.removeEventListener('load', setInitialMouseY, false);
}
*/

/* Not used
function convertRGB(rgb) { // converts named colors like 'white' to rgb strings
    rgb = rgb.match(/^rgb\((\d+), \s*(\d+), \s*(\d+)\)$/);
    console.log(rgb[0], rgb[1], rgb[2]);
}
*/

function drawLine(ctx, x1, y1, x2,y2, stroke = 'white', width = 3) {
    // start a new path
    ctx.beginPath();

    // place the cursor from the point the line should be started 
    ctx.moveTo(x1, y1);

    // draw a line from current cursor position to the provided x,y coordinate
    ctx.lineTo(x2, y2);

    // set strokecolor
    ctx.strokeStyle = stroke;

    // set lineWidht 
    ctx.lineWidth = width;

    // add stroke to the line 
    ctx.stroke();
  }

class Paddle {
    constructor(x,y,color,reverse) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = paddleWidth;
        this.length = paddleLength;
        this.reverse = reverse;

        window.addEventListener('mousemove', (event) => {
            let Y = event.clientY;
            if ((Y < this.length/2 && !this.reverse) || (Y > height - this.length/2 && this.reverse))  {
                this.y = 0;
            } else if ((Y > height - this.length/2 && !this.reverse) || (Y < this.length/2 && this.reverse)) {
                this.y = height - this.length;
            } else if (!this.reverse) {
                this.y = Y - this.length/2;
            } else {
                this.y = height - (Y + this.length/2);
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.length);
        ctx.fill();
    }
}

class Ball {
    constructor(x,y,velX,velY,color) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = ballSize;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        //ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fillRect(this.x,this.y,this.size*2,this.size*2);
        ctx.fill();
    }

    update() {
        if ((this.x + 2*this.size) >= width) {
            this.velX = -(this.velX);
            leftScore++;
            this.delete();
        }
        if ((this.x) <= 0) {
            this.velX = -(this.velX);
            rightScore++;
            this.delete();
        }
        if ((this.y + 2*this.size) >= height) {
            this.velY = -(this.velY);
        }
        if ((this.y) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    delete() {
        for (let i = 0; i<balls.length; i++) {
            if (balls[i] === this) {
                balls.splice(i, 1);
            }
        }
        if (leftScore >= winningScore || rightScore >= winningScore) {
            scores.innerText = `${leftScore}:${rightScore}`;
            GG = 1;
        }
        if (!balls.length) {
            setTimeout(() => {spawnBalls()}, timeBreak);
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = Math.abs(this.x - ball.x);
                const dy = Math.abs(this.y - ball.y);
                
                if (dx < this.size + ball.size && dy < this.size + ball.size) {
                    if (dy < dx) { // collision near the top or bottom
                        if (this.y < ball.y) { // top or bottom collision
                            this.velY = -(Math.abs(this.velY));
                            ball.velY = Math.abs(ball.velY);
                        } else {
                            this.velY = Math.abs(this.velY);
                            ball.velY = -(Math.abs(ball.velY));
                        }
                    }
                    
                    if (dx <= dy) { // collision near the left or right
                        if (this.x < ball.x) { // seems to work more evenly for "this.x < ball.x" than "ball.x < this.x"
                            this.velX = -(Math.abs(this.velX));
                            ball.velX = Math.abs(ball.velX);
                        } else {
                            this.velX = Math.abs(this.velX);
                            ball.velX = -(Math.abs(ball.velX));
                        }
                    }
                    /*
                    let thisColor = this.color.split(',');
                    console.log(thisColor[0], thisColor[1], thisColor[2]);
                    convertRGB(this.color);
                    */
                }
            }
        }

        for (const paddle of paddles) {
            const dx = Math.abs((this.x+this.size) - (paddle.x + paddle.width/2));
            const dy = Math.abs((this.y+this.size) - (paddle.y + paddle.length/2));

            if ((dy < this.size + paddle.length/2) && (dx < this.size + paddle.width/2)) { // if a ball and a paddle touch


                if (dy > paddle.length/2) { // if a ball hits one of the ends of a paddle
                    if (this.y + this.size < paddle.y + paddle.length/2) { // determining which end of the paddle was hit
                        this.velY = -(Math.abs(this.velY));
                    } else {
                        this.velY = Math.abs(this.velY);
                    }
                }

                else if (dx > paddle.width/2 - this.size) { // if a ball hits one of the faces of a paddle
                    let ylevel = -Math.max(-1,Math.min(1,(paddle.y + paddle.length/2 - (this.y + this.size))/(paddle.length/2)));

                    if (paddle.x + paddle.width/2 < this.x + this.size) { // the right side of a paddle was hit

                        let oldAngle = Math.atan(this.velY/this.velX); // the incoming angle of the ball
                        let middleAngle = Math.asin(ylevel); // the angle that defines the plane off which the ball bounces
                        let newAngle = Math.max(-0.8*Math.PI/2, Math.min(0.8*Math.PI/2,2*middleAngle - oldAngle)); // the outgoing angle of the ball
                        let velT = Math.min(ballMaxV, bounceSpeedup*Math.sqrt(this.velY**2 + this.velX**2));
                        
                        this.x = paddle.x + paddle.width;
                        this.velX = velT*Math.cos(newAngle);
                        this.velY = velT*Math.sin(newAngle);
                        
                        // ctx.fillText('old: ' + oldAngle + '(' + this.velX + ', ' + this.velY + '), middle: ' + middleAngle + ', new: ' + newAngle, width/2 + 100, height/2 - 150);

                        
                        // GG = 1;
                        // drawLine(ctx, paddlex, paddle.y + paddle.length/2, paddlex + 100, paddle.y + paddle.length/2, 'white'); // horizonal line at paddle middle
                        // drawLine(ctx, paddlex, this.y+this.size, paddlex+50, this.y+this.size, 'white'); // horizontal line at contact point
                        // drawLine(ctx, paddlex - 200*this.velX, paddley - 200*this.velY, paddlex, paddley, 'purple'); // actual old angle

                        // ctx.fillText(this.velX + ' and ' + this.velY + ' makes ' + Math.sqrt(this.velX**2+this.velY**2), width/2 + 100, height/2 - 100);
                        // drawLine(ctx, this.x+this.size, this.y+this.size, this.x+this.size+10*velT*Math.cos(-newAngle), this.y+this.size+10*velT*Math.sin(newAngle), 'orange');
                        // ctx.fillText(this.velX + ' and ' + this.velY + ' makes ' + Math.sqrt(this.velX**2+this.velY**2), width/2 + 100, height/2 - 50);

                    } else { // the right side of a paddle was hit
                        let oldAngle = Math.PI + Math.atan(this.velY/this.velX); // the incoming angle of the ball
                        let middleAngle = Math.PI - Math.asin(ylevel); // the angle that defines the plane off which the ball bounces
                        let newAngle = Math.max(-0.8*Math.PI/2+Math.PI, Math.min(0.8*Math.PI/2+Math.PI,2*middleAngle - oldAngle)); // the outgoing angle of the ball
                        let velT = Math.min(ballMaxV, bounceSpeedup*Math.sqrt(this.velY**2 + this.velX**2));


                        // let paddlex = paddle.x;
                        // let paddley = paddle.y + paddle.length/2 + ylevel*paddle.length/2;
                        // drawLine(ctx, paddlex + 100*Math.cos(oldAngle), paddley + 100*Math.sin(oldAngle), paddlex, paddley, 'green'); // old angle
                        // drawLine(ctx, paddlex + 100*Math.cos(middleAngle), paddley + 100*Math.sin(middleAngle), paddlex, paddley, 'blue'); // ylevel angle
                        // drawLine(ctx, paddlex + 100*Math.cos(newAngle), paddley + 100*Math.sin(newAngle), paddlex, paddley, 'red'); // new angle
                        
                        this.x = paddle.x - 2*this.size;
                        this.velX = velT*Math.cos(newAngle);
                        this.velY = velT*Math.sin(newAngle);

                    }

                    // if (this.x + this.size < paddle.x + paddle.width/2) { // determining which face of the paddle was hit
                    //     this.velX = -(Math.abs(this.velX));
                    // } else {
                    //     this.velX = Math.abs(this.velX);
                    // }
                }
                this.color = paddle.color;
            }
        }
    }   
}

const paddles = [];

const paddle1 = new Paddle(
    50,
    height/2-paddleLength/2,
    'blue',
    false
)
paddles.push(paddle1);

const paddle2 = new Paddle(
    width-50-paddleWidth,
    height/2-paddleLength/2,
    'red',
    true
)
paddles.push(paddle2);

const balls = [];

function spawnBalls() {
    while (balls.length < numBalls) {
        let direction = -1.0;
        if (Math.random()<0.5) {
            direction = 1.0;
        }
        const ball = new Ball(
            width/2 - ballSize + (2*direction*ballSize),
            random( + ballSize, height - 3*ballSize),
            direction*(Math.random()*(ballMaxIXVelocity - ballMinIXVelocity) + ballMinIXVelocity),
            Math.random()*(ballMaxIYVelocity - ballMinIYVelocity) + ballMinIYVelocity,
            'white'
        );

        balls.push(ball);
    }
}

var dashCount = Math.floor((height/2)/(2*ballSize));
var startingSpacer = (height-(dashCount*2*ballSize)-((dashCount-1)*2*ballSize))/2;
var GG = 0;

function restartClick(event) {
    window.removeEventListener('click', restartClick);
    GG = 0;
    spawnBalls();
    requestAnimationFrame(loop);
}

spawnBalls();

function loop() {
        scores.innerText = `${leftScore}:${rightScore}`;
        ctx.fillStyle = `rgba(0,0,0,${trailLength})`;
        ctx.fillRect(0,0,width,height+10);
        
        for (let i = 0; i < dashCount; i++) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(width/2 - ballSize, startingSpacer + i * 4 * ballSize,ballSize*2,ballSize*2);
        }

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(width/2-ballSize-3,21,ballSize*2+6,38);

        for (const ball of balls) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
        for (const paddle of paddles) {
            paddle.draw();
        }
        
    if (GG) {
        let winner = 'No one'
        if (leftScore > rightScore) {
            winner = 'Blue';
        } else if (rightScore > leftScore) {
            winner = 'Red';
        }

        leftScore = 0;
        rightScore = 0;
        balls.length = 0;

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(width/2-ballSize-3,height/2-40,ballSize*2+6,48);

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(width/2-ballSize-3,height/2-8,ballSize*2+6,48);

        ctx.fillStyle = 'white';
        ctx.font = '48px georgia';
        ctx.textAlign = 'center';
        ctx.fillText(`Good Game! ${winner} is the winner!`, width/2, height/2);

        ctx.fillStyle = 'white';
        ctx.font = '32px georgia';
        ctx.textAlign = 'center';
        ctx.fillText(`(Click anywhere to play again)`, width/2, height/2 + 32);

        window.addEventListener('click', restartClick);
    }
    if (!GG) {
        // width = window.innerWidth;
        // height = window.innerHeight;

        dashCount = Math.floor((height/2)/(2*ballSize));
        startingSpacer = (height-(dashCount*2*ballSize)-((dashCount-1)*2*ballSize))/2;
        requestAnimationFrame(loop)
    }
    
}

loop();
