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

export const unsubscribeNewsletter = async (email) => {
    const RANGE = 'Sheet1!A:C'; // Full range including all columns

    try {
        // Get all values from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values || [];
        
        // Log the rows for debugging
        console.log('Rows in the sheet:', JSON.stringify(rows, null, 2));

        // Assume the first row is the header
        const headers = rows[0];
        const emailColumnIndex = headers.indexOf('email'); // Find the column index for 'email'

        if (emailColumnIndex === -1) {
            throw new Error('Email column not found in the sheet');
        }

        // Filter out the row with the given email, skipping the header row
        const updatedRows = rows.filter((row, index) => {
            if (index === 0) {
                return true; // Keep the header row
            }
            // Compare the email in the email column
            return row[emailColumnIndex] && row[emailColumnIndex] !== email;
        });

        // Check if any rows were removed
        if (rows.length === updatedRows.length) {
            // If no rows were removed, the email was not found
            return { success: false, message: 'Email not found' };
        }

        // Clear the existing data in the range
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });

        // Write the updated rows back to the sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            valueInputOption: 'RAW',
            resource: {
                values: updatedRows,
            },
        });

        return { success: true, message: 'Unsubscribed successfully' };
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
        throw new Error('Error unsubscribing from the newsletter');
    }
};
