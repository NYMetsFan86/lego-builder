import { useMemo } from "react";
import { BrickSize, ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE, STUD_RADIUS, STUD_HEIGHT, BRICK } from "@/lib/lego/units";
import { BufferGeometry, BufferAttribute, Vector3 } from "three";

interface ArchMeshProps {
  size: BrickSize;
  color: ColorKey;
  ghost?: boolean;
  archRadius?: number;
  archHeight?: number;
}

export default function ArchMesh({ 
  size, 
  color, 
  ghost = false,
  archRadius,
  archHeight
}: ArchMeshProps) {
  
  const geometry = useMemo(() => {
    const w = size.w * STUD;
    const l = size.l * STUD;
    const h = size.h ? size.h * PLATE : BRICK;
    
    // Calculate arch dimensions
    const radius = archRadius || (l * 0.35);
    const archStartHeight = h * 0.3; // Arch starts at 30% of height
    
    const vertices: number[] = [];
    const indices: number[] = [];
    
    // Create arch using separate frame pieces to avoid complex CSG
    
    // Left pillar
    const pillarWidth = l * 0.2;
    addBox(vertices, indices, 
      -w/2, -h/2, -l/2,  // position
      pillarWidth, h, pillarWidth  // size
    );
    
    // Right pillar  
    addBox(vertices, indices,
      -w/2, -h/2, l/2 - pillarWidth,
      pillarWidth, h, pillarWidth
    );
    
    // Top arch span (horizontal piece across top)
    addBox(vertices, indices,
      -w/2, h/2 - pillarWidth/2, -l/2 + pillarWidth,
      pillarWidth, pillarWidth/2, l - pillarWidth * 2
    );
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [size, archRadius, archHeight]);

// Helper function to add a box to vertex/index arrays
function addBox(vertices: number[], indices: number[], x: number, y: number, z: number, w: number, h: number, l: number) {
  const startIndex = vertices.length / 3;
  
  // 8 vertices of a box
  const boxVertices = [
    [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],         // back face
    [x, y, z + l], [x + w, y, z + l], [x + w, y + h, z + l], [x, y + h, z + l] // front face  
  ];
  
  // Add vertices
  for (const vertex of boxVertices) {
    vertices.push(...vertex);
  }
  
  // Box faces (12 triangles)
  const boxFaces = [
    // Back face
    [0, 2, 1], [0, 3, 2],
    // Front face  
    [4, 5, 6], [4, 6, 7],
    // Left face
    [0, 4, 7], [0, 7, 3],
    // Right face
    [1, 2, 6], [1, 6, 5],
    // Top face
    [3, 7, 6], [3, 6, 2],
    // Bottom face
    [0, 1, 5], [0, 5, 4]
  ];
  
  // Add faces with offset
  for (const face of boxFaces) {
    indices.push(face[0] + startIndex, face[1] + startIndex, face[2] + startIndex);
  }
}

  // Studs on top (only on pillars and top span)
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    const w = size.w * STUD;
    const l = size.l * STUD;
    const h = size.h ? size.h * PLATE : BRICK;
    
    for (let x = 0; x < size.w; x++) {
      for (let z = 0; z < size.l; z++) {
        const sx = -w/2 + (x + 0.5) * STUD;
        const sz = -l/2 + (z + 0.5) * STUD;
        const sy = h/2 + STUD_HEIGHT/2;
        
        // Only place studs on pillars (not in the middle opening)
        const isPillar = (z < size.l * 0.2) || (z >= size.l * 0.8);
        
        if (isPillar) {
          studs.push(
            <mesh 
              key={`stud-${x}-${z}`} 
              position={[sx, sy, sz]} 
              castShadow
            >
              <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]} />
              <meshStandardMaterial 
                color={COLORS[color]} 
                transparent={ghost} 
                opacity={ghost ? 0.6 : 1}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          );
        }
      }
    }
    
    return studs;
  }, [size, color, ghost]);

  return (
    <group>
      <mesh 
        geometry={geometry} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {studs}
    </group>
  );
}