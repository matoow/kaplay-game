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

export type BoostPadDef = {
  pos: [number, number];
  size: [number, number];
  force?: number;
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
  boostPads?: BoostPadDef[];
};

export const sections: Section[] = [
  {
    background: [12, 22, 70],
    ground: { y: 230, height: 28, color: [110, 80, 60] },
    platforms: [
      { pos: [240, 185], size: [90, 16], color: [200, 160, 80] },
      { pos: [420, 145], size: [110, 16], color: [205, 175, 90] },
      { pos: [560, 115], size: [90, 16], color: [210, 180, 100] },
    ],
    traps: [
      { pos: [240, 214], size: [60, 18] },
      { pos: [380, 214], size: [60, 18] },
    ],
    boostPads: [
      { pos: [140, 214], size: [40, 10], force: 520 },
      { pos: [320, 214], size: [40, 10], force: 540 },
    ],
  },
  {
    background: [22, 48, 32],
    ground: { y: 250, height: 38, color: [70, 130, 70] },
    platforms: [
      { pos: [220, 200], size: [110, 18], color: [90, 160, 90] },
      { pos: [380, 165], size: [120, 18], color: [110, 180, 110] },
      { pos: [540, 205], size: [80, 18], color: [120, 200, 120] },
    ],
    traps: [
      { pos: [150, 234], size: [80, 20] },
      { pos: [310, 234], size: [60, 20] },
      { pos: [470, 234], size: [80, 20] },
    ],
    boostPads: [
      { pos: [260, 234], size: [36, 10], force: 560 },
      { pos: [400, 234], size: [36, 10], force: 600 },
    ],
  },
  {
    background: [40, 18, 55],
    ground: { y: 220, height: 34, color: [140, 70, 120] },
    platforms: [
      { pos: [170, 180], size: [80, 16], color: [200, 110, 170] },
      { pos: [300, 140], size: [100, 16], color: [210, 130, 180] },
      { pos: [440, 120], size: [100, 16], color: [215, 140, 190] },
      { pos: [580, 155], size: [80, 16], color: [220, 150, 200] },
    ],
    traps: [
      { pos: [210, 204], size: [60, 18] },
      { pos: [330, 204], size: [60, 18] },
      { pos: [470, 204], size: [80, 18] },
    ],
    boostPads: [
      { pos: [280, 204], size: [36, 10], force: 600 },
      { pos: [560, 204], size: [36, 10], force: 640 },
    ],
  },
  {
    background: [60, 18, 18],
    ground: { y: 200, height: 40, color: [160, 70, 50] },
    platforms: [
      { pos: [210, 165], size: [110, 18], color: [210, 120, 80] },
      { pos: [340, 125], size: [100, 18], color: [220, 130, 90] },
      { pos: [480, 115], size: [120, 18], color: [230, 150, 110] },
      { pos: [600, 155], size: [80, 18], color: [240, 170, 130] },
    ],
    traps: [
      { pos: [140, 184], size: [70, 22] },
      { pos: [280, 184], size: [60, 22] },
      { pos: [400, 184], size: [60, 22] },
      { pos: [520, 184], size: [80, 22] },
    ],
    boostPads: [
      { pos: [240, 184], size: [36, 10], force: 620 },
      { pos: [360, 184], size: [36, 10], force: 660 },
    ],
  },
  {
    background: [18, 40, 70],
    ground: { y: 215, height: 36, color: [90, 90, 120] },
    platforms: [
      { pos: [160, 180], size: [90, 16], color: [150, 170, 210] },
      { pos: [280, 140], size: [100, 16], color: [160, 190, 220] },
      { pos: [420, 110], size: [120, 16], color: [170, 200, 230] },
      { pos: [560, 150], size: [100, 16], color: [180, 210, 240] },
    ],
    traps: [
      { pos: [180, 198], size: [60, 18] },
      { pos: [330, 198], size: [60, 18] },
      { pos: [480, 198], size: [60, 18] },
    ],
    boostPads: [
      { pos: [260, 198], size: [36, 10], force: 640 },
      { pos: [410, 198], size: [36, 10], force: 680 },
    ],
  },
  {
    background: [72, 18, 50],
    ground: { y: 205, height: 42, color: [180, 60, 100] },
    platforms: [
      { pos: [180, 170], size: [100, 18], color: [230, 120, 150] },
      { pos: [320, 130], size: [110, 18], color: [240, 140, 170] },
      { pos: [460, 130], size: [110, 18], color: [245, 150, 190] },
      { pos: [600, 170], size: [100, 18], color: [250, 160, 210] },
    ],
    traps: [
      { pos: [130, 190], size: [70, 20] },
      { pos: [270, 190], size: [70, 20] },
      { pos: [410, 190], size: [70, 20] },
      { pos: [550, 190], size: [70, 20] },
    ],
    boostPads: [
      { pos: [220, 190], size: [34, 10], force: 700 },
      { pos: [360, 190], size: [34, 10], force: 720 },
      { pos: [500, 190], size: [34, 10], force: 740 },
    ],
  },
];
