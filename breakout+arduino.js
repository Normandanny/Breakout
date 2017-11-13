var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.wchusbserial1430'; // fill in your serial port name here
var fromSerial = 0;

// Set up the ball
var ballDefault; // Default ball
var bx = 300; // X position of the ball
var by = 500; // Y position of the ball
var br = 20; // Ball radius
var mx = 3; // Movement on the X axis
var my = 4; // Movement on the Y axis

// Set up the paddle
var px = 300;
var py = 595;
var pw = 100;
var ph = 10;

// Set up the blocks
var brickRowCount = 7;
var brickColumnCount = 8;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

var gameOver = false;
var directChange = false;

function setup() {
  createCanvas(600, 600);
  ballDefault = new Ball(bx, by, br, mx, my, width, height, pw, ph);

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function draw() {
  background('#FAE9DE');

  // Draw bricks
  drawBricks();

  // Draw paddle
  drawPaddle();

  // Brick collision detection
  collisionDetection();

  // Draw ball
  ballDefault.px = px; // Pass real-time paddle position into ballDefault
  ballDefault.show();
  ballDefault.move();

  if (gameOver) {
    background('#333333');
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("GAME OVER", width / 2, height / 2);
  }

  directChange = false;
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  // read a string from the serial port:
  var inString = serial.readLine();
  // check to see that there's actually a string there:
  if (inString.length > 0) {
    // convert it to a number:
    fromSerial = Number(inString);
  }
}


function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}


// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

// Paddle function
function drawPaddle() {
  fill('#EA6B65');
  noStroke();
  rectMode(CENTER);
  rect(px, py, pw, ph);

  if (keyIsDown(LEFT_ARROW) && px - pw / 2 >= 0) {
    px = px - 10;
  }
  if (keyIsDown(RIGHT_ARROW) && px + pw / 2 <= width) {
    px = px + 10;
  }
}

// Brick function
function drawBricks() {
  rectMode(CORNER);
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        fill('#203E53');
        rect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

// Brick collision detection function
function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (ballDefault.x > b.x && ballDefault.x < b.x + brickWidth && ballDefault.y > b.y && ballDefault.y < b.y + brickHeight) {
          directChange = true;
          b.status = 0;
        }
      }
    }
  }
}
