import { useMemo } from "react";
import { BrickSize, ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE, STUD_RADIUS, STUD_HEIGHT, BRICK } from "@/lib/lego/units";
import { BufferGeometry, BufferAttribute } from "three";

interface SlopeMeshProps {
  size: BrickSize;
  color: ColorKey;
  slopeAngle?: number;
  ghost?: boolean;
}

export default function SlopeMesh({ size, color, slopeAngle = 45, ghost = false }: SlopeMeshProps) {
  const geometry = useMemo(() => {
    const w = size.w * STUD;
    const l = size.l * STUD; 
    const h = size.h ? size.h * PLATE : BRICK;
    
    // Create slope geometry manually
    const vertices: number[] = [];
    const indices: number[] = [];
    
    // Calculate slope parameters
    const angle = (slopeAngle * Math.PI) / 180;
    const slopeRun = h / Math.tan(angle); // How far the slope extends horizontally
    
    // Define the 8 vertices of a slope brick
    // Bottom face (4 vertices)
    vertices.push(-w/2, -h/2, -l/2); // 0: back left bottom
    vertices.push(w/2, -h/2, -l/2);  // 1: back right bottom  
    vertices.push(w/2, -h/2, l/2);   // 2: front right bottom
    vertices.push(-w/2, -h/2, l/2);  // 3: front left bottom
    
    // Top face (4 vertices) - with slope
    vertices.push(-w/2, h/2, -l/2);  // 4: back left top
    vertices.push(w/2, h/2, -l/2);   // 5: back right top
    
    // Front top depends on slope
    if (slopeRun < l) {
      // Slope doesn't go all the way to front
      vertices.push(w/2, h/2, -l/2 + slopeRun);   // 6: front right top (at slope end)
      vertices.push(-w/2, h/2, -l/2 + slopeRun);  // 7: front left top (at slope end)
    } else {
      // Slope goes to ground at front
      vertices.push(w/2, -h/2, l/2);   // 6: front right bottom (slope to ground)
      vertices.push(-w/2, -h/2, l/2);  // 7: front left bottom (slope to ground)
    }
    
    // Define faces (triangles)
    const faces = [
      // Bottom face
      [0, 2, 1], [0, 3, 2],
      // Back face  
      [4, 1, 5], [4, 0, 1],
      // Left face
      [0, 4, 7], [0, 7, 3],
      // Right face
      [1, 2, 6], [1, 6, 5],
      // Top face (may be partial due to slope)
      [4, 5, 6], [4, 6, 7],
      // Slope face
      [7, 6, 2], [7, 2, 3]
    ];
    
    // Add faces to indices
    faces.forEach(face => {
      indices.push(...face);
    });
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [size, slopeAngle]);

  // Calculate stud positions (only on flat part at back)
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    const w = size.w * STUD;
    const l = size.l * STUD;
    const h = size.h ? size.h * PLATE : BRICK;
    
    const angle = (slopeAngle * Math.PI) / 180;
    const slopeRun = h / Math.tan(angle);
    
    // Only place studs on the flat portion (back part before slope starts)
    const flatLength = Math.max(0, l - slopeRun);
    const studRows = Math.floor(flatLength / STUD);
    
    for (let x = 0; x < size.w; x++) {
      for (let z = 0; z < studRows; z++) {
        const sx = -w/2 + (x + 0.5) * STUD;
        const sz = -l/2 + (z + 0.5) * STUD;
        const sy = h/2 + STUD_HEIGHT/2;
        
        studs.push(
          <mesh key={`stud-${x}-${z}`} position={[sx, sy, sz]} castShadow>
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
    
    return studs;
  }, [size, color, ghost, slopeAngle]);

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