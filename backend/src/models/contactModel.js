const { pool } = require('../config/database');

class ContactModel {
  // Create new contact submission
  static async create(contactData) {
    const { name, email, phone, subject, message } = contactData;
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, phone, subject, message]
    );
    return result.rows[0].id;
  }

  // Get all contact submissions
  static async getAll(filters = {}) {
    const query = 'SELECT * FROM contact_submissions ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }


  // Get by ID
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Update status
  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE contact_submissions SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
    return result.rowCount > 0;
  }

  // Delete
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM contact_submissions WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = ContactModel;
