import 'dotenv/config';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

app.listen(PORT, () => {
  console.log(`[Backend] Sree Collections API server running on http://localhost:${PORT}`);
});
