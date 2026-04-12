import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongod = null;
export const connectDB = async () => {
    let uri = process.env.MONGO_URI;
    if (uri) {
        try {
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        }
        catch (error) {
            console.error(`Failed to connect to provided MONGO_URI: ${error.message}`);
            console.log('Falling back to in-memory MongoDB...');
        }
    }
    try {
        console.log('Starting in-memory MongoDB...');
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error starting in-memory MongoDB: ${error.message}`);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map