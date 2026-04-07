# Fix POST /api/enrollments 500 Error

## Steps:
- [ ] Update backend/src/config/initDatabase.js: Add missing `update_updated_at_column()` function before triggers
- [ ] Update backend/src/config/initDatabase.js: Add per-query try/catch logging
- [ ] Update server.js: Import and call initDatabase() on startup before routes
- [ ] Update TODO_INITDATABASE.md: Mark "Test execution" complete
- [ ] Restart server: `node server.js`
- [ ] Test POST /api/enrollments from frontend
- [ ] Verify DB table exists and INSERT works

Current status: Starting implementation...
