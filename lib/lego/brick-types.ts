// Enhanced brick type definitions with exact LEGO specifications

export type GeometryType = 
  | "box"           // Standard rectangular brick
  | "slope"         // Angled top surface
  | "inverted-slope" // Slope on bottom
  | "cylinder"      // Round pieces
  | "arch"          // Curved pieces
  | "window-frame"  // Hollow frame
  | "door-frame"    // Door opening
  | "wedge"         // Triangular pieces
  | "cone"          // Conical pieces
  | "wheel"         // Wheel with axle hole
  | "axle"          // Technic axle
  | "bracket"       // L-shaped brackets
  | "hinge"         // Hinged pieces
  | "wing"          // Aircraft wing profiles
  | "windscreen"    // Angled transparent pieces;

export interface SpecialGeometry {
  type: GeometryType;
  // Slope-specific
  slopeAngle?: number;      // Degrees from horizontal
  slopeDirection?: "front" | "back" | "left" | "right" | "corner";
  
  // Cylinder/Round specific
  radius?: number;          // For round pieces
  innerRadius?: number;     // For tubes/tires
  
  // Window/Door specific
  openingWidth?: number;    // Inner opening dimensions
  openingHeight?: number;
  frameThickness?: number;  // Wall thickness
  
  // Arch specific
  archRadius?: number;      // Curve radius
  archAngle?: number;       // Arc angle in degrees
  
  // Wing specific
  wingProfile?: "flat" | "airfoil" | "swept";
  thickness?: number;       // At thickest point
  
  // Technic specific
  axleType?: "round" | "cross" | "pin";
  holePositions?: Array<{x: number, z: number}>; // Technic holes
}

// Extended LEGO piece specifications
export interface LegoPiece {
  // Basic dimensions
  partNum: string;
  name: string;
  width: number;        // In studs
  length: number;       // In studs  
  height: number;       // In plates
  
  // Geometry
  geometry: SpecialGeometry;
  
  // Stud configuration
  studs?: {
    top?: boolean | Array<{x: number, z: number}>;     // Custom stud positions
    bottom?: boolean | "tubes" | "open";               // Bottom connection type
    hollow?: boolean;                                  // Hollow studs
  };
  
  // Material properties
  material?: {
    transparent?: boolean;
    color?: string;
    texture?: "smooth" | "rough" | "rubber";
  };
  
  // Connection points
  connections?: {
    clips?: Array<{x: number, y: number, z: number, type: "bar" | "clip"}>;
    hinges?: Array<{x: number, y: number, z: number, axis: "x" | "y" | "z"}>;
    ball?: Array<{x: number, y: number, z: number}>;
    socket?: Array<{x: number, y: number, z: number}>;
  };
}

// Specialized LEGO pieces with exact specifications
export const SPECIALIZED_PIECES: Record<string, LegoPiece> = {
  // ===== SLOPES =====
  "3037": {
    partNum: "3037",
    name: "Slope 45° 2×4",
    width: 2,
    length: 4,
    height: 3,
    geometry: {
      type: "slope",
      slopeAngle: 45,
      slopeDirection: "front"
    },
    studs: {
      top: [{x: 0.5, z: 0.5}, {x: 1.5, z: 0.5}, {x: 0.5, z: 1.5}, {x: 1.5, z: 1.5}], // Only back 2 rows
      bottom: true
    }
  },
  
  "3039": {
    partNum: "3039",
    name: "Slope 45° 2×2",
    width: 2,
    length: 2,
    height: 3,
    geometry: {
      type: "slope",
      slopeAngle: 45,
      slopeDirection: "front"
    },
    studs: {
      top: [{x: 0.5, z: 0.5}, {x: 1.5, z: 0.5}], // Only back row
      bottom: true
    }
  },

  "3040": {
    partNum: "3040",
    name: "Slope 45° 1×2",
    width: 1,
    length: 2,
    height: 3,
    geometry: {
      type: "slope",
      slopeAngle: 45,
      slopeDirection: "front"
    },
    studs: {
      top: [{x: 0.5, z: 0.5}], // Only back stud
      bottom: true
    }
  },

  "3665": {
    partNum: "3665",
    name: "Slope 45° 2×1 Inverted",
    width: 2,
    length: 1,
    height: 3,
    geometry: {
      type: "inverted-slope",
      slopeAngle: 45,
      slopeDirection: "front"
    },
    studs: {
      top: true,
      bottom: "open" // Inverted slopes have open bottoms
    }
  },

  // ===== WINDOWS & DOORS =====
  "60592": {
    partNum: "60592",
    name: "Window 1×2×2",
    width: 1,
    length: 2,
    height: 6, // 2 bricks tall
    geometry: {
      type: "window-frame",
      openingWidth: 0.6,
      openingHeight: 4.5, // In plates
      frameThickness: 0.2
    },
    studs: {
      top: true,
      bottom: true
    }
  },

  "60596": {
    partNum: "60596",
    name: "Door Frame 1×4×6",
    width: 1,
    length: 4,
    height: 18, // 6 bricks tall
    geometry: {
      type: "door-frame",
      openingWidth: 0.7,
      openingHeight: 16, // In plates
      frameThickness: 0.15
    },
    studs: {
      top: [{x: 0.5, z: 0.5}, {x: 0.5, z: 3.5}], // Only corners
      bottom: true
    }
  },

  // ===== ARCHES =====
  "3455": {
    partNum: "3455",
    name: "Arch 1×6",
    width: 1,
    length: 6,
    height: 3,
    geometry: {
      type: "arch",
      archRadius: 2.5,
      archAngle: 180
    },
    studs: {
      top: [{x: 0.5, z: 0.5}, {x: 0.5, z: 5.5}], // Only ends
      bottom: "open"
    }
  },

  "6183": {
    partNum: "6183",
    name: "Arch 1×6×2",
    width: 1,
    length: 6,
    height: 6, // 2 bricks tall
    geometry: {
      type: "arch",
      archRadius: 2.5,
      archAngle: 180
    },
    studs: {
      top: true, // Full top
      bottom: "open"
    }
  },

  // ===== CYLINDERS & CONES =====
  "3062": {
    partNum: "3062",
    name: "Round 1×1",
    width: 1,
    length: 1,
    height: 3,
    geometry: {
      type: "cylinder",
      radius: 0.5
    },
    studs: {
      top: true,
      bottom: true
    }
  },

  "4589": {
    partNum: "4589",
    name: "Cone 1×1",
    width: 1,
    length: 1,
    height: 3,
    geometry: {
      type: "cone"
    },
    studs: {
      top: [{x: 0.5, z: 0.5}], // Single centered stud
      bottom: true
    }
  },

  // ===== WHEELS =====
  "4624": {
    partNum: "4624",
    name: "Wheel 8mm D. × 6mm",
    width: 1,
    length: 1,
    height: 2, // Approximate
    geometry: {
      type: "wheel",
      radius: 0.5,
      innerRadius: 0.2 // Axle hole
    },
    studs: {
      top: false,
      bottom: false
    },
    material: {
      texture: "rubber",
      color: "black"
    }
  },

  // ===== AIRCRAFT PARTS =====
  "3479": {
    partNum: "3479",
    name: "Wing 4×8",
    width: 4,
    length: 8,
    height: 1, // Plate thickness
    geometry: {
      type: "wing",
      wingProfile: "airfoil",
      thickness: 0.3 // Thicker in middle
    },
    studs: {
      top: true,
      bottom: true
    }
  },

  "30120": {
    partNum: "30120",
    name: "Windscreen 2×4×2",
    width: 2,
    length: 4,
    height: 6,
    geometry: {
      type: "windscreen",
      slopeAngle: 65 // Steep angle
    },
    studs: {
      top: false,
      bottom: true
    },
    material: {
      transparent: true
    }
  },

  // ===== TECHNIC =====
  "3700": {
    partNum: "3700",
    name: "Technic Brick 1×2",
    width: 1,
    length: 2,
    height: 3,
    geometry: {
      type: "box",
      holePositions: [{x: 0.5, z: 0.5}, {x: 0.5, z: 1.5}]
    },
    studs: {
      top: true,
      bottom: true
    }
  },

  "32316": {
    partNum: "32316",
    name: "Technic Beam 5",
    width: 1,
    length: 5,
    height: 3,
    geometry: {
      type: "box",
      holePositions: [
        {x: 0.5, z: 0.5}, 
        {x: 0.5, z: 1.5}, 
        {x: 0.5, z: 2.5}, 
        {x: 0.5, z: 3.5}, 
        {x: 0.5, z: 4.5}
      ]
    },
    studs: {
      top: false, // Technic beams don't have studs
      bottom: false
    }
  },

  // ===== BRACKETS =====
  "2436": {
    partNum: "2436",
    name: "Bracket 1×2 - 1×4",
    width: 1,
    length: 2,
    height: 3, // Main part
    geometry: {
      type: "bracket"
      // Bracket has a vertical extension
    },
    studs: {
      top: true,
      bottom: true
    }
  }
};