import { memo, useMemo } from "react";
import { MeshProps } from "@react-three/fiber";
import { STUD } from "@/lib/lego/units";

export type BaseplateSize = "small"|"medium"|"large";
export function studsFor(size: BaseplateSize) {
  if (size === "small") return 16;
  if (size === "large") return 48;
  return 32;
}

export default memo(function Baseplate({ size="medium", ...props }: MeshProps & { size?: BaseplateSize }) {
  const studs = studsFor(size);
  const half = studs * STUD / 2;

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    for (let i=0; i<=studs; i++) {
      const p = i - studs/2;
      lines.push(
        <line key={`gx-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([ -half, 0.01, p, half, 0.01, p ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#1a1a2e" opacity={0.3} transparent />
        </line>
      );
      lines.push(
        <line key={`gz-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([ p, 0.01, -half, p, 0.01, half ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#1a1a2e" opacity={0.3} transparent />
        </line>
      );
    }
    return lines;
  }, [studs, half]);

  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI/2} receiveShadow userData={{ type: "base" }}>
        <planeGeometry args={[studs * STUD, studs * STUD]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} />
      </mesh>
      <group>
        {gridLines}
      </group>
    </group>
  );
});