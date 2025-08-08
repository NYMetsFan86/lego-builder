import { create } from "zustand";
import { nanoid } from "nanoid";
import { BRICK_LIBRARY, BrickSize, ColorKey, COLORS, heightUnits } from "@/lib/lego/bricks";
import { CellKey, keyOf, occupy, vacate } from "@/lib/lego/occupancy";

export type PlacedBrick = {
  id: string;
  size: BrickSize;
  color: ColorKey;
  rotation: number;      // 0, 90, 180, 270
  pos: { x:number; y:number; z:number }; // stud coords; y is plate layer
};

export type SceneState = {
  baseplate: "small"|"medium"|"large";
  bricks: PlacedBrick[];
};

type BuilderStore = {
  // palette
  selectedSize: BrickSize;
  selectedColor: ColorKey;
  rotation: number;
  // scene
  baseplate: "small"|"medium"|"large";
  bricks: PlacedBrick[];
  occupied: Set<CellKey>;
  // actions
  setBaseplate: (s: "small"|"medium"|"large") => void;
  setSelectedSize: (s: BrickSize) => void;
  setSelectedColor: (c: ColorKey) => void;
  rotateCW: () => void;
  placeBrick: (p:{x:number;y:number;z:number}) => boolean;
  removeBrickById: (id:string) => void;
  clear: () => void;
  save: () => void;
  loadScene: (s: SceneState) => void;
};

const defaultSize = BRICK_LIBRARY[3]; // 2x3 brick

const initOccupied = (bricks: PlacedBrick[]) => {
  const set = new Set<CellKey>();
  bricks.forEach(b => occupy(set, b.pos.x, b.pos.y, b.pos.z, b.size, b.rotation));
  return set;
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  selectedSize: defaultSize,
  selectedColor: "lightgray",
  rotation: 0,

  baseplate: "medium",
  bricks: [],
  occupied: new Set<CellKey>(),

  setBaseplate: (b) => set({ baseplate: b }),
  setSelectedSize: (s) => set({ selectedSize: s }),
  setSelectedColor: (c) => set({ selectedColor: c }),
  rotateCW: () => set({ rotation: (get().rotation + 90) % 360 }),

  placeBrick: ({x,y,z}) => {
    const { occupied, selectedSize, rotation, selectedColor, bricks } = get();
    // basic collision
    const { canPlace } = require("@/lib/lego/occupancy");
    if (!canPlace(occupied, x, y, z, selectedSize, rotation)) return false;
    // create and store
    const pb: PlacedBrick = { id: nanoid(8), size: selectedSize, color: selectedColor, rotation, pos: {x,y,z} };
    const next = [...bricks, pb];
    const nextOcc = new Set<CellKey>(occupied);
    occupy(nextOcc, x, y, z, selectedSize, rotation);
    set({ bricks: next, occupied: nextOcc });
    return true;
  },

  removeBrickById: (id) => {
    const { bricks, occupied } = get();
    const idx = bricks.findIndex(b => b.id === id);
    if (idx < 0) return;
    const brick = bricks[idx];
    const next = [...bricks.slice(0, idx), ...bricks.slice(idx+1)];
    const nextOcc = new Set<CellKey>(occupied);
    vacate(nextOcc, brick.pos.x, brick.pos.y, brick.pos.z, brick.size, brick.rotation);
    set({ bricks: next, occupied: nextOcc });
  },

  clear: () => set({ bricks: [], occupied: new Set<CellKey>() }),

  save: () => {
    const { bricks, baseplate } = get();
    const scene: SceneState = { bricks, baseplate };
    const { saveToLocalStorage } = require("@/lib/io/serialize");
    saveToLocalStorage(scene);
  },

  loadScene: (scene) => {
    const occupied = initOccupied(scene.bricks);
    set({ bricks: scene.bricks, baseplate: scene.baseplate, occupied });
  }
}));