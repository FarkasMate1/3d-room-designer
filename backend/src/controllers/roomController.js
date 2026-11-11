const { roomService } = require('../services/roomService');

const roomController = {
  async getAll(req, res, next) {
    try {
      const rooms = await roomService.getUserRooms(req.user.userId);
      res.json({ rooms });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      const result = await roomService.getRoomWithFurniture(roomId, req.user.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const room = await roomService.createRoom(req.user.userId, req.body);
      res.status(201).json({ room });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      const room = await roomService.updateRoom(roomId, req.user.userId, req.body);
      res.json({ room });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      await roomService.deleteRoom(roomId, req.user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async addFurniture(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      const item = await roomService.addFurniture(roomId, req.user.userId, req.body);
      res.status(201).json({ furniture: item });
    } catch (err) {
      next(err);
    }
  },

  async updateFurniture(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      const furnitureId = parseInt(req.params.fid, 10);
      const item = await roomService.updateFurniture(roomId, furnitureId, req.user.userId, req.body);
      res.json({ furniture: item });
    } catch (err) {
      next(err);
    }
  },

  async deleteFurniture(req, res, next) {
    try {
      const roomId = parseInt(req.params.id, 10);
      const furnitureId = parseInt(req.params.fid, 10);
      await roomService.deleteFurniture(roomId, furnitureId, req.user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { roomController };
