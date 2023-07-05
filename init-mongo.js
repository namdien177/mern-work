// Pre-create the collection from the ENV
const defaultCollection = process.env['MONGO_DATABASE'] ?? 'sample';

db.createCollection(defaultCollection);
