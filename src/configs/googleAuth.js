import { google } from 'googleapis';
import key from '../secrets.json' assert { type: 'json' };

export const SHEET_ID = '1GwVIMV-YEDt5MTvCZrL1bRYwyE3izIY3adB4VGKNXsg';

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

export const sheets = google.sheets({ version: 'v4', auth: client });
