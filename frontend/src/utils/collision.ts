export const COLLISION_SIZES: Record<string, { w: number; d: number }> = {
  table: { w: 1.0, d: 1.0 },
  chair: { w: 0.4, d: 0.4 },
  lamp: { w: 0.4, d: 0.4 },
  shelf: { w: 0.5, d: 0.4 },
  rug: { w: 1.5, d: 1.0 },
  bed: { w: 2.0, d: 1.4 },
  wardrobe: { w: 1.2, d: 0.6 },
  nightstand: { w: 0.4, d: 0.4 },
  counter: { w: 1.8, d: 0.6 },
  stove: { w: 0.6, d: 0.6 },
  fridge: { w: 0.7, d: 0.7 },
  toilet: { w: 0.4, d: 0.6 },
  sink: { w: 0.6, d: 0.4 },
  shower: { w: 0.9, d: 0.9 },
  mirror: { w: 0.8, d: 0.1 },
};

export const DEFAULT_SIZE = { w: 0.6, d: 0.6 };

export function getSize(type: string) {
  return COLLISION_SIZES[type] || DEFAULT_SIZE;
}

export function halfExtents(
  w: number,
  d: number,
  angle: number
): { hx: number; hz: number } {
  const a = Math.abs(Math.cos(angle));
  const b = Math.abs(Math.sin(angle));
  return {
    hx: (w / 2) * a + (d / 2) * b,
    hz: (w / 2) * b + (d / 2) * a,
  };
}

export function overlaps(
  a_x: number,
  a_z: number,
  aType: string,
  aAngle: number,
  b_x: number,
  b_z: number,
  bType: string,
  bAngle: number
): boolean {
  const sa = getSize(aType);
  const sb = getSize(bType);
  const ha = halfExtents(sa.w, sa.d, aAngle);
  const hb = halfExtents(sb.w, sb.d, bAngle);
  return (
    Math.abs(a_x - b_x) < ha.hx + hb.hx &&
    Math.abs(a_z - b_z) < ha.hz + hb.hz
  );
}

export function findFreePosition(
  type: string,
  width: number,
  length: number,
  existing: { model_type: string; pos_x: number; pos_z: number; rot_y: number }[]
): { x: number; z: number } {
  const size = getSize(type);
  const margin = Math.max(size.w, size.d) / 2 + 0.1;
  const minX = -width / 2 + margin;
  const maxX = width / 2 - margin;
  const minZ = -length / 2 + margin;
  const maxZ = length / 2 - margin;

  for (let i = 0; i < 30; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const z = minZ + Math.random() * (maxZ - minZ);
    let free = true;
    for (const e of existing) {
      if (overlaps(x, z, type, 0, e.pos_x, e.pos_z, e.model_type, e.rot_y)) {
        free = false;
        break;
      }
    }
    if (free) return { x, z };
  }

  return { x: minX + 0.5, z: minZ + 0.5 };
}