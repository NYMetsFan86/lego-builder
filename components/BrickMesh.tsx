import { useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { BrickSize, COLORS, ColorKey } from "@/lib/lego/bricks";
import { BRICK, PLATE, STUD, STUD_HEIGHT, STUD_RADIUS } from "@/lib/lego/units";
import dynamic from "next/dynamic";

// Lazy load specialized meshes
const SlopeMesh = dynamic(() => import("./meshes/SlopeMesh"), { ssr: false });
const WindowMesh = dynamic(() => import("./meshes/WindowMesh"), { ssr: false });
const WheelMesh = dynamic(() => import("./meshes/WheelMesh"), { ssr: false });
const ArchMesh = dynamic(() => import("./meshes/ArchMesh"), { ssr: false });
const AirplaneMesh = dynamic(() => import("./meshes/AirplaneMesh"), { ssr: false });
const TechnicMesh = dynamic(() => import("./meshes/TechnicMesh"), { ssr: false });

export default function BrickMesh({
  size, color, rotation=0, ghost=false, brickId, ...props
}: GroupProps & { size: BrickSize; color: ColorKey; rotation?: number; ghost?: boolean; brickId?: string }) {

  // Check if this is a special piece that needs custom rendering
  const isSpecialPiece = useMemo(() => {
    // Check for airplane parts first
    if (size.partType) {
      return 'airplane';
    }
    
    // Check by part number or name patterns
    if (size.partNum) {
      // Airplane parts (custom part numbers)
      if (size.partNum.startsWith('A')) {
        return 'airplane';
      }
      // Slopes
      if (['3037', '3039', '3040', '3298', '4286', '60477'].includes(size.partNum)) {
        return 'slope';
      }
      // Windows
      if (['60592', '60593', '3853', '57894', '60596'].includes(size.partNum)) {
        return 'window';
      }
      // Wheels (hubs and wheels)
      if (['4624', '3641'].includes(size.partNum)) {
        return 'wheel-hub';
      }
      if (['6014', '30155', '2515'].includes(size.partNum)) {
        return 'wheel';
      }
      // Arches
      if (['3455', '6183', '3659', '92950'].includes(size.partNum)) {
        return 'arch';
      }
      // Technic pieces
      if (['3700', '3701', '3894', '3702', '2730', '3895', '3703'].includes(size.partNum)) {
        return 'technic';
      }
    }
    
    // Check by name
    if (size.name) {
      if (size.name.toLowerCase().includes('wing') || 
          size.name.toLowerCase().includes('engine') ||
          size.name.toLowerCase().includes('cockpit') ||
          size.name.toLowerCase().includes('fuselage') ||
          size.name.toLowerCase().includes('tail')) return 'airplane';
      if (size.name.toLowerCase().includes('slope')) return 'slope';
      if (size.name.toLowerCase().includes('window')) return 'window';
      if (size.name.toLowerCase().includes('door')) return 'window';
      if (size.name.toLowerCase().includes('wheel hub')) return 'wheel-hub';
      if (size.name.toLowerCase().includes('wheel')) return 'wheel';
      if (size.name.toLowerCase().includes('arch')) return 'arch';
      if (size.name.toLowerCase().includes('technic')) return 'technic';
      if (size.name.toLowerCase().includes('windscreen')) return 'window';
    }
    
    return null;
  }, [size]);

  // Render specialized mesh if applicable
  if (isSpecialPiece) {
    const meshProps = {
      size,
      color,
      ghost,
      rotation: 0 // Rotation handled at group level
    };
    
    return (
      <group rotation-y={(rotation * Math.PI)/180} {...props}>
        {isSpecialPiece === 'airplane' && (
          <AirplaneMesh {...meshProps} partType={size.partType} wingType={size.wingType} />
        )}
        {isSpecialPiece === 'slope' && (
          <SlopeMesh {...meshProps} slopeAngle={size.slopeAngle || 45} />
        )}
        {isSpecialPiece === 'window' && (
          <WindowMesh {...meshProps} />
        )}
        {isSpecialPiece === 'wheel' && (
          <WheelMesh 
            radius={size.w * 0.5} 
            width={0.6}
            color={color}
            ghost={ghost}
            isHub={false}
          />
        )}
        {isSpecialPiece === 'wheel-hub' && (
          <WheelMesh 
            radius={size.w * 0.4} 
            width={0.4}
            color={color}
            ghost={ghost}
            isHub={true}
          />
        )}
        {isSpecialPiece === 'arch' && (
          <ArchMesh {...meshProps} />
        )}
        {isSpecialPiece === 'technic' && (
          <TechnicMesh {...meshProps} />
        )}
      </group>
    );
  }

  // Standard brick/plate rendering
  const dims = useMemo(() => {
    // Calculate height based on kind and custom height
    let h: number;
    if (size.h !== undefined) {
      // Custom height specified in plate units
      h = size.h * PLATE;
    } else {
      // Default heights based on kind
      switch (size.kind) {
        case "brick":
          h = BRICK; // 1.2 units (3 plates)
          break;
        case "plate":
        case "tile":
          h = PLATE; // 0.4 units (1 plate)
          break;
        case "slope":
          h = BRICK; // Most slopes are brick height
          break;
        case "specialty":
          h = BRICK; // Default specialty to brick height
          break;
        default:
          h = BRICK;
      }
    }
    
    return {
      w: size.w * STUD,
      l: size.l * STUD,
      h
    };
  }, [size]);

  // Studs for standard pieces
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    for (let x = 0; x < size.w; x++) {
      for (let z = 0; z < size.l; z++) {
        const sx = -dims.w/2 + (x + 0.5) * STUD;
        const sz = -dims.l/2 + (z + 0.5) * STUD;
        studs.push(
          <mesh key={`s-${x}-${z}`} position={[sx, dims.h/2 + STUD_HEIGHT/2, sz]} castShadow>
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
  }, [size, dims, color, ghost]);

  return (
    <group rotation-y={(rotation * Math.PI)/180} {...props}>
      <mesh castShadow receiveShadow userData={brickId ? { brickId } : undefined}>
        <boxGeometry args={[dims.w, dims.h, dims.l]} />
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* studs - tiles don't have studs */}
      {size.hasStuds !== false && studs}
    </group>
  );
}