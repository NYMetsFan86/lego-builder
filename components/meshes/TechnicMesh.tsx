import { useMemo } from "react";
import { BrickSize, ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE, STUD_RADIUS, STUD_HEIGHT, BRICK } from "@/lib/lego/units";

interface TechnicMeshProps {
  size: BrickSize;
  color: ColorKey;
  ghost?: boolean;
}

export default function TechnicMesh({ 
  size, 
  color, 
  ghost = false 
}: TechnicMeshProps) {

  // Standard brick dimensions
  const dims = useMemo(() => {
    return {
      w: size.w * STUD,
      l: size.l * STUD,
      h: size.h ? size.h * PLATE : BRICK
    };
  }, [size]);

  // Studs for Technic pieces (on top surface)
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    
    for (let x = 0; x < size.w; x++) {
      for (let z = 0; z < size.l; z++) {
        const sx = -dims.w/2 + (x + 0.5) * STUD;
        const sz = -dims.l/2 + (z + 0.5) * STUD;
        
        studs.push(
          <mesh key={`stud-${x}-${z}`} position={[sx, dims.h/2 + STUD_HEIGHT/2, sz]} castShadow>
            <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]} />
            <meshStandardMaterial 
              color={COLORS[color]} 
              transparent={ghost} 
              opacity={ghost ? 0.6 : 1}
            />
          </mesh>
        );
      }
    }
    
    return studs;
  }, [size, dims, color, ghost]);

  // Visual indicators for cross-axle holes (small cylinders)
  const holeIndicators = useMemo(() => {
    const indicators: JSX.Element[] = [];
    
    const numHoles = Math.max(1, size.l);
    for (let i = 0; i < numHoles; i++) {
      const holeZ = -dims.l/2 + (i + 0.5) * STUD;
      
      // Left side indicator
      indicators.push(
        <mesh key={`hole-left-${i}`} position={[-dims.w/2 + 0.05, 0, holeZ]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 8]} />
          <meshStandardMaterial 
            color={ghost ? "#333" : "#111"}
            transparent={ghost} 
            opacity={ghost ? 0.4 : 0.8}
          />
        </mesh>
      );
      
      // Right side indicator
      indicators.push(
        <mesh key={`hole-right-${i}`} position={[dims.w/2 - 0.05, 0, holeZ]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 8]} />
          <meshStandardMaterial 
            color={ghost ? "#333" : "#111"}
            transparent={ghost} 
            opacity={ghost ? 0.4 : 0.8}
          />
        </mesh>
      );
    }
    
    return indicators;
  }, [size, dims, ghost]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dims.w, dims.h, dims.l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {studs}
      {holeIndicators}
    </group>
  );
}