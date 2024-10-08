import mongoose from "mongoose";

async function connectMongoDB(url){
    return await mongoose.connect(`${url}`);
}

export default connectMongoDB;