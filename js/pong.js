var ball;
var p1;
var p2;
var p1Score;
var p2Score;
var winningScore;

function setup() {
    createCanvas(700, 450);
    background(0);
    fill(255);
    ball = new Ball(width / 2, height / 2, 30);
    p1 = new Paddle(15, 20, 90);
    p2 = new AIPaddle(width - 35, 20, 90);
    p1Score = 0;
    p2Score = 0;
    winningScore = 10;
    //inputButton = createButton("Play Again?");
    //inputButton.mousePressed(thing);
}

function draw() {
    background(0);
    text('PONG', 340, 40);
    //We want to check for winners, and if someone has won, stop the game.
    if (p1Score >= 5 && p1Score < 9) {
        //background(255, 0, 150);
        fill(255, 0, 150);
    }
    if (p1Score == 9) {
        fill(0, 255, 255);
    }
    if (p1Score == winningScore) {
        //display win message for player 1
        /*
         *  Add "play again" button? This just could reset the 
         *  p1 and p2 scores and it would work using this code.
         */
        //drawFireworks();
        text('yo holla homedawg.You won.Yo.', 270, height / 2);

    } else if (p2Score == winningScore) {
        //display win message for player 2
        /*
         *  Add (or unhide) "play again" button? This just could reset the 
         *  p1 and p2 scores and it would work using this code.
         */
        text('You lost, bro. #gitgud', 300, height / 2);
    } else {
        // nobody has won, play continues
        ball.update();
        ball.display();
        p1.update();
        p1.display();
        p2.update(ball);
        p2.display();

        checkLeft(ball, p1);
        checkRight(ball, p2);
    }

    text(p1Score, 50, 40);
    text(p2Score, 650, 40);
    //drawFireworks();
}

function drawFireworks() {

    for (var i = 0; i < 50; i++) {
        firework(200, 200, random(0, TWO_PI), color(random(255), random(255), random(255)));
    }
}

function firework(x, y, dir, c) {
    fill(c);
    var r = 50;
    x += r * cos(dir);
    y += r * sin(dir);
    ellipse(x, y, 200, 200);
}

function checkLeft(b, p) {
    //check the left boundary of the ball and right of paddle
    if (b.pos.x - b.size / 2 <= p.pos.x + p.size.x) {
        //check if ball is in vertical bounds of paddle
        if (b.pos.y + b.size / 2 >= p.pos.y && b.pos.y - b.size / 2 <= p.pos.y + p.size.y) {
            if (b.scored == false) {
                b.speed.x *= -1;
                var yDist = b.pos.y - p.pos.y - p.size.y / 2;
                yDist = map(yDist, -p.size.y / 2 - b.size / 2, p.size.y / 2 + b.size / 2, -10, 10);
                b.speed.y = yDist;
            }
        } else {
            b.scored = true;
        }
    }
}

function checkRight(b, p) {
    //check the right boundary of the ball and left of paddle
    if (b.pos.x + b.size / 2 >= p.pos.x) {
        //check if ball is in vertical bounds of paddle
        if (b.pos.y + b.size / 2 >= p.pos.y && b.pos.y - b.size / 2 <= p.pos.y + p.size.y) {
            if (b.scored == false) {
                b.speed.x *= -1;
            }
        } else {
            b.scored = true;
        }
    }
}

function Paddle(x, hSize, vSize) {
    this.pos = createVector(x, height / 2);
    this.size = createVector(hSize, vSize);
    this.speed = 5;

    this.display = function() {
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    this.update = function() {
        //w is 87, s is 83
        var top = this.pos.y <= 0;
        var bottom = this.pos.y + this.size.y >= height;
        if (keyIsPressed && keyCode === UP_ARROW && !top) {
            this.pos.y += -this.speed;
        } else if (keyIsPressed && keyCode === DOWN_ARROW && !bottom) {
            this.pos.y += this.speed;
        }
    }
}

function AIPaddle(x, hSize, vSize) {
    this.pos = createVector(x, height / 2);
    this.size = createVector(hSize, vSize);
    this.speed = 5;

    this.display = function() {
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    this.update = function(b) {
        //check for distance between paddle and ball
        var d = b.pos.y - this.pos.y - this.size.y / 2;

        var difficulty = map(p1Score - p2Score, -winningScore + 1, winningScore - 1, 25, 8);

        //update the speed of the paddle, based on ball distance
        this.speed = d / difficulty;
        this.pos.y += this.speed;


    }
}

function Ball(x, y, size) {
    this.pos = createVector(x, y);
    this.speed = createVector(5, 4);
    this.size = size;
    this.scored = false;

    this.display = function() {
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }

    this.update = function() {
        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;

        if (this.pos.x >= width) {
            //update score player 1 score
            p1Score++;
            //reset ball position
            this.reset();
        }
        if (this.pos.x <= 0) {
            //update score player 2 score
            p2Score++;
            //reset ball position
            this.reset();
        }
        if (this.pos.y >= height || this.pos.y <= 0) {
            this.speed.y *= -1;
        }
    }
    this.reset = function() {
        this.pos.set(width / 2, height / 2);
        var xSpeed = map(p1Score + p2Score, 0, winningScore * 2 - 2, 5, 8);
        var direction = 0;
        var r = random(-1, 1);
        if (r <= 0) {
            //use low value
            direction = -xSpeed;
        } else {
            //use high value
            direction = xSpeed;
        }

        this.speed.set(direction, random(-xSpeed, xSpeed));
        this.scored = false;
    }

}