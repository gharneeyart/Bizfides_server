import { google } from 'googleapis';
import key from '../secrets.json' assert { type: 'json' };

import dotenv from 'dotenv';

dotenv.config(); 

export const SHEET_ID = process.env.SHEET_IDS;

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });
