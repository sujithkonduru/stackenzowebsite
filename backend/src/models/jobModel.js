const { pool } = require('../config/database');

class JobModel {
  static safeParseArray(value) {
    if (value == null) return [];
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    // Handle PostgreSQL JSONB type which might be returned as object
    if (Array.isArray(value)) return value;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value);
    }
    return [];
  }

  // Create job posting
  static async createPosting(jobData) {
    const { title, department, location, type, experience, salary, description, requirements, responsibilities } = jobData;
    
    // PostgreSQL uses $1, $2 etc. and returns rows array directly
    const result = await pool.query(
      `INSERT INTO job_postings 
       (title, department, location, type, experience, salary, description, requirements, responsibilities) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id`,
      [title, department, location, type, experience, salary, description, 
       JSON.stringify(requirements), JSON.stringify(responsibilities)]
    );
    
    return result.rows[0].id;
  }

  // Get all active job postings
  static async getAllPostings(filters = {}) {
    let query = 'SELECT * FROM job_postings WHERE is_active = true';
    const params = [];
    let paramCounter = 1;

    if (filters.department) {
      query += ` AND department = $${paramCounter}`;
      params.push(filters.department);
      paramCounter++;
    }

    if (filters.type) {
      query += ` AND type = $${paramCounter}`;
      params.push(filters.type);
      paramCounter++;
    }

    if (filters.location) {
      query += ` AND location ILIKE $${paramCounter}`;
      params.push(`%${filters.location}%`);
      paramCounter++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    return result.rows.map(row => ({
      ...row,
      requirements: JobModel.safeParseArray(row.requirements),
      responsibilities: JobModel.safeParseArray(row.responsibilities)
    }));
  }

  // Get job by ID
  static async getPostingById(id) {
    const result = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1',
      [id]
    );
    
    if (result.rows[0]) {
      return {
        ...result.rows[0],
        requirements: JobModel.safeParseArray(result.rows[0].requirements),
        responsibilities: JobModel.safeParseArray(result.rows[0].responsibilities)
      };
    }
    return null;
  }

  // Update job posting
  static async updatePosting(id, jobData) {
    const { title, department, location, type, experience, salary, description, requirements, responsibilities, is_active } = jobData;
    
    const result = await pool.query(
      `UPDATE job_postings 
       SET title = $1, department = $2, location = $3, type = $4, 
           experience = $5, salary = $6, description = $7, 
           requirements = $8, responsibilities = $9, is_active = $10,
           updated_at = NOW()
       WHERE id = $11
       RETURNING id`,
      [title, department, location, type, experience, salary, description,
       JSON.stringify(requirements), JSON.stringify(responsibilities), is_active, id]
    );
    
    return result.rows[0] ? result.rows[0].id : null;
  }

  // Delete job posting (soft delete)
  static async deletePosting(id) {
    const result = await pool.query(
      'UPDATE job_postings SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] ? true : false;
  }

  // Create job application
  static async createApplication(applicationData) {
    const { job_id, name, email, phone, resume_url, cover_letter } = applicationData;
    
    const result = await pool.query(
      `INSERT INTO job_applications 
       (job_id, name, email, phone, resume_url, cover_letter) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [job_id, name, email, phone, resume_url, cover_letter]
    );
    
    return result.rows[0].id;
  }

  // Get all applications
  static async getAllApplications(filters = {}) {
    let query = `
      SELECT ja.*, jp.title as job_title, jp.department
      FROM job_applications ja
      LEFT JOIN job_postings jp ON ja.job_id = jp.id
      WHERE 1=1
    `;
    const params = [];
    let paramCounter = 1;

    if (filters.job_id) {
      query += ` AND ja.job_id = $${paramCounter}`;
      params.push(filters.job_id);
      paramCounter++;
    }

    if (filters.status) {
      query += ` AND ja.status = $${paramCounter}`;
      params.push(filters.status);
      paramCounter++;
    }

    if (filters.email) {
      query += ` AND ja.email = $${paramCounter}`;
      params.push(filters.email);
      paramCounter++;
    }

    query += ' ORDER BY ja.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Get applications by job ID
  static async getApplicationsByJobId(jobId) {
    const result = await pool.query(
      `SELECT ja.*, jp.title as job_title, jp.department
       FROM job_applications ja
       LEFT JOIN job_postings jp ON ja.job_id = jp.id
       WHERE ja.job_id = $1
       ORDER BY ja.created_at DESC`,
      [jobId]
    );
    return result.rows;
  }

  // Update application status
  static async updateApplicationStatus(id, status) {
    const result = await pool.query(
      'UPDATE job_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [status, id]
    );
    return result.rows[0] ? true : false;
  }

  // Get application by ID
  static async getApplicationById(id) {
    const result = await pool.query(
      `SELECT ja.*, jp.title as job_title, jp.department
       FROM job_applications ja
       LEFT JOIN job_postings jp ON ja.job_id = jp.id
       WHERE ja.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = JobModel;