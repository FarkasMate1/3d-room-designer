const { z } = require('zod');

const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100),
  room_type: z.enum(['bathroom', 'kitchen', 'bedroom']).default('bedroom'),
  width: z.number().min(2).max(20).default(5),
  length: z.number().min(2).max(20).default(5),
  wall_color: z.string().optional().default('#ffffff'),
  floor_color: z.string().optional().default('#cccccc'),
  ceiling_color: z.string().optional().default('#ffffff'),
});

const updateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  room_type: z.enum(['bathroom', 'kitchen', 'bedroom']).optional(),
  width: z.number().min(2).max(20).optional(),
  length: z.number().min(2).max(20).optional(),
  wall_color: z.string().optional(),
  floor_color: z.string().optional(),
  ceiling_color: z.string().optional(),
});

const createFurnitureSchema = z.object({
  model_type: z.string().min(1, 'Model type is required'),
  pos_x: z.number(),
  pos_y: z.number(),
  pos_z: z.number(),
  rot_y: z.number().default(0),
  color: z.string().default('#8B4513'),
});

const updateFurnitureSchema = z.object({
  pos_x: z.number().optional(),
  pos_y: z.number().optional(),
  pos_z: z.number().optional(),
  rot_y: z.number().optional(),
  color: z.string().optional(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  createFurnitureSchema,
  updateFurnitureSchema,
};
