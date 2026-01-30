import mongoose from 'mongoose';

const catBreedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true },
  temperament: { type: String, required: true },
  description: String
});

const CatBreed = mongoose.model('CatBreed', catBreedSchema);

export default CatBreed;