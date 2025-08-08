import { BrickSize, heightUnits } from "./bricks";

export type CellKey = string; // "x,y,z"
export const keyOf = (x:number, y:number, z:number) => `${x},${y},${z}`;
export const parseKey = (k: CellKey) => k.split(",").map(n => parseInt(n, 10)) as [number,number,number];

export type Footprint = { cells: [number, number, number][] };

export function footprintCells(x:number, y:number, z:number, size:BrickSize, rotation:number): Footprint {
  const rot = ((rotation % 360) + 360) % 360;
  const w = (rot === 90 || rot === 270) ? size.l : size.w;
  const l = (rot === 90 || rot === 270) ? size.w : size.l;
  const h = heightUnits(size.kind, size.h);
  
  const cells: [number, number, number][] = [];
  
  // Occupy all layers based on piece height
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      for (let dz = 0; dz < l; dz++) {
        cells.push([x + dx, y + dy, z + dz]);
      }
    }
  }
  
  return { cells };
}

export function canPlace(occupied:Set<CellKey>, x:number, y:number, z:number, size:BrickSize, rotation:number): boolean {
  const fp = footprintCells(x, y, z, size, rotation);
  for (const c of fp.cells) {
    if (occupied.has(keyOf(c[0], c[1], c[2]))) return false;
  }
  return true;
}

export function occupy(occupied:Set<CellKey>, x:number, y:number, z:number, size:BrickSize, rotation:number) {
  footprintCells(x, y, z, size, rotation).cells.forEach(c => occupied.add(keyOf(c[0], c[1], c[2])));
}

export function vacate(occupied:Set<CellKey>, x:number, y:number, z:number, size:BrickSize, rotation:number) {
  footprintCells(x, y, z, size, rotation).cells.forEach(c => occupied.delete(keyOf(c[0], c[1], c[2])));
}

// world Y from plate layer
export function worldYFor(layer:number, size:BrickSize) {
  const { PLATE } = require("./units");
  const h = heightUnits(size.kind, size.h);
  // layer is in plate units, h is also in plate units
  // Convert to world units and add half height for center
  return layer * PLATE + (h * PLATE * 0.5);
}