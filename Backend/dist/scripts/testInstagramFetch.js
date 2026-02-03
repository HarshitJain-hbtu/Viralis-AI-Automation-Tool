"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platformApi_1 = require("../utils/platformApi");
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("../config/env");
dotenv_1.default.config();
async function testModernFlow() {
    const TEST_SHORTCODE = 'DUDevIVkvcF'; // A valid IG shortcode
    const ACCOUNT_ID = '17841476512200156';
    console.log('--- STARTING MODERN INSTAGRAM INTEGRATION TEST ---');
    if (!env_1.env.INSTAGRAM_ACCESS_TOKEN) {
        console.error('❌ INSTAGRAM_ACCESS_TOKEN not set in .env');
        process.exit(1);
    }
    if (!env_1.env.FB_APP_ID || !env_1.env.FB_APP_SECRET) {
        console.warn('⚠️ FB_APP_ID or FB_APP_SECRET not set. Granular discovery will be skipped.');
    }
    try {
        console.log('\n--- Part 1: Test fetchInstagramMediaList (Direct ID) ---');
        const mediaList = await (0, platformApi_1.fetchInstagramMediaList)(ACCOUNT_ID, 2);
        if (mediaList && mediaList.length > 0) {
            console.log(`✅ Success: Found ${mediaList.length} media items.`);
            console.log('First item ID:', mediaList[0].id);
        }
        else {
            console.warn('⚠️ No media items found.');
        }
        console.log('\n--- Part 2: Test Automatic Discovery Flow via fetchInstagramStats ---');
        console.log(`Fetching stats for shortcode: ${TEST_SHORTCODE}...`);
        console.log('(This will trigger getInstagramBusinessId internally)');
        const stats = await (0, platformApi_1.fetchInstagramStats)(TEST_SHORTCODE);
        if (Object.keys(stats).length > 0) {
            console.log('\n✅ SUCCESS: Automatic Discovery Work!');
            console.log('Stats Result:', JSON.stringify(stats, null, 2));
        }
        else {
            console.warn('\n⚠️ No stats found. discovery might have failed or the shortcode is invalid for this account.');
        }
    }
    catch (error) {
        console.error('\n❌ Test failed:', error);
    }
    finally {
        console.log('\n--- TEST COMPLETED ---');
        process.exit(0);
    }
}
testModernFlow();
//# sourceMappingURL=testInstagramFetch.js.map