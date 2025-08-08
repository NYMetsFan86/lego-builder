export type BrickKind = "brick" | "plate";
export type BrickSize = { w: number; l: number; kind: BrickKind }; // in studs

export const BRICK_LIBRARY: BrickSize[] = [
  { w: 1, l: 1, kind: "brick" },
  { w: 1, l: 2, kind: "brick" },
  { w: 2, l: 2, kind: "brick" },
  { w: 2, l: 3, kind: "brick" },
  { w: 2, l: 4, kind: "brick" },
  { w: 1, l: 1, kind: "plate" },
  { w: 1, l: 2, kind: "plate" },
  { w: 2, l: 2, kind: "plate" },
  { w: 2, l: 3, kind: "plate" },
  { w: 2, l: 4, kind: "plate" }
];

export const COLORS = {
  red: "#c91a09",
  blue: "#0055bf",
  yellow: "#f2cd37",
  green: "#237841",
  white: "#ffffff",
  black: "#05131d",
  lightgray: "#c1c2c4",
  darkgray: "#6d6e6c"
} as const;
export type ColorKey = keyof typeof COLORS;

// returns height in plate units
export function heightUnits(kind: BrickKind) { return kind === "brick" ? 3 : 1; }