import mongoose from "mongoose";

export const connectDB= async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("Connected to MongoDB succesfully");
    }
    catch(error){
        console.log("Connection failed", error);
    }
}