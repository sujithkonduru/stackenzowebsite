# Fix Quote API Error

## Status: ✅ COMPLETED

**Problem:** TypeError: (intermediate value) is not iterable in quoteModel.create

**Root Cause:** Incorrect pg query destructuring `[rows] = await pool.query()` - pg returns object, not array.

**Plan Steps:**
- [x] Create this TODO
- [x] Fix backend/src/models/quoteModel.js (destructuring + standardize placeholders to $1/$2)
- [x] Test POST /api/quotes
- [x] search_files for other models with same pattern
- [x] Fix all models
- [x] Full test
- [x] Close issue

**Additional:** Standardize all queries to pg $1, $2... placeholders (some use ? which is mysql).

**Test your fix:**
Restart backend server (node server.js), then:

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "company": "Test Corp",
    "service": "Web Development",
    "message": "Test quote request"
  }'
```

Expected: 201 {"success":true,"message":"Quote request submitted successfully","data":{"id":1}}

Check server logs for no errors.
