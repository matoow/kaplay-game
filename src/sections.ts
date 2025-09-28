export type TrapDef = {
  pos: [number, number];
  size: [number, number];
  color?: [number, number, number];
};

export type PlatformDef = {
  pos: [number, number];
  size: [number, number];
  color?: [number, number, number];
};

export type Section = {
  background: [number, number, number];
  ground: {
    y: number;
    height: number;
    color: [number, number, number];
  };
  platforms?: PlatformDef[];
  traps?: TrapDef[];
};

export const sections: Section[] = [
  {
    background: [20, 28, 70],
    ground: { y: 220, height: 32, color: [120, 80, 40] },
    platforms: [{ pos: [220, 160], size: [120, 18], color: [200, 180, 80] }],
    traps: [
      { pos: [280, 204], size: [60, 18] },
      { pos: [420, 204], size: [48, 18] },
    ],
  },
  {
    background: [32, 50, 28],
    ground: { y: 240, height: 36, color: [60, 120, 60] },
    platforms: [
      { pos: [160, 180], size: [100, 18], color: [90, 160, 90] },
      { pos: [400, 140], size: [140, 18], color: [90, 160, 90] },
    ],
    traps: [
      { pos: [220, 220], size: [70, 20] },
      { pos: [360, 210], size: [60, 20] },
    ],
  },
  {
    background: [50, 20, 20],
    ground: { y: 210, height: 40, color: [150, 70, 50] },
    platforms: [{ pos: [260, 150], size: [160, 18], color: [210, 120, 80] }],
    traps: [
      { pos: [200, 190], size: [60, 22] },
      { pos: [340, 190], size: [60, 22] },
    ],
  },
];
