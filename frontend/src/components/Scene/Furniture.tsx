import * as THREE from 'three';

interface FurnitureProps {
  modelType: string;
  color: string;
  rotation: number;
  isSelected: boolean;
}

function Table({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 24]} />
        <meshStandardMaterial color={c} />
      </mesh>
      {[
        [-0.35, 0.36, -0.35],
        [0.35, 0.36, -0.35],
        [-0.35, 0.36, 0.35],
        [0.35, 0.36, 0.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.035, 0.035, 0.72, 8]} />
          <meshStandardMaterial color="#5a5248" />
        </mesh>
      ))}
    </group>
  );
}

function Chair({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      {[
        [-0.15, 0.22, -0.15],
        [0.15, 0.22, -0.15],
        [-0.15, 0.22, 0.15],
        [0.15, 0.22, 0.15],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
          <meshStandardMaterial color="#5a5248" />
        </mesh>
      ))}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.7, -0.18]}>
        <boxGeometry args={[0.4, 0.45, 0.05]} />
        <meshStandardMaterial color={c} />
      </mesh>
    </group>
  );
}

function Lamp({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.06, 16]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.2, 0.25, 16]} />
        <meshStandardMaterial color={c} />
      </mesh>
    </group>
  );
}

function Shelf({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.05, 2, 0.4]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0.4, 1, 0]}>
        <boxGeometry args={[0.05, 2, 0.4]} />
        <meshStandardMaterial color={c} />
      </mesh>
      {[-0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={i} position={[0.2, y, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.4]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
    </group>
  );
}

function Rug({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.5, 1]} />
      <meshStandardMaterial color={c} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Bed({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2, 0.2, 1.4]} />
        <meshStandardMaterial color="#8a7a6a" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.9, 0.2, 1.3]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.45, -0.45]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#f0e9dc" />
      </mesh>
    </group>
  );
}

function Wardrobe({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.2, 2, 0.6]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 1, 0.31]}>
        <boxGeometry args={[0.02, 1.8, 0.02]} />
        <meshStandardMaterial color="#5a5248" />
      </mesh>
    </group>
  );
}

function Nightstand({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[0.4, 0.5, 0.4]} />
      <meshStandardMaterial color={c} />
    </mesh>
  );
}

function Counter({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.8, 0.9, 0.6]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <boxGeometry args={[1.85, 0.06, 0.65]} />
        <meshStandardMaterial color="#c9c1b3" />
      </mesh>
    </group>
  );
}

function Stove({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.9, 0.6]} />
        <meshStandardMaterial color={c} />
      </mesh>
      {[
        [-0.15, 0.93, -0.15],
        [0.15, 0.93, -0.15],
        [-0.15, 0.93, 0.15],
        [0.15, 0.93, 0.15],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );
}

function Fridge({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.7, 1.8, 0.7]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0.36, 1.2, 0.05]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#5a5248" />
      </mesh>
    </group>
  );
}

function Toilet({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.2, 0.05]}>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.65, -0.2]}>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color={c} />
      </mesh>
    </group>
  );
}

function Sink({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#f0e9dc" />
      </mesh>
      <mesh position={[0, 0.95, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

function Shower({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.9, 2, 0.9]} />
        <meshStandardMaterial color={c} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

function Mirror({ color, isSelected }: { color: string; isSelected: boolean }) {
  const c = isSelected ? '#8a6f3f' : color;
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 0.5, 0.03]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial color="#dfe6ea" />
      </mesh>
    </group>
  );
}

const furnitureMap: Record<
  string,
  (props: { color: string; isSelected: boolean }) => JSX.Element
> = {
  table: Table,
  chair: Chair,
  lamp: Lamp,
  shelf: Shelf,
  rug: Rug,
  bed: Bed,
  wardrobe: Wardrobe,
  nightstand: Nightstand,
  counter: Counter,
  stove: Stove,
  fridge: Fridge,
  toilet: Toilet,
  sink: Sink,
  shower: Shower,
  mirror: Mirror,
};

export default function Furniture({ modelType, color, rotation, isSelected }: FurnitureProps) {
  const Component = furnitureMap[modelType];
  if (!Component) return null;

  return (
    <group rotation={[0, rotation, 0]}>
      <Component color={color} isSelected={isSelected} />
    </group>
  );
}
