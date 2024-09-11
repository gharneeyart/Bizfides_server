import express from 'express';
import validateForm from '../middlewares/validateForm.js';
import { submitContactForms, subscribeNewsletter } from '../controllers/google.js';

const router = express.Router();

router.post('/gsubscribe', validateForm, subscribeNewsletter);
router.post('/gcontact', validateForm, submitContactForms);

export default router;