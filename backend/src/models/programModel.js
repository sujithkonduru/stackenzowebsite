const { pool } = require('../config/database');

const ProgramModel = {
  // Get all programs
  getAll: async () => {
    const result = await pool.query(
      'SELECT * FROM programs ORDER BY date DESC'
    );
    return result.rows.map(row => ({
      ...row,
      tags: ProgramModel.safeParseTags(row.tags)
    }));
  },

  // Get program by ID
  getById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM programs WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      tags: ProgramModel.safeParseTags(result.rows[0].tags)
    };
  },

  // Get programs by type
  getByType: async (type) => {
    const result = await pool.query(
      'SELECT * FROM programs WHERE type = $1 ORDER BY date DESC',
      [type]
    );
    return result.rows.map(row => ({
      ...row,
      tags: ProgramModel.safeParseTags(row.tags)
    }));
  },

  // Get programs by status
  getByStatus: async (status) => {
    const result = await pool.query(
      'SELECT * FROM programs WHERE status = $1 ORDER BY date DESC',
      [status]
    );
    return result.rows.map(row => ({
      ...row,
      tags: ProgramModel.safeParseTags(row.tags)
    }));
  },

  // Get upcoming programs (date >= current date)
  getUpcoming: async () => {
    const result = await pool.query(
      `SELECT * FROM programs 
       WHERE status = 'upcoming' AND date >= CURRENT_DATE 
       ORDER BY date ASC`
    );
    return result.rows.map(row => ({
      ...row,
      tags: ProgramModel.safeParseTags(row.tags)
    }));
  },

  // Get past programs
  getPast: async () => {
    const result = await pool.query(
      `SELECT * FROM programs 
       WHERE status = 'completed' OR date < CURRENT_DATE
       ORDER BY date DESC`
    );
    return result.rows.map(row => ({
      ...row,
      tags: ProgramModel.safeParseTags(row.tags)
    }));
  },

  // Create new program
  create: async (programData) => {
    const { title, type, date, location, description, duration, status, registrationLink, tags } = programData;
    const result = await pool.query(
      `INSERT INTO programs (title, type, date, location, description, duration, status, registration_link, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [title, type, date, location, description, duration, status, registrationLink, JSON.stringify(tags || [])]
    );
    return result.rows[0].id;
  },

  // Update program
  update: async (id, programData) => {
    const { title, type, date, location, description, duration, status, registrationLink, tags } = programData;
    const result = await pool.query(
      `UPDATE programs 
       SET title = $1, type = $2, date = $3, location = $4, description = $5, 
           duration = $6, status = $7, registration_link = $8, tags = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING id`,
      [title, type, date, location, description, duration, status, registrationLink, JSON.stringify(tags || []), id]
    );
    return result.rowCount > 0;
  },

  // Delete program
  delete: async (id) => {
    const result = await pool.query('DELETE FROM programs WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },

  // Register for program
  registerUser: async (registrationData) => {
    const { programId, name, email, phone, message } = registrationData;
    const result = await pool.query(
      `INSERT INTO program_registrations (program_id, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [programId, name, email, phone, message]
    );
    return result.rows[0].id;
  },

  // Get registrations for a program
  getRegistrations: async (programId) => {
    const result = await pool.query(
      `SELECT pr.*, p.title as program_title, p.date as program_date
       FROM program_registrations pr
       LEFT JOIN programs p ON pr.program_id = p.id
       WHERE pr.program_id = $1 
       ORDER BY pr.created_at DESC`,
      [programId]
    );
    return result.rows;
  },

  // Get all registrations (with filters)
  getAllRegistrations: async (filters = {}) => {
    let query = `
      SELECT pr.*, p.title as program_title, p.date as program_date, p.type as program_type
      FROM program_registrations pr
      LEFT JOIN programs p ON pr.program_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCounter = 1;

    if (filters.status) {
      query += ` AND pr.status = $${paramCounter}`;
      params.push(filters.status);
      paramCounter++;
    }

    if (filters.programId) {
      query += ` AND pr.program_id = $${paramCounter}`;
      params.push(filters.programId);
      paramCounter++;
    }

    if (filters.email) {
      query += ` AND pr.email = $${paramCounter}`;
      params.push(filters.email);
      paramCounter++;
    }

    query += ' ORDER BY pr.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Get registration by ID
  getRegistrationById: async (id) => {
    const result = await pool.query(
      `SELECT pr.*, p.title as program_title, p.date as program_date, p.location as program_location
       FROM program_registrations pr
       LEFT JOIN programs p ON pr.program_id = p.id
       WHERE pr.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Update registration status
  updateRegistrationStatus: async (id, status) => {
    const result = await pool.query(
      'UPDATE program_registrations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [status, id]
    );
    return result.rowCount > 0;
  },

  // Check if user already registered for a program
  isAlreadyRegistered: async (programId, email) => {
    const result = await pool.query(
      'SELECT id FROM program_registrations WHERE program_id = $1 AND email = $2',
      [programId, email]
    );
    return result.rows.length > 0;
  },

  // Get registration count for a program
  getRegistrationCount: async (programId) => {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM program_registrations WHERE program_id = $1',
      [programId]
    );
    return parseInt(result.rows[0].count);
  },

  // Get registration statistics
  getRegistrationStats: async () => {
    const result = await pool.query(`
      SELECT 
        p.title as program_title,
        p.type as program_type,
        p.date as program_date,
        COUNT(pr.id) as total_registrations,
        COUNT(CASE WHEN pr.status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN pr.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN pr.status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(CASE WHEN pr.status = 'attended' THEN 1 END) as attended
      FROM programs p
      LEFT JOIN program_registrations pr ON p.id = pr.program_id
      GROUP BY p.id, p.title, p.type, p.date
      ORDER BY p.date DESC
    `);
    return result.rows;
  },

  // Helper function to safely parse tags
  safeParseTags: (tags) => {
    if (!tags) return [];
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(tags)) return tags;
    return [];
  }
};

module.exports = ProgramModel;