import type { GameObj, KAPLAYCtx } from "kaplay";

import type { GameState } from "./state";

export function ensureLivesUI(k: KAPLAYCtx, state: GameState) {
  if (!state.livesText) {
    state.livesText = k.add([
      k.pos(16, 16),
      k.anchor("topleft"),
      k.fixed(),
      k.text("Lives: " + state.lives, { size: 18 }),
      k.color(255, 255, 255),
    ]) as GameObj;
  }

  updateLivesUI(state);
}

export function updateLivesUI(state: GameState) {
  if (!state.livesText) {
    return;
  }
  state.livesText.text = `Lives: ${Math.max(state.lives, 0)}`;
}

export function ensureProgressUI(k: KAPLAYCtx, state: GameState, total: number) {
  if (!state.progressText) {
    state.progressText = k.add([
      k.pos(k.width() - 16, 16),
      k.anchor("topright"),
      k.fixed(),
      k.text("", { size: 18 }),
      k.color(255, 255, 255),
    ]) as GameObj;
  }

  updateProgressUI(state, total);
}

export function updateProgressUI(state: GameState, total: number) {
  if (!state.progressText) {
    return;
  }
  state.progressText.text = `Stage ${state.currentSection + 1} / ${total}`;
}
