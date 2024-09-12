import { google } from 'googleapis';


import dotenv from 'dotenv';

dotenv.config(); 

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

// Replace escaped newline characters in private key
const formattedPrivateKey = privateKey.replace(/\\n/g, '\n'); // Handle multiline keys

export const SHEETID = process.env.SHEET_ID;

const client = new google.auth.JWT(clientEmail, null, formattedPrivateKey, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });
