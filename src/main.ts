import kaplay, { type GameObj } from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();

type TrapDef = {
  pos: [number, number];
  size: [number, number];
  color?: [number, number, number];
};

type Section = {
  background: [number, number, number];
  ground: {
    y: number;
    height: number;
    color: [number, number, number];
  };
  platforms?: {
    pos: [number, number];
    size: [number, number];
    color?: [number, number, number];
  }[];
  traps?: TrapDef[];
};

const sections: Section[] = [
  {
    background: [20, 28, 70],
    ground: { y: 220, height: 32, color: [120, 80, 40] },
    platforms: [
      { pos: [220, 160], size: [120, 18], color: [200, 180, 80] },
    ],
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
    platforms: [
      { pos: [260, 150], size: [160, 18], color: [210, 120, 80] },
    ],
    traps: [
      { pos: [200, 190], size: [60, 22] },
      { pos: [340, 190], size: [60, 22] },
    ],
  },
];

let currentSection = 0;
let sectionObjects: GameObj[] = [];

const SCREEN_EDGE_OFFSET = 48;
const SPAWN_AIR_OFFSET = 64;
const TRAP_COLOR: [number, number, number] = [210, 60, 60];
const START_COLOR: [number, number, number] = [255, 230, 0];
const FINISH_COLOR: [number, number, number] = [120, 200, 255];

let hasFinished = false;
let finishBanner: GameObj | null = null;

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

// keep a reference to the player sprite
const pacman = k.add([
  k.pos(120, 80),
  k.sprite("pacman", { anim: "chomp" }),
  k.anchor("center"),
  k.area(),
  k.body(),
]);

type LoadSectionOpts = {
  entry?: "left" | "right";
};

function loadSection(index: number, opts: LoadSectionOpts = {}) {
  const clampedIndex = k.clamp(index, 0, sections.length - 1);
  currentSection = clampedIndex;

  hasFinished = false;

  sectionObjects.forEach((obj) => obj.destroy());
  sectionObjects = [];

  if (finishBanner) {
    finishBanner.destroy();
    finishBanner = null;
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
  ]);
  sectionObjects.push(ground);

  section.platforms?.forEach((platform) => {
    const platformColor = platform.color ?? [170, 170, 170];
    const platformObj = k.add([
      k.pos(...platform.pos),
      k.rect(...platform.size),
      k.color(...platformColor),
      k.area(),
      k.body({ isStatic: true }),
      k.anchor("center"),
    ]);
    sectionObjects.push(platformObj);
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
    ]);
    sectionObjects.push(trapObj);
  });

  if (clampedIndex === 0) {
    const startPad = k.add([
      k.pos(SCREEN_EDGE_OFFSET - 20, section.ground.y - 6),
      k.rect(80, 12),
      k.color(...START_COLOR),
      k.anchor("center"),
    ]);
    sectionObjects.push(startPad);

    const startLabel = k.add([
      k.pos(SCREEN_EDGE_OFFSET + 20, section.ground.y - 50),
      k.anchor("center"),
      k.text("START", { size: 20 }),
      k.color(...START_COLOR),
    ]);
    sectionObjects.push(startLabel);
  }

  if (clampedIndex === sections.length - 1) {
    const finishLine = k.add([
      "finish",
      k.pos(k.width() - SCREEN_EDGE_OFFSET, section.ground.y),
      k.rect(16, section.ground.height + 160),
      k.anchor("botleft"),
      k.color(...FINISH_COLOR),
      k.area(),
    ]);
    sectionObjects.push(finishLine);

    const finishLabel = k.add([
      k.pos(k.width() - SCREEN_EDGE_OFFSET + 40, section.ground.y - 120),
      k.anchor("center"),
      k.text("FINISH", { size: 20 }),
      k.color(...FINISH_COLOR),
    ]);
    sectionObjects.push(finishLabel);
  }

  const spawnX = (() => {
    if (opts.entry === "left") {
      return SCREEN_EDGE_OFFSET;
    }
    if (opts.entry === "right") {
      return k.width() - SCREEN_EDGE_OFFSET;
    }
    return k.clamp(pacman.pos.x, SCREEN_EDGE_OFFSET, k.width() - SCREEN_EDGE_OFFSET);
  })();

  const spawnY = section.ground.y - SPAWN_AIR_OFFSET;

  pacman.pos = k.vec2(spawnX, spawnY);
  pacman.vel = k.vec2(0, 0);

  if (opts.entry === "left") {
    pacman.angle = 0;
  } else if (opts.entry === "right") {
    pacman.angle = 180;
  }
}

loadSection(currentSection);

function respawnToStart() {
  loadSection(0, { entry: "left" });
}

function handleFinish() {
  if (hasFinished) {
    return;
  }

  hasFinished = true;
  pacman.vel = k.vec2(0, 0);
  pacman.pos.x = k.width() - SCREEN_EDGE_OFFSET - 24;
  finishBanner = k.add([
    k.pos(k.width() / 2, 80),
    k.anchor("center"),
    k.text("Level Complete!", { size: 28 }),
    k.color(255, 255, 255),
  ]);
}

pacman.onCollide("trap", () => {
  respawnToStart();
});

pacman.onCollide("finish", () => {
  handleFinish();
});

// movement speed in pixels per second
const SPEED = 160;
const JUMP_FORCE = 420;

k.onUpdate(() => {
  if (hasFinished) {
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
    if (currentSection < sections.length - 1) {
      loadSection(currentSection + 1, { entry: "left" });
      return;
    }
    pacman.pos.x = k.width() - SCREEN_EDGE_OFFSET;
  } else if (pacman.pos.x < -SCREEN_EDGE_OFFSET) {
    if (currentSection > 0) {
      loadSection(currentSection - 1, { entry: "right" });
      return;
    }
    pacman.pos.x = SCREEN_EDGE_OFFSET;
  }

  if (pacman.pos.y > k.height() + SPAWN_AIR_OFFSET * 4) {
    loadSection(currentSection);
  }
});

k.onKeyPress(["up", "space"], () => {
  if (pacman.isGrounded()) {
    pacman.jump(JUMP_FORCE);
  }
});

k.onClick(() => {
  k.addKaboom(k.mousePos());
  console.log("kaboom!");
});
