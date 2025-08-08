import { useMemo } from "react";
import { BrickSize, ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE, STUD_RADIUS, STUD_HEIGHT, BRICK } from "@/lib/lego/units";

interface WindowMeshProps {
  size: BrickSize;
  color: ColorKey;
  ghost?: boolean;
  openingWidth?: number;
  openingHeight?: number;
  frameThickness?: number;
}

export default function WindowMesh({ 
  size, 
  color, 
  ghost = false,
  openingWidth = 0.6,
  openingHeight = 0.7,
  frameThickness = 0.15
}: WindowMeshProps) {
  
  const dimensions = useMemo(() => {
    return {
      w: size.w * STUD,
      l: size.l * STUD, 
      h: size.h ? size.h * PLATE : BRICK * 2 // Default to 2 bricks high
    };
  }, [size]);

  // Window frame parts (separate pieces to create opening)
  const frameParts = useMemo(() => {
    const parts: JSX.Element[] = [];
    const { w, l, h } = dimensions;
    
    const frameWidth = frameThickness * STUD;
    const openingW = w * openingWidth;
    const openingH = h * openingHeight;
    
    // Bottom frame
    parts.push(
      <mesh key="bottom-frame" position={[0, -h/2 + frameWidth/2, 0]} castShadow>
        <boxGeometry args={[w, frameWidth, l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    // Top frame  
    parts.push(
      <mesh key="top-frame" position={[0, h/2 - frameWidth/2, 0]} castShadow>
        <boxGeometry args={[w, frameWidth, l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    // Left frame
    parts.push(
      <mesh key="left-frame" position={[-w/2 + frameWidth/2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, h - frameWidth * 2, l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    // Right frame
    parts.push(
      <mesh key="right-frame" position={[w/2 - frameWidth/2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, h - frameWidth * 2, l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    return parts;
  }, [dimensions, color, ghost, openingWidth, openingHeight, frameThickness]);

  // Window cross dividers
  const crossDividers = useMemo(() => {
    const dividers: JSX.Element[] = [];
    const { w, l, h } = dimensions;
    const dividerThickness = frameThickness * STUD * 0.5;
    
    // Vertical divider
    dividers.push(
      <mesh key="v-divider" position={[0, 0, 0]} castShadow>
        <boxGeometry args={[dividerThickness, h * 0.6, dividerThickness]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    // Horizontal divider
    dividers.push(
      <mesh key="h-divider" position={[0, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.5, dividerThickness, dividerThickness]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    );
    
    return dividers;
  }, [dimensions, color, ghost, frameThickness]);

  // Studs on top (only on frame edges)
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    const { w, l, h } = dimensions;
    
    for (let x = 0; x < size.w; x++) {
      for (let z = 0; z < size.l; z++) {
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
  }, [size, dimensions, color, ghost]);

  return (
    <group>
      {/* Frame parts */}
      {frameParts}
      
      {/* Glass pane (transparent) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[
          dimensions.w * openingWidth, 
          dimensions.h * openingHeight, 
          0.02
        ]} />
        <meshStandardMaterial 
          color="#87CEEB"
          transparent
          opacity={ghost ? 0.1 : 0.3}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      
      {/* Cross dividers */}
      {crossDividers}
      
      {/* Studs */}
      {studs}
    </group>
  );
}