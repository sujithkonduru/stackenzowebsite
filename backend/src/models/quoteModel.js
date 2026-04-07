const { pool } = require('../config/database');

class QuoteModel {
  static async create(quoteData) {
    const { name, email, phone, company, service, message } = quoteData;
    const result = await pool.query(
      'INSERT INTO quote_requests (name, email, phone, company, service, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, phone, company, service, message]
    );
    return result.rows[0].id;
  }

  static async getAll(filters = {}) {
    let query = 'SELECT * FROM quote_requests WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(filters.limit));
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM quote_requests WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE quote_requests SET status = $1 WHERE id = $2',
      [status, id]
    );
    return result.rowCount > 0;
  }
}

module.exports = QuoteModel;
