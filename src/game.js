import Paddle from "/src/paddle.js";
import InputHandler from "/src/input.js";
import Ball from "/src/ball.js";
import Brick from "/src/brick.js";

import { buildLevel, level1, level2 } from "/src/level.js"

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWlEVEL: 4
}

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.gamestate = GAMESTATE.MENU;
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.gameObjects = [];
    this.bricks = [];
    this.live = 3;

    this.levels = [level1, level2];
    this.currentLevel = 0;

    new InputHandler(this.paddle, this);
  }

  start() {
    if (this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.NEWlEVEL) return;


    //add more bricks
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [
      this.ball,
      this.paddle
    ];

    this.gamestate = GAMESTATE.RUNNING;

  }

  update(deltaTime) {
    if (this.live === 0) this.gamestate = GAMESTATE.GAMEOVER;

    if (this.gamestate === GAMESTATE.PAUSED
      || this.gamestate === GAMESTATE.MENU
      || this.gamestate === GAMESTATE.GAMEOVER
    ) return;
    
    if(this.bricks.length === 0) {
      this.currentLevel++;
      this.gamestate = GAMESTATE.NEWlEVEL;
      this.start();
    }

    [...this.gameObjects, ...this.bricks].forEach(object => object.update(deltaTime));


    this.bricks = this.bricks.filter(bricks => !bricks.markForDeletion);
  }

  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.fillText("Press spacbar to start", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}