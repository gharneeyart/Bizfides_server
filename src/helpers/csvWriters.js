import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a CSV writer for a given file and headers
export const createWriter = (filePath, headers) => {
    return createObjectCsvWriter({
        path: path.join(__dirname, '../data', filePath), // Ensure you're writing to the correct folder
        header: headers,
        append: true
    });
};

// Function to write data to the specified CSV file
export const writeToCsv = async (csvWriter, data) => {
    try {
        await csvWriter.writeRecords(data); // This is the async call to write the CSV data
    } catch (error) {
        console.error("Failed to write to CSV file:", error);
        throw new Error("Failed to write to CSV");
    }
};