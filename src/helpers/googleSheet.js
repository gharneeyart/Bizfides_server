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

// Function to check if email already exists in Google Sheets
export const emailExists = async (email) => {
    
    const RANGE = 'Sheet1!A:C'; // Adjust this based on where your data is stored

    try {
        // Get all values from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values || [];

        // Check if the email exists
        const emailExists = rows.some(row => row[1] === email);

        return emailExists;
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        throw new Error('Error fetching data from Google Sheets');
    }
};

