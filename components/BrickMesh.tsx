import { useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { BrickSize, COLORS, ColorKey } from "@/lib/lego/bricks";
import { BRICK, PLATE, STUD, STUD_HEIGHT, STUD_RADIUS } from "@/lib/lego/units";

export default function BrickMesh({
  size, color, rotation=0, ghost=false, brickId, ...props
}: GroupProps & { size: BrickSize; color: ColorKey; rotation?: number; ghost?: boolean; brickId?: string }) {

  const dims = useMemo(() => {
    const h = size.kind === "brick" ? BRICK : PLATE;
    // width along X, length along Z in studs
    return {
      w: size.w * STUD,
      l: size.l * STUD,
      h
    };
  }, [size]);

  // oriented dims used only for visual; rotation is applied at group level
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    for (let x=0; x<size.w; x++) {
      for (let z=0; z<size.l; z++) {
        const sx = -dims.w/2 + (x+0.5)*STUD;
        const sz = -dims.l/2 + (z+0.5)*STUD;
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
      {/* studs */}
      {size.kind === "brick" && studs}
      {size.kind === "plate" && studs /* plates still show studs visually */}
    </group>
  );
}