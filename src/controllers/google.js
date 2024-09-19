import { appendToSheet } from "../helpers/googleSheet.js";
import { newsletterEmail, contactFormEmail, contactEmail } from "../utils/sendEmail.js";
import { emailExists} from "../helpers/googleSheet.js";
import dotenv from 'dotenv';

dotenv.config(); 

// Controller for handling contact form submissions
export const submitContactForms = async (req, res) => {
    const { name, email, subject, message } = req.body;
    const downloadLink = process.env.DOWNLOAD_URL

    try {
         // Append the new subscriber if email doesn't exist
        const values = [[name, email,subject, message, new Date().toISOString()]];
        await appendToSheet('Sheet2!A:E', values); // Specify the sheet and range
        await contactFormEmail(email, name, message, subject, downloadLink);
        await contactEmail(email, name)
        res.status(200).json({success: true, message: 'Form submitted successfully'});
    } catch (error) {
        console.error('Error saving contact form data:', error);
        res.status(500).json({success: false, message: error.message});
    }
};

// Controller for handling newsletter subscriptions
export const subscribeNewsletter = async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if the email already exists
        const exists = await emailExists(email);
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });

        }
        const values = [[name, email, new Date().toISOString()]]; // Format data correctly
        await appendToSheet('Sheet1!A:C', values); // Call appendToSheet with data
        await newsletterEmail(email, name);
        res.status(200).json({success: true, message: 'Subscription successful'});
    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        res.status(500).json({success: false, message: error.message});
    }
};


