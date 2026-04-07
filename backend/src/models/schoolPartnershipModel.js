const { pool } = require('../config/database');

const SchoolPartnershipModel = {
  // Create new school partnership request
  create: async (partnershipData) => {
    const {
      schoolName, schoolAddress, contactPerson, designation, email, phone,
      city, state, pincode, studentCount, preferredStartDate, message
    } = partnershipData;

    const [rows] = await pool.query(
      `INSERT INTO school_partnerships 
       (school_name, school_address, contact_person, designation, email, phone, 
        city, state, pincode, student_count, preferred_start_date, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [schoolName, schoolAddress, contactPerson, designation, email, phone, city, state, pincode, studentCount, preferredStartDate, message]
    );
    return rows[0].id;
  },

  // Get all school partnership requests
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM school_partnerships ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get partnership by ID
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM school_partnerships WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  // Update partnership status
  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE school_partnerships SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
    return result.rowCount > 0;
  },

  // Delete partnership request
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM school_partnerships WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

module.exports = SchoolPartnershipModel;
