import { useMemo } from "react";
import { BrickSize, ColorKey, COLORS } from "@/lib/lego/bricks";
import { STUD, PLATE, STUD_RADIUS, STUD_HEIGHT, BRICK } from "@/lib/lego/units";
import { Vector3, BufferGeometry, BufferAttribute } from "three";

interface AirplaneMeshProps {
  size: BrickSize;
  color: ColorKey;
  ghost?: boolean;
  wingType?: "swept" | "straight" | "delta" | "fighter";
  partType?: "wing" | "engine" | "cockpit" | "fuselage" | "tail";
}

export default function AirplaneMesh({ 
  size, 
  color, 
  ghost = false,
  wingType = "straight",
  partType = "wing"
}: AirplaneMeshProps) {

  const dimensions = useMemo(() => {
    return {
      w: size.w * STUD,
      l: size.l * STUD,
      h: size.h ? size.h * PLATE : BRICK
    };
  }, [size]);

  const geometry = useMemo(() => {
    switch (partType) {
      case "wing":
        return createWingGeometry(dimensions.w, dimensions.l, dimensions.h, wingType || "straight");
      case "engine":
        return createEngineGeometry(dimensions.w, dimensions.l, dimensions.h);
      case "cockpit":
        return createCockpitGeometry(dimensions.w, dimensions.l, dimensions.h);
      case "fuselage":
        return createFuselageGeometry(dimensions.w, dimensions.l, dimensions.h);
      case "tail":
        return createTailGeometry(dimensions.w, dimensions.l, dimensions.h);
      default:
        return createWingGeometry(dimensions.w, dimensions.l, dimensions.h, wingType || "straight");
    }
  }, [dimensions, wingType, partType]);

  // Studs positioned appropriately for aircraft parts
  const studs = useMemo(() => {
    const studs: JSX.Element[] = [];
    const w = size.w * STUD;
    const l = size.l * STUD;
    const h = size.h ? size.h * PLATE : PLATE;
    
    // For wings, studs only on the root (center portion)
    if (partType === "wing") {
      // Only place studs on inner 50% of wing
      const studStartX = Math.floor(size.w * 0.25);
      const studEndX = Math.ceil(size.w * 0.75);
      
      for (let x = studStartX; x < studEndX; x++) {
        for (let z = 0; z < size.l; z++) {
          const sx = -w/2 + (x + 0.5) * STUD;
          const sz = -l/2 + (z + 0.5) * STUD;
          
          studs.push(
            <mesh key={`stud-${x}-${z}`} position={[sx, h + STUD_HEIGHT/2, sz]} castShadow>
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
    } else {
      // Regular stud pattern for other parts
      for (let x = 0; x < size.w; x++) {
        for (let z = 0; z < size.l; z++) {
          const sx = -w/2 + (x + 0.5) * STUD;
          const sz = -l/2 + (z + 0.5) * STUD;
          
          studs.push(
            <mesh key={`stud-${x}-${z}`} position={[sx, h + STUD_HEIGHT/2, sz]} castShadow>
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
    }
    
    return studs;
  }, [size, color, ghost, partType]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          color={COLORS[color]} 
          transparent={ghost} 
          opacity={ghost ? 0.6 : 1}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {studs}
    </group>
  );
}

// Create realistic wing geometry using vertices
function createWingGeometry(w: number, l: number, h: number, wingType: string): BufferGeometry {
  const geometry = new BufferGeometry();
  
  // Wing parameters
  const span = w;
  const chord = l;
  const thickness = h * 0.8; // Wings are thinner than bricks
  
  // Create wing shape based on type
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  
  // Wing profile points (airfoil-like shape)
  const profilePoints = createWingProfile(chord, thickness);
  
  // Create wing geometry based on type
  switch (wingType) {
    case "swept":
      createSweptWing(vertices, indices, normals, span, chord, thickness, profilePoints);
      break;
    case "delta":
      createDeltaWing(vertices, indices, normals, span, chord, thickness, profilePoints);
      break;
    case "fighter":
      createFighterWing(vertices, indices, normals, span, chord, thickness, profilePoints);
      break;
    default: // straight
      createStraightWing(vertices, indices, normals, span, chord, thickness, profilePoints);
  }
  
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// Create wing profile points for airfoil shape
function createWingProfile(chord: number, thickness: number): Vector3[] {
  const points: Vector3[] = [];
  const numPoints = 20;
  
  // Create a simple airfoil profile
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * chord - chord/2;
    const progress = i / numPoints;
    
    // Upper surface (curved)
    const upperY = thickness * 0.5 * Math.sin(progress * Math.PI) * (1 - progress * 0.3);
    points.push(new Vector3(x, upperY, 0));
  }
  
  // Lower surface (flatter)
  for (let i = numPoints; i >= 0; i--) {
    const x = (i / numPoints) * chord - chord/2;
    const progress = i / numPoints;
    
    const lowerY = -thickness * 0.2 * Math.sin(progress * Math.PI) * (1 - progress * 0.5);
    points.push(new Vector3(x, lowerY, 0));
  }
  
  return points;
}

// Create straight wing
function createStraightWing(vertices: number[], indices: number[], normals: number[], span: number, chord: number, thickness: number, profile: Vector3[]) {
  const halfSpan = span / 2;
  
  // Root profile (center)
  for (const point of profile) {
    vertices.push(point.x, point.y, -halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Tip profile (scaled down slightly)
  for (const point of profile) {
    const scale = 0.7; // Wing tapers toward tip
    vertices.push(point.x * scale, point.y, halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Create faces between root and tip
  const profileLength = profile.length;
  for (let i = 0; i < profileLength - 1; i++) {
    const i0 = i;
    const i1 = i + 1;
    const i2 = i + profileLength;
    const i3 = i + 1 + profileLength;
    
    // Two triangles per quad
    indices.push(i0, i1, i2);
    indices.push(i1, i3, i2);
  }
}

// Create swept wing (angled backward)
function createSweptWing(vertices: number[], indices: number[], normals: number[], span: number, chord: number, thickness: number, profile: Vector3[]) {
  const halfSpan = span / 2;
  const sweepAngle = Math.PI / 6; // 30 degree sweep
  
  // Root profile
  for (const point of profile) {
    vertices.push(point.x, point.y, -halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Tip profile (swept back and scaled)
  for (const point of profile) {
    const scale = 0.5;
    const sweptX = point.x * scale - halfSpan * Math.tan(sweepAngle);
    vertices.push(sweptX, point.y, halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Create faces
  const profileLength = profile.length;
  for (let i = 0; i < profileLength - 1; i++) {
    const i0 = i;
    const i1 = i + 1;
    const i2 = i + profileLength;
    const i3 = i + 1 + profileLength;
    
    indices.push(i0, i1, i2);
    indices.push(i1, i3, i2);
  }
}

// Create delta wing (triangular)
function createDeltaWing(vertices: number[], indices: number[], normals: number[], span: number, chord: number, thickness: number, profile: Vector3[]) {
  const halfSpan = span / 2;
  
  // Root profile (full chord)
  for (const point of profile) {
    vertices.push(point.x, point.y, -halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Tip (single point - triangular wing)
  vertices.push(-chord * 0.3, 0, halfSpan);
  normals.push(0, 1, 0);
  
  // Create triangular faces
  const profileLength = profile.length;
  const tipIndex = profileLength;
  
  for (let i = 0; i < profileLength - 1; i++) {
    indices.push(i, i + 1, tipIndex);
  }
}

// Create fighter wing (complex swept with multiple angles)
function createFighterWing(vertices: number[], indices: number[], normals: number[], span: number, chord: number, thickness: number, profile: Vector3[]) {
  const halfSpan = span / 2;
  
  // Root profile
  for (const point of profile) {
    vertices.push(point.x, point.y, -halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Mid profile (swept)
  for (const point of profile) {
    const scale = 0.8;
    const sweptX = point.x * scale - halfSpan * 0.3 * Math.tan(Math.PI / 8);
    vertices.push(sweptX, point.y, 0);
    normals.push(0, 1, 0);
  }
  
  // Tip profile (highly swept and small)
  for (const point of profile) {
    const scale = 0.3;
    const sweptX = point.x * scale - halfSpan * 0.8 * Math.tan(Math.PI / 4);
    vertices.push(sweptX, point.y, halfSpan);
    normals.push(0, 1, 0);
  }
  
  // Create faces between sections
  const profileLength = profile.length;
  
  // Root to mid
  for (let i = 0; i < profileLength - 1; i++) {
    const i0 = i;
    const i1 = i + 1;
    const i2 = i + profileLength;
    const i3 = i + 1 + profileLength;
    
    indices.push(i0, i1, i2);
    indices.push(i1, i3, i2);
  }
  
  // Mid to tip
  for (let i = 0; i < profileLength - 1; i++) {
    const i0 = i + profileLength;
    const i1 = i + 1 + profileLength;
    const i2 = i + profileLength * 2;
    const i3 = i + 1 + profileLength * 2;
    
    indices.push(i0, i1, i2);
    indices.push(i1, i3, i2);
  }
}

// Engine nacelle geometry - cylindrical with tapered ends
function createEngineGeometry(w: number, l: number, h: number): BufferGeometry {
  const geometry = new BufferGeometry();
  
  const radius = Math.min(w, h) * 0.35;
  const segments = 16;
  const vertices: number[] = [];
  const indices: number[] = [];
  
  // Create engine cylinder with tapered ends
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    
    // Front (tapered)
    const frontRadius = radius * 0.6;
    vertices.push(x * frontRadius, 0, z * frontRadius);
    vertices.push(0, -l/2, 0); // Front center
    
    // Middle (full size)
    vertices.push(x * radius, 0, z * radius);
    vertices.push(0, 0, 0); // Middle center
    
    // Back (tapered)
    const backRadius = radius * 0.8;
    vertices.push(x * backRadius, 0, z * backRadius);
    vertices.push(0, l/2, 0); // Back center
  }
  
  // Create triangular faces
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const base = i * 6;
    
    // Front cap
    indices.push(base, base + 6, base + 1);
    
    // Front to middle
    indices.push(base, base + 2, base + 6);
    indices.push(base + 6, base + 2, base + 8);
    
    // Middle to back  
    indices.push(base + 2, base + 4, base + 8);
    indices.push(base + 8, base + 4, base + 10);
    
    // Back cap
    indices.push(base + 4, base + 5, base + 10);
  }
  
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// Cockpit bubble geometry - dome-shaped canopy
function createCockpitGeometry(w: number, l: number, h: number): BufferGeometry {
  const geometry = new BufferGeometry();
  
  const vertices: number[] = [];
  const indices: number[] = [];
  
  // Create dome shape
  const segments = 12;
  const rings = 6;
  
  // Base vertices (cockpit frame)
  const baseVertices: Vector3[] = [
    new Vector3(-w/2, 0, -l/2), // Back left
    new Vector3(w/2, 0, -l/2),  // Back right  
    new Vector3(w/2, 0, l/2),   // Front right
    new Vector3(-w/2, 0, l/2)   // Front left
  ];
  
  // Add base vertices
  for (const vertex of baseVertices) {
    vertices.push(vertex.x, vertex.y, vertex.z);
  }
  
  // Create dome vertices
  for (let ring = 1; ring <= rings; ring++) {
    const ringHeight = (ring / rings) * h;
    const ringRadius = Math.sin((ring / rings) * Math.PI * 0.5);
    
    for (let seg = 0; seg < segments; seg++) {
      const angle = (seg / segments) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius * w * 0.4;
      const z = Math.sin(angle) * ringRadius * l * 0.4;
      
      vertices.push(x, ringHeight, z);
    }
  }
  
  // Top vertex
  vertices.push(0, h, 0);
  
  // Create base quad
  indices.push(0, 1, 2, 0, 2, 3);
  
  // Create dome faces
  const baseCount = baseVertices.length;
  for (let ring = 0; ring < rings; ring++) {
    const currentRing = baseCount + ring * segments;
    const nextRing = ring === rings - 1 ? vertices.length / 3 - 1 : baseCount + (ring + 1) * segments;
    
    for (let seg = 0; seg < segments; seg++) {
      const next = (seg + 1) % segments;
      
      if (ring === rings - 1) {
        // Top cap triangles
        indices.push(currentRing + seg, nextRing, currentRing + next);
      } else {
        // Side quads
        indices.push(
          currentRing + seg, nextRing + seg, currentRing + next,
          currentRing + next, nextRing + seg, nextRing + next
        );
      }
    }
  }
  
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// Fuselage geometry - streamlined body
function createFuselageGeometry(w: number, l: number, h: number): BufferGeometry {
  const geometry = new BufferGeometry();
  
  const vertices: number[] = [];
  const indices: number[] = [];
  
  const segments = 16;
  const sections = 8;
  
  // Create fuselage profile - oval that tapers at ends
  for (let section = 0; section <= sections; section++) {
    const progress = section / sections;
    const z = (progress - 0.5) * l;
    
    // Scale factor for tapering
    let scale = 1;
    if (progress < 0.2) {
      // Front taper
      scale = progress / 0.2 * 0.5 + 0.5;
    } else if (progress > 0.8) {
      // Rear taper  
      scale = (1 - progress) / 0.2 * 0.7 + 0.3;
    }
    
    const radiusW = w * 0.4 * scale;
    const radiusH = h * 0.3 * scale;
    
    for (let seg = 0; seg < segments; seg++) {
      const angle = (seg / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radiusW;
      const y = Math.sin(angle) * radiusH;
      
      vertices.push(x, y, z);
    }
  }
  
  // Create faces
  for (let section = 0; section < sections; section++) {
    for (let seg = 0; seg < segments; seg++) {
      const next = (seg + 1) % segments;
      const current = section * segments + seg;
      const currentNext = section * segments + next;
      const nextSection = (section + 1) * segments + seg;
      const nextSectionNext = (section + 1) * segments + next;
      
      // Two triangles per quad
      indices.push(current, nextSection, currentNext);
      indices.push(currentNext, nextSection, nextSectionNext);
    }
  }
  
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// Tail geometry - vertical stabilizer
function createTailGeometry(w: number, l: number, h: number): BufferGeometry {
  const geometry = new BufferGeometry();
  
  const vertices: number[] = [];
  const indices: number[] = [];
  
  const thickness = l * 0.2; // Thin tail
  
  // Tail fin profile - vertical stabilizer
  const tailProfile: Vector3[] = [
    new Vector3(-w/2, 0, -thickness/2),     // Bottom left back
    new Vector3(-w/2, 0, thickness/2),      // Bottom left front
    new Vector3(w/3, h * 0.8, thickness/2), // Top front
    new Vector3(w/2, h, 0),                 // Tip
    new Vector3(w/3, h * 0.8, -thickness/2), // Top back
    new Vector3(-w/2, 0, -thickness/2)      // Back to start
  ];
  
  // Add profile vertices
  for (const vertex of tailProfile.slice(0, -1)) { // Remove duplicate first vertex
    vertices.push(vertex.x, vertex.y, vertex.z);
  }
  
  // Create tail fin faces
  const numVertices = tailProfile.length - 1;
  
  // Front face
  indices.push(0, 1, 2);
  indices.push(0, 2, 3);
  indices.push(0, 3, 4);
  
  // Back face (reversed winding)
  indices.push(4, 3, 2);
  indices.push(4, 2, 1);
  indices.push(4, 1, 0);
  
  // Edges
  for (let i = 0; i < numVertices - 1; i++) {
    const next = (i + 1) % numVertices;
    // Create edge quad (if needed for thickness)
    if (i === 1 || i === 2) { // Front and top edges
      indices.push(i, next, i);
    }
  }
  
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}