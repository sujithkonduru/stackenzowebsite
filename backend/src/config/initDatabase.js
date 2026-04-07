const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

// Validate required env vars
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD is required in backend/.env');
}
if (!process.env.DB_USER) {
  throw new Error('DB_USER is required in backend/.env');
}

// Helper function to add column if it doesn't exist
const addColumnIfNotExists = async (client, tableName, columnName, columnDefinition) => {
  try {
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = $2
    `, [tableName, columnName]);
    
    if (checkColumn.rows.length === 0) {
      await client.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
      console.log(`✅ Added column ${columnName} to ${tableName}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`⚠️ Could not add column ${columnName} to ${tableName}:`, error.message);
    return false;
  }
};

// Helper function to modify column if needed
const modifyColumnIfExists = async (client, tableName, columnName, columnDefinition) => {
  try {
    const checkColumn = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = $2
    `, [tableName, columnName]);
    
    if (checkColumn.rows.length > 0) {
      await client.query(`ALTER TABLE ${tableName} ALTER COLUMN ${columnDefinition}`);
      console.log(`✅ Modified column ${columnName} in ${tableName}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`⚠️ Could not modify column ${columnName} in ${tableName}:`, error.message);
    return false;
  }
};

// Helper function to add constraint if not exists
const addConstraintIfNotExists = async (client, tableName, constraintName, constraintDefinition) => {
  try {
    const checkConstraint = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = $1 AND constraint_name = $2
    `, [tableName, constraintName]);
    
    if (checkConstraint.rows.length === 0) {
      await client.query(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${constraintDefinition}`);
      console.log(`✅ Added constraint ${constraintName} to ${tableName}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`⚠️ Could not add constraint ${constraintName} to ${tableName}:`, error.message);
    return false;
  }
};

// Helper function to create or replace index
const createIndexIfNotExists = async (client, indexName, tableName, columns) => {
  try {
    const checkIndex = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = $1 AND indexname = $2
    `, [tableName, indexName]);
    
    if (checkIndex.rows.length === 0) {
      await client.query(`CREATE INDEX ${indexName} ON ${tableName} ${columns}`);
      console.log(`✅ Created index ${indexName} on ${tableName}`);
    }
  } catch (error) {
    console.log(`⚠️ Index ${indexName} already exists or could not be created:`, error.message);
  }
};

// Helper function to create or replace trigger
const createOrReplaceTrigger = async (client, triggerName, tableName, functionName) => {
  try {
    // Drop trigger if exists
    await client.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName}`);
    // Create new trigger
    await client.query(`
      CREATE TRIGGER ${triggerName}
      BEFORE UPDATE ON ${tableName}
      FOR EACH ROW EXECUTE FUNCTION ${functionName}()
    `);
    console.log(`✅ Created/Updated trigger ${triggerName} on ${tableName}`);
  } catch (error) {
    console.log(`⚠️ Could not create trigger ${triggerName}:`, error.message);
  }
};

// Helper function to create or update tables
const createOrUpdateTable = async (client, tableName, createQuery, alterQueries = []) => {
  try {
    // Create table if not exists
    await client.query(createQuery);
    console.log(`✅ Table ${tableName} verified/created`);
    
    // Execute alter queries if provided
    for (const alterQuery of alterQueries) {
      try {
        await client.query(alterQuery);
      } catch (error) {
        console.log(`⚠️ Could not execute alter on ${tableName}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to create/update table ${tableName}:`, error.message);
    throw error;
  }
};

const initDatabase = async () => {
  let client;
  
  try {
    const dbName = process.env.DB_NAME || 'stackenzo_db';
    
    // Step 1: Connect to 'postgres' to create DB
    client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres'
    });
    await client.connect();

    console.log('📦 Creating database if not exists...');
    const dbExists = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (dbExists.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Created database: ${dbName}`);
    } else {
      console.log(`✅ Database already exists: ${dbName}`);
    }
    await client.end();

    // Step 2: Connect to new DB and create tables
    client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: dbName,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    await client.connect();

    // Create the updated_at trigger function (required for all triggers)
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS \$\$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        \$\$ language plpgsql;
      `);
      console.log('✅ Trigger function created/updated');
    } catch (funcError) {
      console.log('⚠️ Trigger function creation error:', funcError.message);
    }

    console.log('📋 Creating/Updating tables...');

    // Contact submissions - with alter support for new columns
    await createOrUpdateTable(client, 'contact_submissions', `
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `, [
      `ALTER TABLE contact_submissions ALTER COLUMN subject TYPE VARCHAR(500)`,
      `ALTER TABLE contact_submissions ALTER COLUMN status SET DEFAULT 'new'`
    ]);

    await createIndexIfNotExists(client, 'idx_contact_email', 'contact_submissions', '(email)');
    await createIndexIfNotExists(client, 'idx_contact_status', 'contact_submissions', '(status)');
    await createIndexIfNotExists(client, 'idx_contact_created', 'contact_submissions', '(created_at)');
    await createOrReplaceTrigger(client, 'update_contact_submissions_updated', 'contact_submissions', 'update_updated_at_column');

    console.log('✅ Contact table ready');

    // Enrollment submissions
    await createOrUpdateTable(client, 'enrollment_submissions', `
      CREATE TABLE IF NOT EXISTS enrollment_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        course VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        education TEXT,
        message TEXT,
        type VARCHAR(50) DEFAULT 'enrollment',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_enrollment_email', 'enrollment_submissions', '(email)');
    await createIndexIfNotExists(client, 'idx_enrollment_status', 'enrollment_submissions', '(status)');
    await createIndexIfNotExists(client, 'idx_enrollment_type', 'enrollment_submissions', '(type)');
    await createIndexIfNotExists(client, 'idx_enrollment_created', 'enrollment_submissions', '(created_at)');
    await createOrReplaceTrigger(client, 'update_enrollment_submissions_updated', 'enrollment_submissions', 'update_updated_at_column');

    console.log('✅ Enrollment table ready');

    // Job Postings table
    await createOrUpdateTable(client, 'job_postings', `
      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid')),
        experience VARCHAR(100),
        salary VARCHAR(100),
        description TEXT NOT NULL,
        requirements JSONB NOT NULL DEFAULT '[]',
        responsibilities JSONB NOT NULL DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `, [
      `ALTER TABLE job_postings ALTER COLUMN requirements SET DEFAULT '[]'`,
      `ALTER TABLE job_postings ALTER COLUMN responsibilities SET DEFAULT '[]'`
    ]);

    await createIndexIfNotExists(client, 'idx_job_title', 'job_postings', '(title)');
    await createIndexIfNotExists(client, 'idx_job_department', 'job_postings', '(department)');
    await createIndexIfNotExists(client, 'idx_job_active', 'job_postings', '(is_active)');
    await createIndexIfNotExists(client, 'idx_job_created', 'job_postings', '(created_at)');
    await createOrReplaceTrigger(client, 'update_job_postings_updated', 'job_postings', 'update_updated_at_column');

    console.log('✅ Job postings table ready');

    // Job Applications table
    await createOrUpdateTable(client, 'job_applications', `
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        resume_url TEXT,
        cover_letter TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_applications_job_id', 'job_applications', '(job_id)');
    await createIndexIfNotExists(client, 'idx_applications_email', 'job_applications', '(email)');
    await createIndexIfNotExists(client, 'idx_applications_status', 'job_applications', '(status)');
    await createIndexIfNotExists(client, 'idx_applications_created', 'job_applications', '(created_at)');
    await createOrReplaceTrigger(client, 'update_job_applications_updated', 'job_applications', 'update_updated_at_column');

    console.log('✅ Job applications table ready');

    // Newsletter Subscribers table
    await createOrUpdateTable(client, 'newsletter_subscribers', `
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT true,
        subscribed_at TIMESTAMP DEFAULT NOW(),
        unsubscribed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_newsletter_email', 'newsletter_subscribers', '(email)');
    await createIndexIfNotExists(client, 'idx_newsletter_active', 'newsletter_subscribers', '(is_active)');
    await createIndexIfNotExists(client, 'idx_newsletter_subscribed', 'newsletter_subscribers', '(subscribed_at)');
    await createOrReplaceTrigger(client, 'update_newsletter_subscribers_updated', 'newsletter_subscribers', 'update_updated_at_column');

    console.log('✅ Newsletter subscribers table ready');

    // Programs table
    await createOrUpdateTable(client, 'programs', `
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('workshop', 'seminar', 'conference', 'training', 'webinar', 'course')),
        date DATE NOT NULL,
        location VARCHAR(255),
        description TEXT NOT NULL,
        duration VARCHAR(100),
        status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
        registration_link TEXT,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_programs_title', 'programs', '(title)');
    await createIndexIfNotExists(client, 'idx_programs_type', 'programs', '(type)');
    await createIndexIfNotExists(client, 'idx_programs_status', 'programs', '(status)');
    await createIndexIfNotExists(client, 'idx_programs_date', 'programs', '(date)');
    await createIndexIfNotExists(client, 'idx_programs_created', 'programs', '(created_at)');
    await createOrReplaceTrigger(client, 'update_programs_updated', 'programs', 'update_updated_at_column');

    console.log('✅ Programs table ready');

    // Program Registrations table
    await createOrUpdateTable(client, 'program_registrations', `
      CREATE TABLE IF NOT EXISTS program_registrations (
        id SERIAL PRIMARY KEY,
        program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_registrations_program_id', 'program_registrations', '(program_id)');
    await createIndexIfNotExists(client, 'idx_registrations_email', 'program_registrations', '(email)');
    await createIndexIfNotExists(client, 'idx_registrations_status', 'program_registrations', '(status)');
    await createIndexIfNotExists(client, 'idx_registrations_created', 'program_registrations', '(created_at)');
    await createOrReplaceTrigger(client, 'update_program_registrations_updated', 'program_registrations', 'update_updated_at_column');

    console.log('✅ Program registrations table ready');

    // Queries table
    await createOrUpdateTable(client, 'queries', `
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_queries_email', 'queries', '(email)');
    await createIndexIfNotExists(client, 'idx_queries_status', 'queries', '(status)');
    await createIndexIfNotExists(client, 'idx_queries_category', 'queries', '(category)');
    await createIndexIfNotExists(client, 'idx_queries_created', 'queries', '(created_at)');
    await createOrReplaceTrigger(client, 'update_queries_updated', 'queries', 'update_updated_at_column');

    console.log('✅ Queries table ready');

    // Quote Requests table
    await createOrUpdateTable(client, 'quote_requests', `
      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'accepted', 'rejected')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_quote_requests_email', 'quote_requests', '(email)');
    await createIndexIfNotExists(client, 'idx_quote_requests_status', 'quote_requests', '(status)');
    await createIndexIfNotExists(client, 'idx_quote_requests_service', 'quote_requests', '(service)');
    await createIndexIfNotExists(client, 'idx_quote_requests_created', 'quote_requests', '(created_at)');
    await createOrReplaceTrigger(client, 'update_quote_requests_updated', 'quote_requests', 'update_updated_at_column');

    console.log('✅ Quote requests table ready');

    // Resume Submissions table
    await createOrUpdateTable(client, 'resume_submissions', `
      CREATE TABLE IF NOT EXISTS resume_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        position VARCHAR(255),
        experience TEXT,
        resume_filename VARCHAR(255) NOT NULL,
        resume_data BYTEA NOT NULL,
        resume_mimetype VARCHAR(100),
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_resume_email', 'resume_submissions', '(email)');
    await createIndexIfNotExists(client, 'idx_resume_status', 'resume_submissions', '(status)');
    await createIndexIfNotExists(client, 'idx_resume_position', 'resume_submissions', '(position)');
    await createIndexIfNotExists(client, 'idx_resume_created', 'resume_submissions', '(created_at)');
    await createOrReplaceTrigger(client, 'update_resume_submissions_updated', 'resume_submissions', 'update_updated_at_column');

    console.log('✅ Resume submissions table ready');

    // R&D Applications table
    await createOrUpdateTable(client, 'rnd_applications', `
      CREATE TABLE IF NOT EXISTS rnd_applications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        project_id VARCHAR(100),
        project_title VARCHAR(500),
        qualification VARCHAR(255),
        institution VARCHAR(255),
        cgpa DECIMAL(3,2),
        experience TEXT,
        research_interests TEXT,
        why_join TEXT,
        resume_url TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_rnd_email', 'rnd_applications', '(email)');
    await createIndexIfNotExists(client, 'idx_rnd_status', 'rnd_applications', '(status)');
    await createIndexIfNotExists(client, 'idx_rnd_project_id', 'rnd_applications', '(project_id)');
    await createIndexIfNotExists(client, 'idx_rnd_created', 'rnd_applications', '(created_at)');
    await createOrReplaceTrigger(client, 'update_rnd_applications_updated', 'rnd_applications', 'update_updated_at_column');

    console.log('✅ R&D Applications table ready');

    // Robotics Enrollments table
    await createOrUpdateTable(client, 'robotics_enrollments', `
      CREATE TABLE IF NOT EXISTS robotics_enrollments (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        parent_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        student_class VARCHAR(50),
        school VARCHAR(255),
        age INTEGER,
        previous_experience TEXT,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_robotics_email', 'robotics_enrollments', '(email)');
    await createIndexIfNotExists(client, 'idx_robotics_status', 'robotics_enrollments', '(status)');
    await createIndexIfNotExists(client, 'idx_robotics_student_name', 'robotics_enrollments', '(student_name)');
    await createIndexIfNotExists(client, 'idx_robotics_created', 'robotics_enrollments', '(created_at)');
    await createOrReplaceTrigger(client, 'update_robotics_enrollments_updated', 'robotics_enrollments', 'update_updated_at_column');

    console.log('✅ Robotics Enrollments table ready');

    // School Partnerships table
    await createOrUpdateTable(client, 'school_partnerships', `
      CREATE TABLE IF NOT EXISTS school_partnerships (
        id SERIAL PRIMARY KEY,
        school_name VARCHAR(255) NOT NULL,
        school_address TEXT,
        contact_person VARCHAR(255),
        designation VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        student_count INTEGER,
        preferred_start_date DATE,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_discussion', 'partnered', 'declined')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await createIndexIfNotExists(client, 'idx_partnerships_email', 'school_partnerships', '(email)');
    await createIndexIfNotExists(client, 'idx_partnerships_status', 'school_partnerships', '(status)');
    await createIndexIfNotExists(client, 'idx_partnerships_school_name', 'school_partnerships', '(school_name)');
    await createIndexIfNotExists(client, 'idx_partnerships_created', 'school_partnerships', '(created_at)');
    await createOrReplaceTrigger(client, 'update_school_partnerships_updated', 'school_partnerships', 'update_updated_at_column');

    console.log('✅ School Partnerships table ready');

    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (endError) {
        console.error('Error closing client:', endError);
      }
    }
  }
};

module.exports = { initDatabase };