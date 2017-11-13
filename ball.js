class Ball {
  constructor(ballX, ballY, ballRadius, moveX, moveY, canvasWidth, canvasHeight, paddleWidth, paddleHeight) {
    this.x = ballX;
    this.y = ballY;
    this.r = ballRadius;
    this.mx = moveX;
    this.my = moveY;
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.px;
    this.pw = paddleWidth;
    this.ph = paddleHeight;
    this.acc = 0.50; // Acceleration
  }

  show() {
    fill('#F2B55F');
    noStroke();

    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.r);
  }

  move() {
    // Movement
    this.x = this.x - this.mx;
    this.y = this.y - this.my;

    // Wall and paddle collision detection
    if (this.x - this.mx > this.width - this.r / 2 || this.x < 0 + this.r / 2) {
      this.mx = -this.mx;
    }
    if (this.y < 0 + this.r / 2) {
      this.my = -this.my;
    }
    if (this.y - this.my > this.height - this.r / 2 - this.ph && this.x <= this.px + this.pw / 2 && this.x >= this.px - this.pw / 2) {
      this.my = -this.my;
    }
    if (this.y - this.my > this.height - this.r / 2) {
      gameOver = true;
    } else if (directChange) {
      this.my = -this.my;
    }
  }
}
