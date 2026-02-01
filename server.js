import express from 'express';
import mongoose from 'mongoose';
import catbreedsRouter from './routes/catbreeds.js';

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/catbreedsdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware en CORS
app.use((req, res, next) => {
  /**  
   * Ik snap nogsteeds niks van CORS.
   * De pseudocode die je hieronder ziet is omdat ik het anders niet meer zou weten. 
  */
  res.header("Access-Control-Allow-Origin", "*");
  // Deze header zegt welke websites toegang mogen hebben tot de API. Die "*" betekent iedereen.

  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.headers.accept?.includes("application/json")) {
    return res.status(406).send({ error: "Not Acceptable. Please accept the application/json header." });
  } else {
    res.header("Content-Type", "application/json");
    res.header("Accept", "application/json");
  }

  next();
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/catbreeds', catbreedsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});