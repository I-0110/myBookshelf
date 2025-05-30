import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api/index.js'; 

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
app.use('/api', apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler: for any request that doesn't match an API route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;

