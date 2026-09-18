const mongoose =require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully to database');
        
    } catch(error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}
dbConnection()

module.exports = dbConnection;