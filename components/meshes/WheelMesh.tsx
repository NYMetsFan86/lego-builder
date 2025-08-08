import { useMemo } from "react";
import { CylinderGeometry, TorusGeometry } from "three";
import { ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE } from "@/lib/lego/units";

interface WheelMeshProps {
  radius?: number;
  width?: number;
  color?: ColorKey;
  ghost?: boolean;
  hasRubberTire?: boolean;
  isHub?: boolean;
}

export default function WheelMesh({ 
  radius = 0.8,
  width = 0.6,
  color = "lightgray",
  ghost = false,
  hasRubberTire = true,
  isHub = false
}: WheelMeshProps) {
  
  // Wheel hub
  const hubGeometry = useMemo(() => {
    return new CylinderGeometry(
      radius * STUD * 0.7, // Top radius (smaller for hub)
      radius * STUD * 0.7, // Bottom radius
      width * STUD,
      24,
      1,
      false
    );
  }, [radius, width]);

  // Tire (if applicable)
  const tireGeometry = useMemo(() => {
    if (!hasRubberTire) return null;
    
    const tireRadius = radius * STUD;
    const tireThickness = 0.15 * STUD;
    
    return new TorusGeometry(
      tireRadius - tireThickness/2, // Major radius
      tireThickness,                 // Minor radius
      8,                             // Radial segments
      24                             // Tubular segments
    );
  }, [radius, hasRubberTire]);

  // Axle hole
  const axleHoleGeometry = useMemo(() => {
    return new CylinderGeometry(
      0.2 * STUD, // Axle hole radius
      0.2 * STUD,
      width * STUD * 1.1, // Slightly longer to ensure it cuts through
      16
    );
  }, [width]);

  // Wheel spokes/details
  const spokes = useMemo(() => {
    const spokeElements: JSX.Element[] = [];
    const numSpokes = 5;
    
    for (let i = 0; i < numSpokes; i++) {
      const angle = (i / numSpokes) * Math.PI * 2;
      const x = Math.cos(angle) * radius * STUD * 0.5;
      const z = Math.sin(angle) * radius * STUD * 0.5;
      
      spokeElements.push(
        <mesh 
          key={`spoke-${i}`} 
          position={[x, 0, z]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[radius * STUD * 0.7, width * STUD * 0.8, 0.1 * STUD]} />
          <meshStandardMaterial 
            color={COLORS[color]} 
            transparent={ghost} 
            opacity={ghost ? 0.6 : 1}
          />
        </mesh>
      );
    }
    
    return spokeElements;
  }, [radius, width, color, ghost]);

  if (isHub) {
    // Render as a hub (no tire, different styling)
    return (
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Hub body */}
        <mesh geometry={hubGeometry} castShadow receiveShadow>
          <meshStandardMaterial 
            color={COLORS[color]} 
            transparent={ghost} 
            opacity={ghost ? 0.6 : 1}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        
        {/* Hub connection studs/pins */}
        <mesh position={[0, width * STUD * 0.51, 0]}>
          <cylinderGeometry args={[radius * STUD * 0.2, radius * STUD * 0.2, 0.1 * STUD, 8]} />
          <meshStandardMaterial 
            color={COLORS[color]} 
            transparent={ghost} 
            opacity={ghost ? 0.6 : 1}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        
        <mesh position={[0, -width * STUD * 0.51, 0]}>
          <cylinderGeometry args={[radius * STUD * 0.2, radius * STUD * 0.2, 0.1 * STUD, 8]} />
          <meshStandardMaterial 
            color={COLORS[color]} 
            transparent={ghost} 
            opacity={ghost ? 0.6 : 1}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        
        {/* Central axle hole */}
        <mesh geometry={axleHoleGeometry}>
          <meshStandardMaterial 
            color="#000000" 
            transparent={ghost} 
            opacity={ghost ? 0.3 : 0.8}
          />
        </mesh>
      </group>
    );
  }

  // Render as a wheel (with tire)
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Main hub */}
      <mesh geometry={hubGeometry} castShadow receiveShadow>
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Spokes */}
      {spokes}
      
      {/* Center cap */}
      <mesh position={[0, width * STUD * 0.51, 0]}>
        <cylinderGeometry args={[radius * STUD * 0.3, radius * STUD * 0.3, 0.05 * STUD, 16]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Axle hole (visual representation) */}
      <mesh geometry={axleHoleGeometry}>
        <meshStandardMaterial 
          color="#000000" 
          transparent={ghost} 
          opacity={ghost ? 0.3 : 0.8}
        />
      </mesh>
      
      {/* Rubber tire */}
      {hasRubberTire && tireGeometry && (
        <mesh 
          geometry={tireGeometry} 
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#1a1a1a"
            transparent={ghost} 
            opacity={ghost ? 0.6 : 1}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      )}
    </group>
  );
}