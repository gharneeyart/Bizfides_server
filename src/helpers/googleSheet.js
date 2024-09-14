// import { SHEET_ID, sheets } from '../configs/googleAuth.js';


// // Function to append data to the Google Sheet
// export const appendToSheet = async (range, values) => {
//     try {
//         const response = await sheets.spreadsheets.values.append({
//             spreadsheetId: SHEET_ID,
//             range: range, // Use the passed range
//             insertDataOption: 'INSERT_ROWS',
//             valueInputOption: 'RAW',
//             requestBody: {
//                 values: values, // Use the passed values
//             },
//         });

//         console.log('Data successfully appended:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error appending data to Google Sheets:', error);
//         throw new Error('Google Sheets API error: ' + error.message);
//     }
// };

import { google } from 'googleapis';
import auth from '../configs/googleAuth.js';

const sheets = google.sheets({ version: 'v4', auth });

// Function to append data to the Google Sheet
export const appendToSheet = async (range, values) => {
    const SPREADSHEET_ID = '1GwVIMV-YEDt5MTvCZrL1bRYwyE3izIY3adB4VGKNXsg';

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range, // Sheet and range (e.g., 'Sheet1!A:D')
            valueInputOption: 'RAW',
            resource: { values },
        });
    } catch (error) {
        throw new Error('Google Sheets API error: ' + error.message);
    }
};

