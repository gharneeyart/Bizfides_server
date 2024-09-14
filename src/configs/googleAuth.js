// import { google } from 'googleapis';
// import fs from 'fs';

// const credentials = JSON.parse(fs.readFileSync('src/secrets.json', 'utf8'));

// // Set up the Google Auth
// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// export default auth;

// import { google } from 'googleapis';
// import key from '../secrets.json' assert { type: 'json' };

// export const SHEET_ID = '1GwVIMV-YEDt5MTvCZrL1bRYwyE3izIY3adB4VGKNXsg';

// const client = new google.auth.JWT(key.client_email, null, key.private_key, [
//   'https://www.googleapis.com/auth/spreadsheets',
// ]);

// export const sheets = google.sheets({ version: 'v4', auth: client });

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

// Decode the base64 encoded secrets.json from the environment variable
const secretsBase64 = process.env.GOOGLE_SECRETS_BASE64;

if (!secretsBase64) {
    throw new Error('Missing GOOGLE_SECRETS_BASE64 environment variable');
}

const secrets = JSON.parse(Buffer.from(secretsBase64, 'base64').toString('utf8'));

// Access the credentials from the decoded JSON
const clientEmail = secrets.client_email;
const privateKey = secrets.private_key.replace(/\\n/g, '\n'); // Replace escaped newlines

// Set up the Google API client
import { google } from 'googleapis';

export const SHEET_ID = '1GwVIMV-YEDt5MTvCZrL1bRYwyE3izIY3adB4VGKNXsg';

const client = new google.auth.JWT(clientEmail, null, privateKey, [
    'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });


