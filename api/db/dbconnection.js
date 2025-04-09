import mongoose from 'mongoose';


// Database Connection 
async function connectDB() {
    try {
        await mongoose.connect( process.env.MONGO);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
    }
}

export default connectDB;


