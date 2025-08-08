"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Raycaster, Vector2, Object3D, Mesh } from "three";
import BrickMesh from "@/components/BrickMesh";
import Baseplate, { studsFor } from "@/components/Baseplate";
import { BrickSize } from "@/lib/lego/bricks";
import { useBuilderStore } from "@/store/useBuilderStore";
import { worldYFor, canPlace as checkCanPlace } from "@/lib/lego/occupancy";
import { STUD } from "@/lib/lego/units";

// Scene component that runs inside Canvas
function Scene() {
  const { camera, scene, gl } = useThree();
  const {
    selectedSize, selectedColor, rotation,
    baseplate, bricks, placeBrick, removeBrickById
  } = useBuilderStore();
  
  // ghost state
  const [ghost, setGhost] = useState<{x:number;y:number;z:number} | null>(null);
  const [canPlaceHere, setCanPlaceHere] = useState(true);
  
  // raycasting
  const raycaster = useMemo(() => new Raycaster(), []);
  const pointer = useMemo(() => new Vector2(), []);
  
  // Handle mouse move for ghost preview
  useFrame(() => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position from pointer lock or regular mouse
    if (window.mouseX !== undefined && window.mouseY !== undefined) {
      pointer.x = ((window.mouseX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((window.mouseY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      let foundPosition = false;
      
      // Check for brick hits first (for stacking)
      for (const hit of intersects) {
        if ((hit.object as any).userData?.brickId) {
          const brickId = (hit.object as any).userData.brickId;
          const targetBrick = bricks.find(b => b.id === brickId);
          if (targetBrick) {
            const yLayer = targetBrick.pos.y + (targetBrick.size.kind === "brick" ? 3 : 1);
            const [sx, sz] = snapXZ(hit.point.x, hit.point.z, selectedSize, rotation, baseplate);
            
            // Check if we can place here
            const { occupied } = useBuilderStore.getState();
            const isValidPlacement = checkCanPlace(occupied, sx, yLayer, sz, selectedSize, rotation);
            
            setGhost({ x: sx, y: yLayer, z: sz });
            setCanPlaceHere(isValidPlacement);
            foundPosition = true;
            break;
          }
        }
      }
      
      // If no brick hit, check baseplate
      if (!foundPosition) {
        for (const hit of intersects) {
          if ((hit.object as any).userData?.type === "base") {
            const [sx, sz] = snapXZ(hit.point.x, hit.point.z, selectedSize, rotation, baseplate);
            
            // Check if we can place here
            const { occupied } = useBuilderStore.getState();
            const isValidPlacement = checkCanPlace(occupied, sx, 0, sz, selectedSize, rotation);
            
            setGhost({ x: sx, y: 0, z: sz });
            setCanPlaceHere(isValidPlacement);
            foundPosition = true;
            break;
          }
        }
      }
      
      if (!foundPosition) {
        setGhost(null);
      }
    }
  });
  
  // Mouse event handlers
  useEffect(() => {
    const canvas = gl.domElement;
    
    const updateMousePosition = (e: MouseEvent) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };
    
    const handleClick = (e: MouseEvent) => {
      if (e.button === 0 && ghost && canPlaceHere) { // Left click
        console.log('Placing brick at:', ghost);
        const success = placeBrick({ x: ghost.x, y: ghost.y, z: ghost.z });
        console.log('Placement success:', success);
        if (success) {
          // Visual feedback could go here
        }
      }
    };
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      for (const hit of intersects) {
        if ((hit.object as any).userData?.brickId) {
          removeBrickById((hit.object as any).userData.brickId);
          break;
        }
      }
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl, camera, ghost, canPlaceHere, placeBrick, removeBrickById, raycaster, pointer]);
  
  // Calculate world position for ghost
  const ghostWorldPos = ghost ? [
    ghost.x + (selectedSize.w * STUD) * 0.5,
    worldYFor(ghost.y, selectedSize),
    ghost.z + (selectedSize.l * STUD) * 0.5
  ] as [number, number, number] : null;
  
  // Log ghost state changes
  useEffect(() => {
    if (ghost) {
      console.log('Ghost position:', ghost);
    }
  }, [ghost]);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} />
      
      <group userData={{ type: "base" }}>
        <Baseplate size={baseplate} />
      </group>
      
      {/* Debug brick - remove this after testing */}
      {bricks.length === 0 && (
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[2, 3, 4]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      )}
      
      {/* Placed bricks */}
      {console.log('Rendering bricks:', bricks.length, bricks)}
      {bricks.map(b => (
        <BrickMesh
          key={b.id}
          brickId={b.id}
          size={b.size}
          color={b.color}
          rotation={b.rotation}
          position={[
            b.pos.x + (b.size.w * STUD) * 0.5,
            worldYFor(b.pos.y, b.size),
            b.pos.z + (b.size.l * STUD) * 0.5
          ]}
        />
      ))}
      
      {/* Ghost preview */}
      {ghost && ghostWorldPos && (
        <>
          <BrickMesh
            size={selectedSize}
            color={canPlaceHere ? selectedColor : "darkgray"}
            rotation={rotation}
            position={ghostWorldPos}
            ghost
          />
          {/* Debug position indicator */}
          <mesh position={ghostWorldPos}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="yellow" />
          </mesh>
        </>
      )}
      
      <OrbitControls 
        makeDefault 
        enableDamping 
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI * 0.48}
      />
    </>
  );
}

// Main component
export default function Canvas3D() {
  // Global mouse position tracking
  useEffect(() => {
    window.mouseX = 0;
    window.mouseY = 0;
    
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        useBuilderStore.getState().rotateCW();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <Canvas 
      shadows 
      camera={{ position: [15, 18, 20], fov: 45 }}
      style={{ background: '#1a1a2e' }}
    >
      <fog attach="fog" args={['#1a1a2e', 50, 200]} />
      <Scene />
    </Canvas>
  );
}

// Helper functions
function orientedDims(size: BrickSize, rotation: number) {
  const rot = ((rotation % 360) + 360) % 360;
  return {
    w: (rot === 90 || rot === 270) ? size.l : size.w,
    l: (rot === 90 || rot === 270) ? size.w : size.l
  };
}

function snapXZ(wx: number, wz: number, size: BrickSize, rotation: number, baseplate: "small"|"medium"|"large" = "medium") {
  const dims = orientedDims(size, rotation);
  const studs = studsFor(baseplate);
  const halfStuds = Math.floor(studs / 2);
  
  // Convert world coordinates to grid coordinates
  let gx = Math.round(wx + halfStuds);
  let gz = Math.round(wz + halfStuds);
  
  // Clamp to valid range
  gx = Math.max(0, Math.min(studs - dims.w, gx));
  gz = Math.max(0, Math.min(studs - dims.l, gz));
  
  // Convert back to world coordinates (centered)
  return [gx - halfStuds, gz - halfStuds] as const;
}

// Global mouse position
declare global {
  interface Window {
    mouseX?: number;
    mouseY?: number;
  }
}