import fs from 'fs';
import csvParser from 'csv-parser';
import path from 'path';

// Function to read the subscribers.csv file
export const readSubscribeFile = () => {
    const csvFilePath = path.resolve('src/data/subscribers.csv');
    const subscribers = [];

    return new Promise((resolve, reject) => {
        // Check if the CSV file exists
        if (!fs.existsSync(csvFilePath)) {
            return reject(new Error('CSV file does not exist.'));
        }

        // Read and parse the CSV file
        fs.createReadStream(csvFilePath)
        
            .pipe(csvParser({
                headers: ['name', 'email', 'subscribedAt'],
                skipLines: 1 
            }))
            .on('data', (row) => {
                subscribers.push(row);
            })
            .on('end', () => {
                resolve(subscribers);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};
// Function to read the subscribers.csv file
export const readContactFile = () => {
    const csvFilePath = path.resolve('src/data/contact_submissions.csv');
    const contactforms = [];

    return new Promise((resolve, reject) => {
        // Check if the CSV file exists
        if (!fs.existsSync(csvFilePath)) {
            return reject(new Error('CSV file does not exist.'));
        }

        // Read and parse the CSV file
        fs.createReadStream(csvFilePath)
        
            .pipe(csvParser({
                headers: ['name', 'email', 'subject', 'message'],
                skipLines: 1 
            }))
            .on('data', (row) => {
                contactforms.push(row);
            })
            .on('end', () => {
                resolve(contactforms);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};
