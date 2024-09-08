import express from 'express';
import { subscribe, submitContactForm } from '../controllers/subscribe.js';
import { validateEmail } from '../middlewares/validateEmail.js';

const router = express.Router();

router.post('/subscribe', validateEmail, subscribe);
router.post('/contact', submitContactForm);

export default router;