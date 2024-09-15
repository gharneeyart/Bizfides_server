import express from 'express';
import validateForm from '../middlewares/validateForm.js';
import { submitContactForms, subscribeNewsletter, unsubscribe } from '../controllers/google.js';

const router = express.Router();

router.post('/gsubscribe', validateForm, subscribeNewsletter);
router.post('/gcontact', validateForm, submitContactForms);
router.post('/unsubscribe', unsubscribe);

export default router;