import { Content } from '../models/Content';
import { VideoAnalysis } from '../models/VideoAnalysis';
import { Lead } from '../models/Lead';
import { connectMongoDB } from '../config/mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function purgeMockData() {
    try {
        await connectMongoDB();
        console.log('Connected to MongoDB. Starting purge...');

        const videoRes = await VideoAnalysis.deleteMany({});
        console.log(`- Deleted ${videoRes.deletedCount} video analyses.`);

        const contentRes = await Content.deleteMany({});
        console.log(`- Deleted ${contentRes.deletedCount} content records.`);

        const leadRes = await Lead.deleteMany({});
        console.log(`- Deleted ${leadRes.deletedCount} leads.`);

        console.log('Purge completed. Database is now clean.');
        process.exit(0);
    } catch (error) {
        console.error('Error purging data:', error);
        process.exit(1);
    }
}

purgeMockData();
