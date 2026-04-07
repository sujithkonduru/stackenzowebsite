const { pool } = require('../config/database');

const RoboticsEnrollmentModel = {
  // Create new enrollment
  create: async (enrollmentData) => {
    const { 
      studentName, parentName, email, phone, studentClass, 
      school, age, previousExperience, message 
    } = enrollmentData;
    
    const [rows] = await pool.query(
      `INSERT INTO robotics_enrollments 
       (student_name, parent_name, email, phone, student_class, school, age, previous_experience, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [studentName, parentName, email, phone, studentClass, school, age, previousExperience, message]
    );
    return rows[0].id;
  },

  // Get all enrollments
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM robotics_enrollments ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get enrollment by ID
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM robotics_enrollments WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  // Update enrollment status
  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE robotics_enrollments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
    return result.rowCount > 0;
  },

  // Delete enrollment
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM robotics_enrollments WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

module.exports = RoboticsEnrollmentModel;
