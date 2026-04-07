const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: './backend/.env' });

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const contactRoutes = require('./backend/src/routes/contactRoutes');
const enrollmentRoutes = require('./backend/src/routes/enrollmentRoutes');
const jobRoutes = require('./backend/src/routes/jobRoutes');
const newsletterRoutes = require('./backend/src/routes/newsletterRoutes');
const resumeRoutes = require('./backend/src/routes/resumeRoutes');
const quoteRoutes = require('./backend/src/routes/quoteRoutes');
const rndApplicationRoutes = require('./backend/src/routes/rndApplicationRoutes');
const programRoutes = require('./backend/src/routes/programRoutes');
const roboticsEnrollmentRoutes = require('./backend/src/routes/roboticsEnrollmentRoutes');
const schoolPartnershipRoutes = require('./backend/src/routes/schoolPartnershipRoutes');
const marketingAuditRoutes = require('./backend/src/routes/marketingAudit');
const queryRoutes = require('./backend/src/routes/queryRoutes');

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/rnd-applications', rndApplicationRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/robotics-enrollments', roboticsEnrollmentRoutes);
app.use('/api/school-partnerships', schoolPartnershipRoutes);
app.use('/api/marketing-audit', marketingAuditRoutes);
app.use('/api/queries', queryRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// Error handling
const { initDatabase } = require('./backend/src/config/initDatabase');
const { testConnection } = require('./backend/src/config/database');
const { errorHandler, notFound } = require('./backend/src/middleware/errorHandler');

// Initialize database first
const startServer = async () => {
  try {
    console.log('🔄 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized');
    
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
