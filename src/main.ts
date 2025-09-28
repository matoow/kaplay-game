import kaplay, { type GameObj } from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

import {
  FALL_RESET_MULTIPLIER,
  SCREEN_EDGE_OFFSET,
  SPAWN_AIR_OFFSET,
  SPEED,
  JUMP_FORCE,
} from "./constants";
import { createLevelManager } from "./levelManager";
import { sections } from "./sections";
import { createInitialState } from "./state";

const k = kaplay();

k.loadRoot("./");
k.loadSprite("pacman", "sprites/pacman.png", {
  sliceX: 4,
  anims: {
    chomp: {
      from: 0,
      to: 3,
      speed: 12,
      loop: true,
    },
  },
});

k.setGravity(1200);

const pacman = k.add([
  k.pos(120, 80),
  k.sprite("pacman", { anim: "chomp" }),
  k.anchor("center"),
  k.area(),
  k.body(),
]) as GameObj;

const state = createInitialState();
const { loadSection, respawnToStart, handleFinish, resetGame } = createLevelManager(
  k,
  pacman,
  state,
);

loadSection(state.currentSection);

pacman.onCollide("trap", () => {
  respawnToStart();
});

pacman.onCollide("finish", () => {
  handleFinish();
});

k.onUpdate(() => {
  if (state.hasFinished) {
    pacman.vel.x = 0;
    return;
  }

  let moveX = 0;

  if (k.isKeyDown("left")) {
    moveX -= 1;
  }
  if (k.isKeyDown("right")) {
    moveX += 1;
  }

  pacman.vel.x = moveX * SPEED;

  if (moveX !== 0) {
    pacman.angle = moveX < 0 ? 180 : 0;
  }

  if (pacman.pos.x > k.width() + SCREEN_EDGE_OFFSET) {
    if (state.currentSection < sections.length - 1) {
      loadSection(state.currentSection + 1, { entry: "left" });
      return;
    }
    pacman.pos.x = k.width() - SCREEN_EDGE_OFFSET;
  } else if (pacman.pos.x < -SCREEN_EDGE_OFFSET) {
    if (state.currentSection > 0) {
      loadSection(state.currentSection - 1, { entry: "right" });
      return;
    }
    pacman.pos.x = SCREEN_EDGE_OFFSET;
  }

  if (pacman.pos.y > k.height() + SPAWN_AIR_OFFSET * FALL_RESET_MULTIPLIER) {
    respawnToStart();
  }
});

k.onKeyPress(["up", "space"], () => {
  if (pacman.isGrounded()) {
    pacman.jump(JUMP_FORCE);
  }
});

k.onKeyPress("r", () => {
  resetGame();
});
