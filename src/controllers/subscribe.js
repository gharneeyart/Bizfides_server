import { createWriter, writeToCsv } from '../helpers/csvWriters.js';
import { newsletterEmail, contactFormEmail } from '../utils/sendEmail.js';


const contactCsvWriter = createWriter('contact_submissions.csv', [
    { id: 'name', title: 'NAME' },
    { id: 'email', title: 'EMAIL' },
    { id: 'subject', title: 'SUBJECT'},
    { id: 'message', title: 'MESSAGE' },
    { id: 'submittedAt', title: 'SUBMITTED_AT' },
]);

export const submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const contactData = [{
            name,
            email,
            subject,
            message,
            submittedAt: new Date().toISOString()
        }];
        await contactFormEmail(email, name, message, subject)
        await writeToCsv(contactCsvWriter, contactData);
        res.status(200).json({ message: "Your message has been sent!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save contact data" });
    }
};

const newsletterCsvWriter = createWriter('subscribers.csv', [
    { id: 'name', title: 'NAME'},
    { id: 'email', title: 'EMAIL' },
    { id: 'subscribedAt', title: 'SUBSCRIBED_AT' },
]);

export const subscribe = async (req, res) => {
    const { name, email } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const subscriberData = [{
            name,
            email,
            subscribedAt: new Date().toISOString()
        }];
        await newsletterEmail(email, name);
        await writeToCsv(newsletterCsvWriter, subscriberData);
        res.status(200).json({ message: "Subscription successful!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save subscriber data" });
    }
};

