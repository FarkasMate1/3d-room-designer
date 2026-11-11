const { roomRepo } = require('../repos/roomRepo');
const { furnitureRepo } = require('../repos/furnitureRepo');
const { AppError } = require('../errors/AppError');

const roomService = {
  async getUserRooms(userId) {
    return roomRepo.findByUserId(userId);
  },

  async getRoomWithFurniture(roomId, userId) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized to view this room', 403);
    }

    const furniture = await furnitureRepo.findByRoomId(roomId);
    return { room, furniture };
  },

  async createRoom(userId, data) {
    const id = await roomRepo.create({
      user_id: userId,
      ...data,
    });

    const room = await roomRepo.findById(id);
    if (!room) {
      throw new AppError('Failed to create room', 500);
    }
    return room;
  },

  async updateRoom(roomId, userId, data) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized to update this room', 403);
    }

    await roomRepo.update(roomId, data);

    const updated = await roomRepo.findById(roomId);
    return updated;
  },

  async deleteRoom(roomId, userId) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized to delete this room', 403);
    }

    await furnitureRepo.deleteByRoomId(roomId);
    await roomRepo.delete(roomId);
  },

  async addFurniture(roomId, userId, data) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized', 403);
    }

    const id = await furnitureRepo.create({ room_id: roomId, ...data });
    const item = await furnitureRepo.findById(id);
    return item;
  },

  async updateFurniture(roomId, furnitureId, userId, data) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized', 403);
    }

    const item = await furnitureRepo.findById(furnitureId);
    if (!item) {
      throw new AppError('Furniture not found', 404);
    }

    await furnitureRepo.update(furnitureId, data);
    const updated = await furnitureRepo.findById(furnitureId);
    return updated;
  },

  async deleteFurniture(roomId, furnitureId, userId) {
    const room = await roomRepo.findById(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    if (room.user_id !== userId) {
      throw new AppError('Not authorized', 403);
    }

    const item = await furnitureRepo.findById(furnitureId);
    if (!item) {
      throw new AppError('Furniture not found', 404);
    }

    await furnitureRepo.delete(furnitureId);
  },
};

module.exports = { roomService };
