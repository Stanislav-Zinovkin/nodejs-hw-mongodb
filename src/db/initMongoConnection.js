import mongoose from "mongoose";

export async function initMongoConnection() {
    const {
        MONGODB_USER,
        MONGODB_PASSWORD,
        MONGODB_URL,
        MONGODB_DB,
    } = process.env;

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
        throw new Error ('Missing env variables');
    }

    const mongoUrl = `mongodb+srv://${encodeURLComponent(MONGODB_USER)}:${encodeURLComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(mongoUrl);
        console.log('Connection success');
    } catch (error){
        console.log('Error connecting', error);
        process.exit(1);
    }
}