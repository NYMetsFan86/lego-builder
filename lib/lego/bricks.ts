export type BrickKind = "brick" | "plate" | "tile" | "slope" | "specialty";
export type BrickCategory = "basic" | "plates" | "slopes" | "specialty" | "technic" | "windows" | "wheels";

export type BrickSize = { 
  w: number;      // width in studs
  l: number;      // length in studs
  h?: number;     // height in plates (default: 3 for brick, 1 for plate)
  kind: BrickKind;
  category: BrickCategory;
  name: string;
  partNum?: string;  // Official LEGO part number
  hasStuds?: boolean; // Some tiles don't have studs
  slopeAngle?: number; // For slope pieces
  partType?: "wing" | "engine" | "cockpit" | "fuselage" | "tail"; // For airplane parts
  wingType?: "swept" | "straight" | "delta" | "fighter"; // Wing styles
};

// Height is measured in PLATES - 1 brick = 3 plates
// LEGO proportions: 1 stud = 8mm, 1 plate height = 3.2mm, 1 brick = 9.6mm

export const BRICK_LIBRARY: BrickSize[] = [
  // ========== BASIC BRICKS (3 plates tall) ==========
  { w: 1, l: 1, kind: "brick", category: "basic", name: "1×1 Brick", partNum: "3005" },
  { w: 1, l: 2, kind: "brick", category: "basic", name: "1×2 Brick", partNum: "3004" },
  { w: 1, l: 3, kind: "brick", category: "basic", name: "1×3 Brick", partNum: "3622" },
  { w: 1, l: 4, kind: "brick", category: "basic", name: "1×4 Brick", partNum: "3010" },
  { w: 1, l: 6, kind: "brick", category: "basic", name: "1×6 Brick", partNum: "3009" },
  { w: 1, l: 8, kind: "brick", category: "basic", name: "1×8 Brick", partNum: "3008" },
  { w: 2, l: 2, kind: "brick", category: "basic", name: "2×2 Brick", partNum: "3003" },
  { w: 2, l: 3, kind: "brick", category: "basic", name: "2×3 Brick", partNum: "3002" },
  { w: 2, l: 4, kind: "brick", category: "basic", name: "2×4 Brick", partNum: "3001" },
  { w: 2, l: 6, kind: "brick", category: "basic", name: "2×6 Brick", partNum: "2456" },
  { w: 2, l: 8, kind: "brick", category: "basic", name: "2×8 Brick", partNum: "3007" },
  { w: 2, l: 10, kind: "brick", category: "basic", name: "2×10 Brick", partNum: "3006" },

  // ========== PLATES (1 plate tall) ==========
  { w: 1, l: 1, kind: "plate", category: "plates", name: "1×1 Plate", partNum: "3024" },
  { w: 1, l: 2, kind: "plate", category: "plates", name: "1×2 Plate", partNum: "3023" },
  { w: 1, l: 3, kind: "plate", category: "plates", name: "1×3 Plate", partNum: "3623" },
  { w: 1, l: 4, kind: "plate", category: "plates", name: "1×4 Plate", partNum: "3710" },
  { w: 1, l: 6, kind: "plate", category: "plates", name: "1×6 Plate", partNum: "3666" },
  { w: 1, l: 8, kind: "plate", category: "plates", name: "1×8 Plate", partNum: "3460" },
  { w: 1, l: 10, kind: "plate", category: "plates", name: "1×10 Plate", partNum: "4477" },
  { w: 2, l: 2, kind: "plate", category: "plates", name: "2×2 Plate", partNum: "3022" },
  { w: 2, l: 3, kind: "plate", category: "plates", name: "2×3 Plate", partNum: "3021" },
  { w: 2, l: 4, kind: "plate", category: "plates", name: "2×4 Plate", partNum: "3020" },
  { w: 2, l: 6, kind: "plate", category: "plates", name: "2×6 Plate", partNum: "3795" },
  { w: 2, l: 8, kind: "plate", category: "plates", name: "2×8 Plate", partNum: "3034" },
  { w: 2, l: 10, kind: "plate", category: "plates", name: "2×10 Plate", partNum: "3832" },
  { w: 2, l: 12, kind: "plate", category: "plates", name: "2×12 Plate", partNum: "2445" },
  { w: 2, l: 16, kind: "plate", category: "plates", name: "2×16 Plate", partNum: "4282" },
  { w: 4, l: 4, kind: "plate", category: "plates", name: "4×4 Plate", partNum: "3031" },
  { w: 4, l: 6, kind: "plate", category: "plates", name: "4×6 Plate", partNum: "3032" },
  { w: 4, l: 8, kind: "plate", category: "plates", name: "4×8 Plate", partNum: "3035" },
  { w: 4, l: 10, kind: "plate", category: "plates", name: "4×10 Plate", partNum: "3030" },
  { w: 4, l: 12, kind: "plate", category: "plates", name: "4×12 Plate", partNum: "3029" },
  { w: 6, l: 6, kind: "plate", category: "plates", name: "6×6 Plate", partNum: "3958" },
  { w: 6, l: 8, kind: "plate", category: "plates", name: "6×8 Plate", partNum: "3036" },
  { w: 6, l: 10, kind: "plate", category: "plates", name: "6×10 Plate", partNum: "3033" },
  { w: 6, l: 12, kind: "plate", category: "plates", name: "6×12 Plate", partNum: "3028" },
  { w: 6, l: 14, kind: "plate", category: "plates", name: "6×14 Plate", partNum: "3456" },
  { w: 6, l: 16, kind: "plate", category: "plates", name: "6×16 Plate", partNum: "3027" },
  { w: 8, l: 8, kind: "plate", category: "plates", name: "8×8 Plate", partNum: "41539" },
  { w: 8, l: 16, kind: "plate", category: "plates", name: "8×16 Plate", partNum: "92438" },

  // ========== TILES (plates without studs) ==========
  { w: 1, l: 1, kind: "tile", category: "plates", name: "1×1 Tile", partNum: "3070", hasStuds: false },
  { w: 1, l: 2, kind: "tile", category: "plates", name: "1×2 Tile", partNum: "3069", hasStuds: false },
  { w: 1, l: 3, kind: "tile", category: "plates", name: "1×3 Tile", partNum: "63864", hasStuds: false },
  { w: 1, l: 4, kind: "tile", category: "plates", name: "1×4 Tile", partNum: "2431", hasStuds: false },
  { w: 1, l: 6, kind: "tile", category: "plates", name: "1×6 Tile", partNum: "6636", hasStuds: false },
  { w: 1, l: 8, kind: "tile", category: "plates", name: "1×8 Tile", partNum: "4162", hasStuds: false },
  { w: 2, l: 2, kind: "tile", category: "plates", name: "2×2 Tile", partNum: "3068", hasStuds: false },
  { w: 2, l: 3, kind: "tile", category: "plates", name: "2×3 Tile", partNum: "26603", hasStuds: false },
  { w: 2, l: 4, kind: "tile", category: "plates", name: "2×4 Tile", partNum: "87079", hasStuds: false },

  // ========== SLOPES ==========
  { w: 1, l: 1, kind: "slope", category: "slopes", name: "1×1 Slope 45°", partNum: "50746", slopeAngle: 45 },
  { w: 1, l: 2, kind: "slope", category: "slopes", name: "1×2 Slope 45°", partNum: "3040", slopeAngle: 45 },
  { w: 1, l: 3, kind: "slope", category: "slopes", name: "1×3 Slope 25°", partNum: "4286", slopeAngle: 25 },
  { w: 1, l: 4, kind: "slope", category: "slopes", name: "1×4 Slope 18°", partNum: "60477", slopeAngle: 18 },
  { w: 2, l: 1, kind: "slope", category: "slopes", name: "2×1 Slope 45°", partNum: "3040", slopeAngle: 45 },
  { w: 2, l: 2, kind: "slope", category: "slopes", name: "2×2 Slope 45°", partNum: "3039", slopeAngle: 45 },
  { w: 2, l: 3, kind: "slope", category: "slopes", name: "2×3 Slope 25°", partNum: "3298", slopeAngle: 25 },
  { w: 2, l: 4, kind: "slope", category: "slopes", name: "2×4 Slope 18°", partNum: "3037", slopeAngle: 18 },
  { w: 3, l: 1, kind: "slope", category: "slopes", name: "3×1 Slope 45°", partNum: "50950", slopeAngle: 45 },
  { w: 3, l: 2, kind: "slope", category: "slopes", name: "3×2 Slope 25°", partNum: "3298", slopeAngle: 25 },
  { w: 4, l: 1, kind: "slope", category: "slopes", name: "4×1 Slope 45°", partNum: "60481", slopeAngle: 45 },
  { w: 4, l: 2, kind: "slope", category: "slopes", name: "4×2 Slope 18°", partNum: "3037", slopeAngle: 18 },

  // ========== SPECIALTY PIECES ==========
  { w: 1, l: 1, kind: "specialty", category: "specialty", name: "1×1 Round Brick", partNum: "3062" },
  { w: 2, l: 2, kind: "specialty", category: "specialty", name: "2×2 Round Brick", partNum: "3941" },
  { w: 2, l: 2, kind: "specialty", category: "specialty", name: "2×2 Corner Brick", partNum: "2357" },
  { w: 1, l: 1, kind: "specialty", category: "specialty", name: "1×1 Cone", partNum: "4589" },
  { w: 2, l: 2, kind: "specialty", category: "specialty", name: "2×2 Dome", partNum: "553" },
  { w: 1, l: 2, kind: "specialty", category: "specialty", name: "1×2 Grille", partNum: "2412" },
  { w: 1, l: 4, kind: "specialty", category: "specialty", name: "1×4 Arch", partNum: "3659" },
  { w: 1, l: 6, kind: "specialty", category: "specialty", name: "1×6 Arch", partNum: "92950" },

  // ========== TECHNIC PIECES ==========
  { w: 1, l: 2, kind: "specialty", category: "technic", name: "1×2 Technic Brick", partNum: "3700" },
  { w: 1, l: 4, kind: "specialty", category: "technic", name: "1×4 Technic Brick", partNum: "3701" },
  { w: 1, l: 6, kind: "specialty", category: "technic", name: "1×6 Technic Brick", partNum: "3894" },
  { w: 1, l: 8, kind: "specialty", category: "technic", name: "1×8 Technic Brick", partNum: "3702" },
  { w: 1, l: 10, kind: "specialty", category: "technic", name: "1×10 Technic Brick", partNum: "2730" },
  { w: 1, l: 12, kind: "specialty", category: "technic", name: "1×12 Technic Brick", partNum: "3895" },
  { w: 1, l: 16, kind: "specialty", category: "technic", name: "1×16 Technic Brick", partNum: "3703" },

  // ========== WINDOWS & DOORS ==========
  { w: 1, l: 2, kind: "specialty", category: "windows", name: "1×2×2 Window", partNum: "60592" },
  { w: 1, l: 2, h: 9, kind: "specialty", category: "windows", name: "1×2×3 Window", partNum: "60593" },
  { w: 1, l: 4, h: 9, kind: "specialty", category: "windows", name: "1×4×3 Window", partNum: "3853" },
  { w: 1, l: 4, h: 18, kind: "specialty", category: "windows", name: "1×4×6 Window Frame", partNum: "57894" },
  { w: 1, l: 4, h: 15, kind: "specialty", category: "windows", name: "1×4×5 Door Frame", partNum: "73312" },

  // ========== WHEELS & AXLES ==========
  { w: 2, l: 2, kind: "specialty", category: "wheels", name: "2×2 Wheel Hub", partNum: "3641" },
  { w: 4, l: 4, kind: "specialty", category: "wheels", name: "4×4 Wheel Hub", partNum: "4624" },
  { w: 2, l: 2, kind: "specialty", category: "wheels", name: "2×2 Wheel (Small)", partNum: "6014" },
  { w: 3, l: 3, kind: "specialty", category: "wheels", name: "3×3 Wheel (Medium)", partNum: "30155" },
  { w: 4, l: 4, kind: "specialty", category: "wheels", name: "4×4 Wheel (Large)", partNum: "2515" },
  { w: 2, l: 6, kind: "plate", category: "wheels", name: "2×6 Vehicle Base", partNum: "52036" },
  { w: 4, l: 10, kind: "plate", category: "wheels", name: "4×10 Vehicle Base", partNum: "30076" },

  // ========== AIRPLANE PARTS ==========
  { w: 6, l: 2, kind: "specialty", category: "specialty", name: "6×2 Wing Straight", partNum: "A001", partType: "wing", wingType: "straight" },
  { w: 8, l: 2, kind: "specialty", category: "specialty", name: "8×2 Wing Swept", partNum: "A002", partType: "wing", wingType: "swept" },
  { w: 4, l: 3, kind: "specialty", category: "specialty", name: "4×3 Wing Delta", partNum: "A003", partType: "wing", wingType: "delta" },
  { w: 10, l: 2, kind: "specialty", category: "specialty", name: "10×2 Wing Fighter", partNum: "A004", partType: "wing", wingType: "fighter" },
  { w: 2, l: 4, kind: "specialty", category: "specialty", name: "2×4 Engine Nacelle", partNum: "A101", partType: "engine" },
  { w: 3, l: 6, kind: "specialty", category: "specialty", name: "3×6 Engine Large", partNum: "A102", partType: "engine" },
  { w: 2, l: 3, kind: "specialty", category: "specialty", name: "2×3 Cockpit Bubble", partNum: "A201", partType: "cockpit" },
  { w: 3, l: 4, kind: "specialty", category: "specialty", name: "3×4 Cockpit Large", partNum: "A202", partType: "cockpit" },
  { w: 2, l: 8, kind: "specialty", category: "specialty", name: "2×8 Fuselage", partNum: "A301", partType: "fuselage" },
  { w: 3, l: 12, kind: "specialty", category: "specialty", name: "3×12 Fuselage Large", partNum: "A302", partType: "fuselage" },
  { w: 3, l: 2, kind: "specialty", category: "specialty", name: "3×2 Vertical Tail", partNum: "A401", partType: "tail" },
  { w: 4, l: 2, kind: "specialty", category: "specialty", name: "4×2 Tail Large", partNum: "A402", partType: "tail" },
];

export const COLORS = {
  red: "#c91a09",
  blue: "#0055bf",
  yellow: "#f2cd37",
  green: "#237841",
  white: "#ffffff",
  black: "#05131d",
  lightgray: "#9ba19d",
  darkgray: "#6d6e6c",
  orange: "#fe8a18",
  limegreen: "#bbd905",
  turquoise: "#008f9b",
  pink: "#ff698f",
  purple: "#845e84",
  brown: "#583927",
  tan: "#e4cd9e",
  darkred: "#720e0f",
  darkblue: "#0a3463",
  darkgreen: "#184632",
  sand: "#d67572",
  lavender: "#e1d5ed"
} as const;

export type ColorKey = keyof typeof COLORS;

// Category display names
export const CATEGORY_NAMES: Record<BrickCategory, string> = {
  basic: "Basic Bricks",
  plates: "Plates & Tiles",
  slopes: "Slopes",
  specialty: "Special Pieces",
  technic: "Technic",
  windows: "Windows & Doors",
  wheels: "Wheels & Vehicle"
};

// returns height in plate units
export function heightUnits(kind: BrickKind, customHeight?: number) {
  if (customHeight !== undefined) return customHeight;
  
  switch (kind) {
    case "brick":
      return 3; // 1 brick = 3 plates
    case "plate":
    case "tile":
      return 1; // 1 plate height
    case "slope":
      return 3; // Most slopes are brick height
    case "specialty":
      return 3; // Default to brick height
    default:
      return 3;
  }
}

// Get piece by category
export function getPiecesByCategory(category: BrickCategory): BrickSize[] {
  return BRICK_LIBRARY.filter(piece => piece.category === category);
}

// Get all categories
export function getAllCategories(): BrickCategory[] {
  return Object.keys(CATEGORY_NAMES) as BrickCategory[];
}