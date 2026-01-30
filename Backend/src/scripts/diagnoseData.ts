import mongoose from 'mongoose';
import { connectMongoDB } from '../config/mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function diagnoseData() {
    try {
        await connectMongoDB();
        const db = mongoose.connection.db;
        if (!db) throw new Error('DB not connected');

        console.log('--- DIAGNOSTIC REPORT ---');

        const businesses = await db.collection('businesses').find().toArray();
        console.log(`\nBusinesses found: ${businesses.length}`);
        businesses.forEach(b => console.log(`- ${b.name} (${b._id})`));

        const users = await db.collection('users').find().toArray();
        console.log(`\nUsers found: ${users.length}`);
        users.forEach(u => console.log(`- ${u.email} (Business ID: ${u.businessId})`));

        const analysisCount = await db.collection('videoanalyses').countDocuments();
        console.log(`\nTotal Video Analyses: ${analysisCount}`);

        if (analysisCount > 0) {
            const sampleAnalyses = await db.collection('videoanalyses').find().limit(5).toArray();
            console.log('Sample Analyses Business IDs:');
            sampleAnalyses.forEach(a => console.log(`- ${a.businessId}`));
        }

        const leadCount = await db.collection('leads').countDocuments();
        console.log(`\nTotal Leads: ${leadCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Error during diagnosis:', error);
        process.exit(1);
    }
}

diagnoseData();
