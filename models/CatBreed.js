const mongoose = require('mongoose');

const catBreedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true },
  temperament: { type: String, required: true },
  description: String
});

module.exports = mongoose.model('CatBreed', catBreedSchema);