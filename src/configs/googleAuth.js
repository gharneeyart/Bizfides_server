import { google } from 'googleapis';


import dotenv from 'dotenv';

dotenv.config(); 

const key = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') // Handle multiline keys
};

export const SHEET_ID = process.env.SHEET_IDS;

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });
