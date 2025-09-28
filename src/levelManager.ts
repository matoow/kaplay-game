import type { GameObj, KAPLAYCtx } from "kaplay";

import {
  FINISH_COLOR,
  INITIAL_LIVES,
  SCREEN_EDGE_OFFSET,
  SPAWN_AIR_OFFSET,
  START_COLOR,
  TRAP_COLOR,
} from "./constants";
import { sections } from "./sections";
import type { GameState } from "./state";
import { ensureLivesUI, updateLivesUI } from "./ui";

export type LoadSectionOpts = {
  entry?: "left" | "right";
};

export function createLevelManager(
  k: KAPLAYCtx,
  pacman: GameObj,
  state: GameState,
) {
  function loadSection(index: number, opts: LoadSectionOpts = {}) {
    const clampedIndex = k.clamp(index, 0, sections.length - 1);
    state.currentSection = clampedIndex;
    state.hasFinished = false;
    state.isRespawning = false;

    state.sectionObjects.forEach((obj) => obj.destroy());
    state.sectionObjects = [];

    if (state.finishBanner) {
      state.finishBanner.destroy();
      state.finishBanner = null;
    }

    const section = sections[clampedIndex];
    const [bgR, bgG, bgB] = section.background;
    k.setBackground(k.rgb(bgR, bgG, bgB));

    const ground = k.add([
      k.pos(0, section.ground.y),
      k.rect(k.width(), section.ground.height),
      k.color(...section.ground.color),
      k.area(),
      k.body({ isStatic: true }),
      k.anchor("topleft"),
    ]) as GameObj;
    state.sectionObjects.push(ground);

    section.platforms?.forEach((platform) => {
      const platformColor = platform.color ?? [170, 170, 170];
      const platformObj = k.add([
        k.pos(...platform.pos),
        k.rect(...platform.size),
        k.color(...platformColor),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
      ]) as GameObj;
      state.sectionObjects.push(platformObj);
    });

    section.traps?.forEach((trap) => {
      const trapColor = trap.color ?? TRAP_COLOR;
      const trapObj = k.add([
        "trap",
        k.pos(...trap.pos),
        k.rect(...trap.size),
        k.color(...trapColor),
        k.area(),
        k.anchor("topleft"),
      ]) as GameObj;
      state.sectionObjects.push(trapObj);
    });

    if (clampedIndex === 0) {
      const startPad = k.add([
        k.pos(SCREEN_EDGE_OFFSET - 20, section.ground.y - 6),
        k.rect(80, 12),
        k.color(...START_COLOR),
        k.anchor("center"),
      ]) as GameObj;
      state.sectionObjects.push(startPad);

      const startLabel = k.add([
        k.pos(SCREEN_EDGE_OFFSET + 20, section.ground.y - 50),
        k.anchor("center"),
        k.text("START", { size: 20 }),
        k.color(...START_COLOR),
      ]) as GameObj;
      state.sectionObjects.push(startLabel);
    }

    if (clampedIndex === sections.length - 1) {
      const finishLine = k.add([
        "finish",
        k.pos(k.width() - SCREEN_EDGE_OFFSET, section.ground.y),
        k.rect(16, section.ground.height + 160),
        k.anchor("botleft"),
        k.color(...FINISH_COLOR),
        k.area(),
      ]) as GameObj;
      state.sectionObjects.push(finishLine);

      const finishLabel = k.add([
        k.pos(k.width() - SCREEN_EDGE_OFFSET + 40, section.ground.y - 120),
        k.anchor("center"),
        k.text("FINISH", { size: 20 }),
        k.color(...FINISH_COLOR),
      ]) as GameObj;
      state.sectionObjects.push(finishLabel);
    }

    ensureLivesUI(k, state);

    const spawnX = (() => {
      if (opts.entry === "left") {
        return SCREEN_EDGE_OFFSET;
      }
      if (opts.entry === "right") {
        return k.width() - SCREEN_EDGE_OFFSET;
      }
      return k.clamp(
        pacman.pos.x,
        SCREEN_EDGE_OFFSET,
        k.width() - SCREEN_EDGE_OFFSET,
      );
    })();

    const spawnY = section.ground.y - SPAWN_AIR_OFFSET;

    pacman.pos = k.vec2(spawnX, spawnY);
    pacman.vel = k.vec2(0, 0);
    pacman.gravityScale = 1;

    if (opts.entry === "left") {
      pacman.angle = 0;
    } else if (opts.entry === "right") {
      pacman.angle = 180;
    }
  }

  function handleFinish() {
    if (state.hasFinished) {
      return;
    }

    state.hasFinished = true;
    pacman.vel = k.vec2(0, 0);
    pacman.pos.x = k.width() - SCREEN_EDGE_OFFSET - 24;
    state.finishBanner = k.add([
      k.pos(k.width() / 2, 80),
      k.anchor("center"),
      k.text("Level Complete!", { size: 28 }),
      k.color(255, 255, 255),
    ]) as GameObj;
  }

  function handleGameOver() {
    state.hasFinished = true;
    state.isRespawning = false;
    pacman.vel = k.vec2(0, 0);
    pacman.gravityScale = 0;
    if (state.finishBanner) {
      state.finishBanner.destroy();
    }
    state.finishBanner = k.add([
      k.pos(k.width() / 2, k.height() / 2),
      k.anchor("center"),
      k.text("Game Over", { size: 32 }),
      k.color(255, 80, 80),
    ]) as GameObj;
    updateLivesUI(state);
  }

  function respawnToStart() {
    if (state.hasFinished || state.isRespawning) {
      return;
    }

    state.isRespawning = true;
    state.lives -= 1;
    if (state.lives <= 0) {
      state.lives = 0;
      updateLivesUI(state);
      handleGameOver();
      return;
    }

    updateLivesUI(state);
    loadSection(0, { entry: "left" });
  }

  function resetGame() {
    state.lives = INITIAL_LIVES;
    state.hasFinished = false;
    state.isRespawning = false;
    if (state.finishBanner) {
      state.finishBanner.destroy();
      state.finishBanner = null;
    }
    updateLivesUI(state);
    loadSection(0, { entry: "left" });
  }

  return {
    loadSection,
    respawnToStart,
    handleFinish,
    handleGameOver,
    resetGame,
  };
}
