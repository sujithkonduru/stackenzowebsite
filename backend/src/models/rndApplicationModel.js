const { pool } = require('../config/database');

const rndApplicationModel = {
  create: async (applicationData) => {
    const query = `
      INSERT INTO rnd_applications 
      (name, email, phone, project_id, project_title, qualification, institution, 
       cgpa, experience, research_interests, why_join, resume_url, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW())
      RETURNING id
    `;
    
    const [rows] = await pool.query(query, [
      applicationData.name,
      applicationData.email,
      applicationData.phone,
      applicationData.projectId,
      applicationData.projectTitle,
      applicationData.qualification,
      applicationData.institution,
      applicationData.cgpa,
      applicationData.experience,
      applicationData.researchInterests,
      applicationData.whyJoin,
      applicationData.resumeUrl
    ]);
    
    return rows[0].id;
  },

  getAll: async () => {
    const query = 'SELECT * FROM rnd_applications ORDER BY created_at DESC';
    const [rows] = await pool.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = 'SELECT * FROM rnd_applications WHERE id = $1';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const query = 'UPDATE rnd_applications SET status = $1 WHERE id = $2';
    const [result] = await pool.query(query, [status, id]);
    return result.rowCount > 0;
  },

  delete: async (id) => {
    const query = 'DELETE FROM rnd_applications WHERE id = $1';
    const [result] = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
};

module.exports = rndApplicationModel;
