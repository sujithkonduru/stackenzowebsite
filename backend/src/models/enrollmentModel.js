const { pool } = require('../config/database');

class EnrollmentModel {
  // Create new enrollment
  static async create(enrollmentData) {
    const { name, email, phone, course, department, education, message, type } = enrollmentData;
    try {
      const query = `
        INSERT INTO enrollment_submissions 
        (name, email, phone, course, department, education, message, type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id
      `;
      const values = [name, email, phone, course, department || null, education, message, type || 'enrollment'];
      const result = await pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  }

  // Get all enrollments
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM enrollment_submissions WHERE 1=1';
      const params = [];

      if (filters.type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(filters.type);
      }

      if (filters.status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(filters.status);
      }

      query += ' ORDER BY created_at DESC';

      if (filters.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(filters.limit));
      }

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting enrollments:', error);
      throw error;
    }
  }

  // Get by ID
  static async getById(id) {
    try {
      const query = 'SELECT * FROM enrollment_submissions WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting enrollment by ID:', error);
      throw error;
    }
  }

  // Update status
  static async updateStatus(id, status) {
    try {
      const query = 'UPDATE enrollment_submissions SET status = $1, updated_at = NOW() WHERE id = $2';
      const result = await pool.query(query, [status, id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const query = `
        SELECT 
          type,
          status,
          COUNT(*) as count
        FROM enrollment_submissions
        GROUP BY type, status
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting enrollment stats:', error);
      throw error;
    }
  }

  // Get enrollments by type
  static async getByType(type, limit = 100) {
    try {
      const query = `
        SELECT * FROM enrollment_submissions 
        WHERE type = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      const result = await pool.query(query, [type, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting enrollments by type:', error);
      throw error;
    }
  }

  // Get enrollments by date range
  static async getByDateRange(startDate, endDate) {
    try {
      const query = `
        SELECT * FROM enrollment_submissions 
        WHERE created_at BETWEEN $1 AND $2 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error('Error getting enrollments by date range:', error);
      throw error;
    }
  }

  // Delete enrollment (soft delete or hard delete)
  static async delete(id, softDelete = true) {
    try {
      let query, params;
      if (softDelete) {
        query = 'UPDATE enrollment_submissions SET status = $1, deleted_at = NOW() WHERE id = $2';
        params = ['deleted', id];
      } else {
        query = 'DELETE FROM enrollment_submissions WHERE id = $1';
        params = [id];
      }
      const result = await pool.query(query, params);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }

  // Bulk update status
  static async bulkUpdateStatus(ids, status) {
    try {
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(',');
      const query = `
        UPDATE enrollment_submissions 
        SET status = $1, updated_at = NOW() 
        WHERE id IN (${placeholders})
      `;
      const result = await pool.query(query, [status, ...ids]);
      return result.rowCount;
    } catch (error) {
      console.error('Error bulk updating enrollment status:', error);
      throw error;
    }
  }

  // Get weekly enrollment count
  static async getWeeklyStats() {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('week', created_at) as week,
          COUNT(*) as total,
          COUNT(CASE WHEN type = 'enrollment' THEN 1 END) as enrollments,
          COUNT(CASE WHEN type = 'contact' THEN 1 END) as contacts
        FROM enrollment_submissions
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY week DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting weekly enrollment stats:', error);
      throw error;
    }
  }
}

module.exports = EnrollmentModel;