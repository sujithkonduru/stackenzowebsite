const { pool } = require('../config/database');

class QueryModel {
  // Create new query submission
  static async create(queryData) {
    const { name, email, phone, subject, category, message } = queryData;
    console.log('📝 Inserting query into database:', { name, email, subject, category });
    const [rows] = await pool.query(
      'INSERT INTO queries (name, email, phone, subject, category, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, phone, subject, category, message]
    );
    console.log('✅ Query inserted successfully, ID:', rows[0].id);
    return rows[0].id;
  }

  // Get all queries
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM queries WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Get by ID
  static async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM queries WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  // Update status
  static async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE queries SET status = $1 WHERE id = $2',
      [status, id]
    );
    return result.rowCount > 0;
  }

  // Delete
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM queries WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = QueryModel;
