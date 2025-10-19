import mongoose from "mongoose";
import dotenv from 'dotenv';
// const mongoose = require('mongoose');
dotenv.config();

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log(process.env.MONGO_URI);
        console.log(process.env.PORT);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;