const pool = require('../config/db');

const roomRepo = {
  async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO rooms (user_id, name, room_type, width, length, wall_color, floor_color, ceiling_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.user_id, data.name, data.room_type, data.width, data.length, data.wall_color, data.floor_color, data.ceiling_color]
    );
    return result.insertId;
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.room_type !== undefined) {
      fields.push('room_type = ?');
      values.push(data.room_type);
    }
    if (data.width !== undefined) {
      fields.push('width = ?');
      values.push(data.width);
    }
    if (data.length !== undefined) {
      fields.push('length = ?');
      values.push(data.length);
    }
    if (data.wall_color !== undefined) {
      fields.push('wall_color = ?');
      values.push(data.wall_color);
    }
    if (data.floor_color !== undefined) {
      fields.push('floor_color = ?');
      values.push(data.floor_color);
    }
    if (data.ceiling_color !== undefined) {
      fields.push('ceiling_color = ?');
      values.push(data.ceiling_color);
    }

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(
      `UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
  },
};

module.exports = { roomRepo };
