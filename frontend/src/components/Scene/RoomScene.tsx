import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import Furniture from './Furniture';
import { getSize, overlaps, halfExtents } from '../../utils/collision';
import { FurniturePlacement } from '../../types';

interface RoomSceneProps {
  width: number;
  length: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  furniture: FurniturePlacement[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onDragEnd: (id: number, position: [number, number, number]) => void;
  onCollision: () => void;
}

const WALL_HEIGHT = 3;

function Room({
  width,
  length,
  wallColor,
  floorColor,
  ceilingColor,
}: {
  width: number;
  length: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
}) {
  const hw = width / 2;
  const hl = length / 2;

  return (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={ceilingColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, -hl]}>
        <planeGeometry args={[width, WALL_HEIGHT]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-hw, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, WALL_HEIGHT]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[hw, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, WALL_HEIGHT]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CollisionBox({ target }: { target: MutableRefObject<THREE.Group> }) {
  useHelper(target, THREE.BoxHelper, '#ff0000');
  return null;
}

function DraggableFurniture({
  item,
  roomWidth,
  roomLength,
  furniture,
  isSelected,
  onSelect,
  onDragEnd,
  onCollision,
}: {
  item: FurniturePlacement;
  roomWidth: number;
  roomLength: number;
  furniture: FurniturePlacement[];
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (pos: [number, number, number]) => void;
  onCollision: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [isColliding, setIsColliding] = useState(false);
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const wallPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const pointer = useRef(new THREE.Vector3());
  const drag = useRef<{
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    startX: number;
    startY: number;
    startZ: number;
    wall: 'back' | 'front' | 'left' | 'right';
  } | null>(null);

  const size = getSize(item.model_type);
  const isWallMounted = item.model_type === 'mirror';
  const extents = halfExtents(size.w, size.d, item.rot_y);
  const limX = roomWidth / 2 - extents.hx - 0.02;
  const limZ = roomLength / 2 - extents.hz - 0.02;

  const hasCollision = (x: number, z: number) =>
    furniture.some(
      (o) =>
        o.id !== item.id &&
        overlaps(x, z, item.model_type, item.rot_y, o.pos_x, o.pos_z, o.model_type, o.rot_y)
    );

  const projectToFloor = (event: PointerEvent, target: THREE.Vector3) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.current.setFromCamera(ndc, camera);
    raycaster.current.ray.intersectPlane(floorPlane.current, target);
  };

  const projectToWall = (event: PointerEvent, target: THREE.Vector3) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.current.setFromCamera(ndc, camera);
    raycaster.current.ray.intersectPlane(wallPlane.current, target);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    onSelect();

    const group = groupRef.current;
    if (!group) return;

    setIsColliding(false);

    if (isWallMounted) {
      const gx = group.position.x;
      const gz = group.position.z;
      const dBack = Math.abs(gz + roomLength / 2);
      const dFront = Math.abs(gz - roomLength / 2);
      const dLeft = Math.abs(gx + roomWidth / 2);
      const dRight = Math.abs(gx - roomWidth / 2);
      let startWall: 'back' | 'front' | 'left' | 'right' = 'back';
      const min = Math.min(dBack, dFront, dLeft, dRight);
      if (min === dFront) startWall = 'front';
      else if (min === dLeft) startWall = 'left';
      else if (min === dRight) startWall = 'right';

      wallPlane.current.constant = -group.position.z;
      event.ray.intersectPlane(wallPlane.current, pointer.current);
      drag.current = {
        offsetX: pointer.current.x - group.position.x,
        offsetY: pointer.current.y - group.position.y,
        offsetZ: 0,
        startX: group.position.x,
        startY: group.position.y,
        startZ: group.position.z,
        wall: startWall,
      };
    } else {
      event.ray.intersectPlane(floorPlane.current, pointer.current);
      drag.current = {
        offsetX: pointer.current.x - group.position.x,
        offsetY: 0,
        offsetZ: pointer.current.z - group.position.z,
        startX: group.position.x,
        startY: group.position.y,
        startZ: group.position.z,
        wall: 'back',
      };
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const group = groupRef.current;
    if (!drag.current || !group) return;

    if (isWallMounted) {
      projectToFloor(event, pointer.current);
      const x = pointer.current.x;
      const z = pointer.current.z;

      const dBack = Math.abs(z + roomLength / 2);
      const dFront = Math.abs(z - roomLength / 2);
      const dLeft = Math.abs(x + roomWidth / 2);
      const dRight = Math.abs(x - roomWidth / 2);

      const distances = { back: dBack, front: dFront, left: dLeft, right: dRight };

      let wall: 'back' | 'front' | 'left' | 'right' = drag.current.wall;

      let outOfBounds = false;
      if (wall === 'back' || wall === 'front') {
        if (x < -roomWidth / 2 + 0.45 || x > roomWidth / 2 - 0.45) {
          outOfBounds = true;
        }
      } else {
        if (z < -roomLength / 2 + 0.45 || z > roomLength / 2 - 0.45) {
          outOfBounds = true;
        }
      }

      if (outOfBounds) {
        const nearest = (Object.keys(distances) as Array<keyof typeof distances>).reduce(
          (a, b) => (distances[b] < distances[a] ? b : a),
          'back'
        );
        wall = nearest;
        drag.current.wall = wall;
      }

      const plane =
        wall === 'back'
          ? new THREE.Plane(new THREE.Vector3(0, 0, 1), roomLength / 2)
          : wall === 'front'
          ? new THREE.Plane(new THREE.Vector3(0, 0, -1), roomLength / 2)
          : wall === 'left'
          ? new THREE.Plane(new THREE.Vector3(1, 0, 0), roomWidth / 2)
          : new THREE.Plane(new THREE.Vector3(-1, 0, 0), roomWidth / 2);

      raycaster.current.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - gl.domElement.getBoundingClientRect().left) /
            gl.domElement.getBoundingClientRect().width) *
            2 -
            1,
          -((event.clientY - gl.domElement.getBoundingClientRect().top) /
            gl.domElement.getBoundingClientRect().height) *
            2 +
            1
        ),
        camera
      );
      raycaster.current.ray.intersectPlane(plane, pointer.current);

      if (wall === 'back' || wall === 'front') {
        group.position.x = THREE.MathUtils.clamp(
          pointer.current.x,
          -roomWidth / 2 + 0.4,
          roomWidth / 2 - 0.4
        );
        group.position.y = THREE.MathUtils.clamp(pointer.current.y, 0.5, 2.2);
        group.position.z =
          wall === 'back' ? -roomLength / 2 + 0.05 : roomLength / 2 - 0.05;
      } else {
        group.position.z = THREE.MathUtils.clamp(
          pointer.current.z,
          -roomLength / 2 + 0.4,
          roomLength / 2 - 0.4
        );
        group.position.y = THREE.MathUtils.clamp(pointer.current.y, 0.5, 2.2);
        group.position.x =
          wall === 'left' ? -roomWidth / 2 + 0.05 : roomWidth / 2 - 0.05;
      }

      setIsColliding(false);
    } else {
      projectToFloor(event, pointer.current);
      group.position.x = THREE.MathUtils.clamp(
        pointer.current.x - drag.current.offsetX,
        -limX,
        limX
      );
      group.position.z = THREE.MathUtils.clamp(
        pointer.current.z - drag.current.offsetZ,
        -limZ,
        limZ
      );
      group.position.y = 0;
      setIsColliding(hasCollision(group.position.x, group.position.z));
    }
  };

  const handlePointerUp = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    const group = groupRef.current;
    if (!drag.current || !group) return;

    if (isWallMounted) {
      if (
        group.position.x !== drag.current.startX ||
        group.position.y !== drag.current.startY ||
        group.position.z !== drag.current.startZ
      ) {
        onDragEnd([group.position.x, group.position.y, group.position.z]);
      }
    } else if (hasCollision(group.position.x, group.position.z)) {
      group.position.set(drag.current.startX, 0, drag.current.startZ);
      setIsColliding(false);
      onCollision();
    } else if (
      group.position.x !== drag.current.startX ||
      group.position.z !== drag.current.startZ
    ) {
      onDragEnd([group.position.x, group.position.y, group.position.z]);
    }

    drag.current = null;
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={[item.pos_x, item.pos_y, item.pos_z]}
      onPointerDown={handlePointerDown}
    >
      <Furniture
        modelType={item.model_type}
        color={item.color}
        rotation={item.rot_y}
        isSelected={isSelected}
      />
      {isColliding && <CollisionBox target={groupRef} />}
    </group>
  );
}

export default function RoomScene({
  width,
  length,
  wallColor,
  floorColor,
  ceilingColor,
  furniture,
  selectedId,
  onSelect,
  onDragEnd,
  onCollision,
}: RoomSceneProps) {
  const controlsRef = useRef<any>(null);

  const zoomBy = (factor: number) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const camera = controls.object as any;
    const target = controls.target as THREE.Vector3;
    const offset = new THREE.Vector3().subVectors(camera.position, target);

    let radius = offset.length() * factor;
    radius = THREE.MathUtils.clamp(radius, 3, 20);

    camera.position.copy(
      target.clone().add(offset.normalize().multiplyScalar(radius))
    );
    controls.update();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [6, 4, 6], fov: 50 }}
        onPointerMissed={() => onSelect(null)}
      >
        <ambientLight intensity={0.55} color="#f4efe3" />
        <directionalLight position={[5, 10, 5]} intensity={0.9} color="#fff3e0" />
        <directionalLight position={[-5, 5, -5]} intensity={0.25} color="#e8e0d0" />

        <Room
          width={width}
          length={length}
          wallColor={wallColor}
          floorColor={floorColor}
          ceilingColor={ceilingColor}
        />

        {furniture.map((item) => (
          <DraggableFurniture
            key={item.id}
            item={item}
            roomWidth={width}
            roomLength={length}
            furniture={furniture}
            isSelected={selectedId === item.id}
            onSelect={() => onSelect(item.id)}
            onDragEnd={(pos) => onDragEnd(item.id, pos)}
            onCollision={onCollision}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableDamping
          zoomSpeed={0.5}
          minDistance={3}
          maxDistance={20}
          mouseButtons={{
            LEFT: null as any,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
        <gridHelper args={[Math.max(width, length), 10, '#9a9084', '#c9c0b2']} />
      </Canvas>

      <div className="zoom-controls">
        <button onClick={() => zoomBy(0.85)} title="Zoom in">
          +
        </button>
        <button onClick={() => zoomBy(1.18)} title="Zoom out">
          &minus;
        </button>
      </div>
    </div>
  );
}