import { google } from 'googleapis';


import dotenv from 'dotenv';

dotenv.config(); 

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
console.log("Before Formatting", clientEmail, privateKey);

// Replace escaped newline characters in private key
const formattedPrivateKey = privateKey.replace(/\\n/g, '\n'); // Handle multiline keys
console.log("After Formatting", formattedPrivateKey);

export const SHEET_ID = process.env.SHEET_IDS;

const client = new google.auth.JWT(clientEmail, null, formattedPrivateKey, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });
