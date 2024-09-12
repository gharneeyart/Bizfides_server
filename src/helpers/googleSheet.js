import { SHEET_ID, sheets } from '../configs/googleAuth.js';


// Function to append data to the Google Sheet
export const appendToSheet = async (range, values) => {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: range, // Use the passed range
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            requestBody: {
                values: values, // Use the passed values
            },
        });

        console.log('Data successfully appended:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
        throw new Error('Google Sheets API error: ' + error.message);
    }
};
