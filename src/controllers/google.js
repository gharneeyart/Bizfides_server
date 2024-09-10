import { appendToSheet } from "../helpers/googleSheet.js";
import { newsletterEmail, contactFormEmail } from "../utils/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config(); 

// Controller for handling contact form submissions
export const submitContactForms = async (req, res) => {
    const { name, email, subject, message } = req.body;
    const downloadLink = process.env.DOWNLOAD_URL

    try {
        const values = [[name, email,subject, message, new Date().toISOString()]];
        await appendToSheet('Sheet2!A:E', values); // Specify the sheet and range
        await contactFormEmail(email, name, message, subject, downloadLink);
        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error saving contact form data:', error);
        res.status(500).send('Error saving data');
    }
};

// Controller for handling newsletter subscriptions
export const subscribeNewsletter = async (req, res) => {
    const { name, email } = req.body;

    try {
        const values = [[name, email, new Date().toISOString()]]; // Format data correctly
        await appendToSheet('Sheet1!A:C', values); // Call appendToSheet with data
        await newsletterEmail(email, name);
        res.status(200).send('Subscription successful');
    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        res.status(500).send('Error subscribing');
    }
};
