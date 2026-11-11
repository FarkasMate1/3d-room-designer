export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Room {
  id: number;
  user_id: number;
  name: string;
  room_type: string;
  width: number;
  length: number;
  wall_color: string;
  floor_color: string;
  ceiling_color: string;
  created_at: string;
}

export interface FurniturePlacement {
  id: number;
  room_id: number;
  model_type: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rot_y: number;
  color: string;
}

export interface CreateRoomInput {
  name: string;
  room_type?: string;
  width?: number;
  length?: number;
  wall_color?: string;
  floor_color?: string;
  ceiling_color?: string;
}

export interface CreateFurnitureInput {
  model_type: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rot_y: number;
  color: string;
}
