import Phaser from "phaser";

class Game extends Phaser.Scene {
  init() {
    this.playerScore = 0;
    this.botScore = 0;
    this.ballSpeed = 200;

    // Get difficulty from title screen
    const titleScreen = this.scene.get("TitleScreen");
    const difficultyText = titleScreen.menuTexts
      ? titleScreen.menuTexts[1].text
      : "NORMAL";
    if (difficultyText.includes("EASY")) {
      this.botSpeed = 150;
      this.botReactionDistance = 100;
    } else if (difficultyText.includes("HARD")) {
      this.botSpeed = 300;
      this.botReactionDistance = 400;
    } else {
      this.botSpeed = 200;
      this.botReactionDistance = 200;
    }
  }
  preload() {}
  create() {
    //some decoration
    this.add
      .line(400, 250, 0, 0, 0, 500, 0xffffff, 1)
      .setStrokeStyle(5, 0xffffff, 1);
    this.add.circle(400, 250, 50).setStrokeStyle(2, 0xffffff, 1);

    this.resetX = 400;
    this.resetY = 250;
    //create the ball object
    this.ball = this.add.circle(400, 250, 10, 0xffffff);
    this.physics.add.existing(this.ball);
    this.ball.body.setBounce(1, 1); // Set bounce in both x and y directions

    const angle = Phaser.Math.Between(0, 360);
    const vector = this.physics.velocityFromAngle(angle, this.ballSpeed);

    this.ball.body.setVelocity(vector.x, vector.y); // Set initial velocity
    this.ball.body.setCollideWorldBounds(true); // Set the ball to collide with the world bounds

    this.ball.body.setGravity(0, 0); // Set gravity to zero

    //create the paddle
    this.leftPaddle = this.add.rectangle(50, 250, 20, 100, 0xffffff);
    this.physics.add.existing(this.leftPaddle);
    this.leftPaddle.body.immovable = true; // make the paddle immovable
    this.leftPaddle.body.setCollideWorldBounds(true); // set the paddle to collide with the world bounds

    this.physics.add.collider(this.leftPaddle, this.ball);

    this.rightPaddle = this.add.rectangle(750, 250, 20, 100, 0xffffff);
    this.physics.add.existing(this.rightPaddle);
    this.rightPaddle.body.immovable = true; // make the paddle immovable
    this.rightPaddle.body.setCollideWorldBounds(true); // set the paddle to collide with the world bounds

    this.physics.add.collider(this.rightPaddle, this.ball);

    this.cursors = this.input.keyboard.createCursorKeys(); // Create cursor keys for right paddle movement

    const scoreStyle = {
      fontSize: 48,
    };

    this.leftScore = this.add.text(300, 125, "0", scoreStyle);
    this.rightScore = this.add.text(500, 125, "0", scoreStyle);
  }
  update() {
    //reset the ball when we approach the world borders
    if (this.ball.x > 770) {
      this.addLeftScore();
      this.resetBall();
    } else if (this.ball.x < 30) {
      this.addRightScore();
      this.resetBall();
    }

    // Move the right paddle with the up and down arrow keys
    if (this.cursors.up.isDown) {
      this.leftPaddle.body.setVelocityY(-200); // Move up
    } else if (this.cursors.down.isDown) {
      this.leftPaddle.body.setVelocityY(200); // Move down
    } else {
      this.leftPaddle.body.setVelocityY(0); // Stop moving
    }

    // Bot movement based on difficulty
    const far = this.rightPaddle.x - this.ball.x;
    const diff = this.ball.y - this.rightPaddle.y;
    if (Math.abs(diff) > 30 && far < this.botReactionDistance) {
      if (diff < 0) {
        // ball is above the paddle
        this.rightPaddle.body.setVelocityY(-this.botSpeed);
      } else if (diff > 0) {
        // ball is under paddle
        this.rightPaddle.body.setVelocityY(this.botSpeed);
      }
    } else {
      this.rightPaddle.body.setVelocityY(0);
    }
  }
  resetBall() {
    this.ballSpeed = this.ballSpeed + 25;
    const angle = Phaser.Math.Between(0, 360);
    const vector = this.physics.velocityFromAngle(angle, 200);

    this.ball.body.setVelocity(vector.x, vector.y); // Set initial velocity
    this.ball.setPosition(this.resetX, this.resetY);
  }
  addLeftScore() {
    this.playerScore += 1;
    this.leftScore.setText(` ${this.playerScore}`);
  }
  addRightScore() {
    this.botScore += 1;
    this.rightScore.setText(` ${this.botScore}`);
  }
}

export default Game;
