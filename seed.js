import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import CatBreed from './models/CatBreed.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/catbreedsdb')
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seed() {
  // Clear existing cat breeds
  await CatBreed.deleteMany({});
  
  // Real cats breeds, this part got screwed up at one point (I put a space where i shouldn't have and somehow the whole site froze)
  const realBreeds = [
    { name: 'Siamese', origin: 'Thailand', temperament: 'Sociaal, vocaal, aanhankelijk en dominant. Ze praten veel en eisen aandacht.' },
    { name: 'Bengalese', origin: 'Verenigde staten', temperament: 'Actief, speels, intelligent en nieuwsgierig. Ze houden van aandacht en zijn vaak luidruchtig.' },
    { name: 'Maine Coon', origin: 'Verenigde staten', temperament: 'Vriendelijk, speels, onafhankelijk en aanpasbaar. Ze zijn groot en zachtaardig.' },
    { name: 'Ragdoll', origin: 'Verenigde staten', temperament: `Gemoedelijk, relaxed, aanhankelijk en tolerant. Ze 'verslappen' als ze worden opgepakt.` },
    { name: 'Burmees', origin: 'Myanmar', temperament: 'Speels, sociaal, intelligent en extravert. Ze zijn energiek en houden van interactie' },
    { name: 'European Shorthair', origin: 'Nederland', temperament: 'Vriendelijk, onafhankelijk, aanpasbaar en nuchter. Ze zijn niet veeleisend.' }
  ];
  
  for (const breed of realBreeds) {
    const catbreed = new CatBreed({
      name: breed.name,
      origin: breed.origin,
      temperament: breed.temperament,
      description: faker.lorem.sentences(2) // didn't wanna make a description for every cat
    });
    await catbreed.save();
  }
  console.log('Seeded 6 cat breeds');
  mongoose.connection.close();
}

seed();