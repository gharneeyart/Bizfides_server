import express from 'express';
import { subscribe, submitContactForm, getSubscribers, getContactForms } from '../controllers/subscribe.js';
import { validateEmail } from '../middlewares/validateEmail.js';

const router = express.Router();

router.post('/subscribe', validateEmail, subscribe);
router.post('/contact', submitContactForm);
router.get('/subscribers', getSubscribers);
router.get('/contactforms', getContactForms);

export default router;