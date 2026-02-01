// some of this is way too complicated for me, got some help from the internet. Haven't used artificial intelligence yet.
import express from 'express';
import CatBreed from '../models/CatBreed.js';

const catbreedsRouter = express.Router();

// GET /catbreeds (list)
catbreedsRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = req.query.limit ? Math.max(1, parseInt(req.query.limit)) : null;
    const total = await CatBreed.countDocuments();
    let query = CatBreed.find();
    if (limit) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const catbreeds = await query;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const items = catbreeds.map(c => ({
      id: c._id,
      name: c.name,
      origin: c.origin,
      _links: {
        self: { href: `${baseUrl}/${c._id}` }
      }
    }));
    const hasNext = limit && (page * limit) < total;
    const hasPrev = page > 1;
    const links = {
      self: { href: limit ? `${baseUrl}?page=${page}&limit=${limit}` : baseUrl },
      collection: { href: baseUrl }
    };
    if (hasNext) links.next = { href: `${baseUrl}?page=${page + 1}&limit=${limit}` };
    if (hasPrev) links.prev = { href: `${baseUrl}?page=${page - 1}&limit=${limit}` };
    res.json({
      items,
      pagination: {
        total,
        page,
        limit
      },
      _links: links
    });
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /catbreeds
catbreedsRouter.post('/', async (req, res) => {
  try {
    const { name, origin, temperament, description } = req.body;
    if (!name || !origin || !temperament) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const catbreed = new CatBreed({ name, origin, temperament, description });
    await catbreed.save();
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    res.status(201).json({
      id: catbreed._id,
      name,
      origin,
      _links: {
        self: { href: `${baseUrl}/${catbreed._id}` }
      }
    });
  } catch (error) {
    console.error('Error creating cat breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /catbreeds/:id
catbreedsRouter.get('/:id', async (req, res) => {
  try {
    const catbreed = await CatBreed.findById(req.params.id);
    if (!catbreed) return res.status(404).json({ error: 'Cat breed not found' });
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    res.json({
      id: catbreed._id,
      name: catbreed.name,
      origin: catbreed.origin,
      temperament: catbreed.temperament,
      description: catbreed.description,
      _links: {
        self: { href: `${baseUrl}/${catbreed._id}` },
        collection: { href: baseUrl }
      }
    });
  } catch (error) {
    console.error('Error fetching cat breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /catbreeds/:id
catbreedsRouter.put('/:id', async (req, res) => {
  try {
    const { name, origin, temperament, description } = req.body;
    if (!name || !origin || !temperament) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const catbreed = await CatBreed.findByIdAndUpdate(req.params.id, { name, origin, temperament, description }, { new: true });
    if (!catbreed) return res.status(404).json({ error: 'Cat breed not found' });
    res.status(200).json({
      id: catbreed._id,
      name: catbreed.name,
      origin: catbreed.origin,
      temperament: catbreed.temperament,
      description: catbreed.description,
      _links: {
        self: { href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${catbreed._id}` },
        collection: { href: `${req.protocol}://${req.get('host')}${req.baseUrl}` }
      }
    });
  } catch (error) {
    console.error('Error updating cat breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /catbreeds/:id
catbreedsRouter.delete('/:id', async (req, res) => {
  try {
    const catbreed = await CatBreed.findByIdAndDelete(req.params.id);
    if (!catbreed) return res.status(404).json({ error: 'Cat breed not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cat breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OPTIONS /catbreeds
catbreedsRouter.options('/', (req, res) => {
  res.set('Allow', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.status(204).send();
});

// OPTIONS /catbreeds/:id
catbreedsRouter.options('/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.status(204).send();
});

// Catch-all for unsupported methods on collection
catbreedsRouter.use('/', (req, res) => {
  res.set('Allow', 'GET, POST, OPTIONS');
  res.status(405).send();
});

// Catch-all for unsupported methods on detail
catbreedsRouter.use('/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, OPTIONS');
  res.status(405).send();
});

export default catbreedsRouter;