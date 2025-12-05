const mongoose = require('mongoose');

mongoose.connect('your-mongodb-connection-string')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Delete users with null username
    const result = await mongoose.connection.db.collection('users').deleteMany({ username: null });
    console.log(`Deleted ${result.deletedCount} users with null username`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });