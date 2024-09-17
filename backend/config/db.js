const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
            await mongoose.connect("mongodb://localhost:27017/luckyslot");
            console.log('MongoDB connected');
    } catch (error) {
        if (error.message.includes('database exists')) {
            console.log('Database already exists.');
        } else {
            console.error('Error connecting to MongoDB:', error.message);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
