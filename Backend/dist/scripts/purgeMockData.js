"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Content_1 = require("../models/Content");
const VideoAnalysis_1 = require("../models/VideoAnalysis");
const Lead_1 = require("../models/Lead");
const mongodb_1 = require("../config/mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function purgeMockData() {
    try {
        await (0, mongodb_1.connectMongoDB)();
        console.log('Connected to MongoDB. Starting purge...');
        const videoRes = await VideoAnalysis_1.VideoAnalysis.deleteMany({});
        console.log(`- Deleted ${videoRes.deletedCount} video analyses.`);
        const contentRes = await Content_1.Content.deleteMany({});
        console.log(`- Deleted ${contentRes.deletedCount} content records.`);
        const leadRes = await Lead_1.Lead.deleteMany({});
        console.log(`- Deleted ${leadRes.deletedCount} leads.`);
        console.log('Purge completed. Database is now clean.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error purging data:', error);
        process.exit(1);
    }
}
purgeMockData();
//# sourceMappingURL=purgeMockData.js.map