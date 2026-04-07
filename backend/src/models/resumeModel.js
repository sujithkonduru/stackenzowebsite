const { pool } = require('../config/database');

const createResume = async (resumeData) => {
  const query = `
    INSERT INTO resume_submissions 
    (name, email, phone, position, experience, resume_filename, resume_data, resume_mimetype, message)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;
  
  // PostgreSQL returns { rows: [...] } directly, not an array destructuring
  const result = await pool.query(query, [
    resumeData.name,
    resumeData.email,
    resumeData.phone,
    resumeData.position,
    resumeData.experience,
    resumeData.resume_filename,
    resumeData.resume_data,
    resumeData.resume_mimetype,
    resumeData.message
  ]);
  
  return result.rows[0].id;
};

const getAllResumes = async (filters = {}) => {
  let query = 'SELECT id, name, email, phone, position, experience, resume_filename, resume_mimetype, message, status, created_at FROM resume_submissions WHERE 1=1';
  const params = [];
  let paramCounter = 1;

  if (filters.status) {
    query += ` AND status = $${paramCounter}`;
    params.push(filters.status);
    paramCounter++;
  }

  if (filters.position) {
    query += ` AND position ILIKE $${paramCounter}`;
    params.push(`%${filters.position}%`);
    paramCounter++;
  }

  if (filters.email) {
    query += ` AND email = $${paramCounter}`;
    params.push(filters.email);
    paramCounter++;
  }

  query += ' ORDER BY created_at DESC';
  
  const result = await pool.query(query, params);
  
  // Add resume_url to each row
  return result.rows.map(row => ({
    ...row,
    resume_url: `http://localhost:5000/api/resumes/${row.id}/view`
  }));
};

const getResumeById = async (id) => {
  const query = 'SELECT * FROM resume_submissions WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateResumeStatus = async (id, status) => {
  const query = 'UPDATE resume_submissions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id';
  const result = await pool.query(query, [status, id]);
  return result.rowCount > 0;
};

// Additional useful functions
const deleteResume = async (id) => {
  const query = 'DELETE FROM resume_submissions WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
};

const getResumeByEmail = async (email) => {
  const query = 'SELECT * FROM resume_submissions WHERE email = $1 ORDER BY created_at DESC';
  const result = await pool.query(query, [email]);
  return result.rows;
};

const getResumeStats = async () => {
  const query = `
    SELECT 
      status,
      COUNT(*) as count
    FROM resume_submissions
    GROUP BY status
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResumeStatus,
  deleteResume,
  getResumeByEmail,
  getResumeStats
};