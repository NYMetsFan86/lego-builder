import { SceneState } from "@/store/useBuilderStore";

const LS_KEY = "lego-builder-scene";

// Enhanced save data format with metadata
export type LEGOBuildFile = {
  version: string;
  created: string;
  modified: string;
  name: string;
  description?: string;
  thumbnail?: string; // Base64 encoded image
  metadata: {
    pieceCount: number;
    studCount: number;
    colors: string[];
    categories: string[];
    dimensions: {
      width: number;
      height: number; 
      depth: number;
    };
  };
  scene: SceneState;
};

// Local storage functions
export function saveToLocalStorage(scene: SceneState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(scene));
}

export function loadFromLocalStorage(): SceneState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) as SceneState : null;
}

// Enhanced file export/import functions
export function createBuildFile(scene: SceneState, name: string, description?: string): LEGOBuildFile {
  const now = new Date().toISOString();
  
  // Calculate metadata
  const colors = [...new Set(scene.bricks.map(b => b.color))];
  const categories = [...new Set(scene.bricks.map(b => b.size.category))];
  const pieceCount = scene.bricks.length;
  const studCount = scene.bricks.reduce((sum, b) => sum + (b.size.w * b.size.l), 0);
  
  // Calculate build dimensions
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity; 
  let minZ = Infinity, maxZ = -Infinity;
  
  scene.bricks.forEach(brick => {
    const x1 = brick.pos.x;
    const x2 = brick.pos.x + brick.size.w;
    const z1 = brick.pos.z;
    const z2 = brick.pos.z + brick.size.l;
    const y1 = brick.pos.y;
    const y2 = brick.pos.y + (brick.size.h || 3);
    
    minX = Math.min(minX, x1);
    maxX = Math.max(maxX, x2);
    minY = Math.min(minY, y1);
    maxY = Math.max(maxY, y2);
    minZ = Math.min(minZ, z1);
    maxZ = Math.max(maxZ, z2);
  });
  
  const dimensions = scene.bricks.length > 0 ? {
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ
  } : { width: 0, height: 0, depth: 0 };
  
  return {
    version: "1.0.0",
    created: now,
    modified: now,
    name,
    description,
    metadata: {
      pieceCount,
      studCount,
      colors,
      categories,
      dimensions
    },
    scene
  };
}

export function exportBuildToJSON(scene: SceneState, name: string, description?: string): string {
  const buildFile = createBuildFile(scene, name, description);
  return JSON.stringify(buildFile, null, 2);
}

export function downloadBuildFile(scene: SceneState, name: string, description?: string) {
  const json = exportBuildToJSON(scene, name, description);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_build.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function importBuildFromJSON(jsonString: string): LEGOBuildFile | null {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate required fields
    if (!data.scene || !data.version) {
      throw new Error("Invalid build file format");
    }
    
    return data as LEGOBuildFile;
  } catch (error) {
    console.error("Failed to import build file:", error);
    return null;
  }
}

// File upload handler
export function handleFileUpload(file: File): Promise<LEGOBuildFile | null> {
  return new Promise((resolve) => {
    if (!file.name.toLowerCase().endsWith('.json')) {
      console.error("File must be a JSON file");
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const buildFile = importBuildFromJSON(content);
      resolve(buildFile);
    };
    reader.onerror = () => {
      console.error("Failed to read file");
      resolve(null);
    };
    reader.readAsText(file);
  });
}

// Save multiple builds locally
export function saveNamedBuild(scene: SceneState, name: string, description?: string) {
  if (typeof window === "undefined") return;
  
  const buildFile = createBuildFile(scene, name, description);
  const savedBuilds = getSavedBuilds();
  
  // Update existing or add new
  const existingIndex = savedBuilds.findIndex(b => b.name === name);
  if (existingIndex >= 0) {
    savedBuilds[existingIndex] = buildFile;
  } else {
    savedBuilds.push(buildFile);
  }
  
  localStorage.setItem("lego-builder-saved-builds", JSON.stringify(savedBuilds));
}

export function getSavedBuilds(): LEGOBuildFile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("lego-builder-saved-builds");
  return raw ? JSON.parse(raw) as LEGOBuildFile[] : [];
}

export function deleteSavedBuild(name: string) {
  if (typeof window === "undefined") return;
  const savedBuilds = getSavedBuilds().filter(b => b.name !== name);
  localStorage.setItem("lego-builder-saved-builds", JSON.stringify(savedBuilds));
}