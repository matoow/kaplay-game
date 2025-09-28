import type { GameObj } from "kaplay";

import { INITIAL_LIVES } from "./constants";

export type GameState = {
  currentSection: number;
  sectionObjects: GameObj[];
  hasFinished: boolean;
  finishBanner: GameObj | null;
  lives: number;
  livesText: GameObj | null;
  isRespawning: boolean;
};

export function createInitialState(): GameState {
  return {
    currentSection: 0,
    sectionObjects: [],
    hasFinished: false,
    finishBanner: null,
    lives: INITIAL_LIVES,
    livesText: null,
    isRespawning: false,
  };
}
