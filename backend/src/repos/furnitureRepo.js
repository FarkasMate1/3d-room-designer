const pool = require('../config/db');

const furnitureRepo = {
  async findByRoomId(roomId) {
    const [rows] = await pool.query(
      'SELECT * FROM furniture_placements WHERE room_id = ?',
      [roomId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM furniture_placements WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO furniture_placements (room_id, model_type, pos_x, pos_y, pos_z, rot_y, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.room_id, data.model_type, data.pos_x, data.pos_y, data.pos_z, data.rot_y, data.color]
    );
    return result.insertId;
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.pos_x !== undefined) {
      fields.push('pos_x = ?');
      values.push(data.pos_x);
    }
    if (data.pos_y !== undefined) {
      fields.push('pos_y = ?');
      values.push(data.pos_y);
    }
    if (data.pos_z !== undefined) {
      fields.push('pos_z = ?');
      values.push(data.pos_z);
    }
    if (data.rot_y !== undefined) {
      fields.push('rot_y = ?');
      values.push(data.rot_y);
    }
    if (data.color !== undefined) {
      fields.push('color = ?');
      values.push(data.color);
    }

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(
      `UPDATE furniture_placements SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM furniture_placements WHERE id = ?', [id]);
  },

  async deleteByRoomId(roomId) {
    await pool.query('DELETE FROM furniture_placements WHERE room_id = ?', [roomId]);
  },
};

module.exports = { furnitureRepo };
