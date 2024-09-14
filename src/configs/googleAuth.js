// import { google } from 'googleapis';
// import fs from 'fs';

// const credentials = JSON.parse(fs.readFileSync('src/secrets.json', 'utf8'));

// // Set up the Google Auth
// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// export default auth;

import { google } from 'googleapis';
import key from '../secrets.json' assert { type: 'json' };

export const SHEET_ID = '1GwVIMV-YEDt5MTvCZrL1bRYwyE3izIY3adB4VGKNXsg';

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });

