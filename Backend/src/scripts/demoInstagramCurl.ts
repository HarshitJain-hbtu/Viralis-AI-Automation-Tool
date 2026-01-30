import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Equivalent of the curl command:
 * curl -G https://graph.facebook.com/17841476512200156/media \
 *   --data-urlencode "fields=id,caption,media_type,media_url,like_count,comments_count" \
 *   --data-urlencode "access_token=..."
 */
async function fetchInstagramMedia(instagramAccountId: string, accessToken: string) {
    const url = `https://graph.facebook.com/${instagramAccountId}/media`;

    try {
        const response = await axios.get(url, {
            params: {
                fields: 'id,caption,media_type,media_url,like_count,comments_count',
                access_token: accessToken
            }
        });

        console.log('--- Response Data ---');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error: any) {
        console.error('--- Error Fetching Media ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
    }
}

// Example usage with the values from your curl command
const ACCOUNT_ID = '17841476512200156';
const ACCESS_TOKEN = 'EAAaTV1EXvGYBQlZB4KRpZCs12pWw56RC3Egv9cCRAw4Orfa6DgHY6lduZAHkO3nGkJpZAF0FoKUH6y7Hj4gER9KTaFxrWZBmO5hQOr5JeeZB9nZCMus4PdnWvJgG84pHeUS0zcoWagNmrN96DX31lgZBdXg5qan1tJzBD4LMbZAQdpOUdVD72Aip9ZCZB2KS24q1ry5AyIB';

fetchInstagramMedia(ACCOUNT_ID, ACCESS_TOKEN);
