import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); 

// Configure the Nodemailer transporter using environment variables for email authentication
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Set up Handlebars with Nodemailer
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve('/views/'), 
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'), 
  extName: ".hbs",
};

transporter.use('compile', hbs(handlebarOptions));


export const sendVerifyEmail = (email, firstName, verifyCode) => {
  const mailOptions = {
    from: `"Bizfides" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification',
    template: 'confirmEmailTemplate', // Name of the .hbs file without the extension
    context: {
      firstName,
      verifyCode, // Pass dynamic values to the template
    },
  };
  return transporter.sendMail(mailOptions);
};

export const sendResetEmail = (email, firstName, resetURL) => {
  const mailOptions = {
    from: `"Bizfides" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    template: 'resetPasswordTemplate',
    context: {
      firstName,
      resetURL,
    },
  };

  return transporter.sendMail(mailOptions);
};

export const WelcomeEmail = (email, firstName) => {
  const mailOptions = {
    from: `"Bizfides" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Bizfides!',
    template: 'welcomeEmailTemplate', 
    context: {
      firstName,
    },
  };

  return transporter.sendMail(mailOptions);
};
export const newsletterEmail = async (email, name) => {
   

  const mailOptions = {
      from: `"Bizfides" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bizfides Newsletter',
      template: 'newletterTemplate',
      context: { name},
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Newsletter email sent:', info.response);
  } catch (error) {
      console.error('Error sending newsletter email:', error);
  }
};

export const contactEmail = async (email, name) => {
  const mailOptions = {
      from: `"Bizfides" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bizfides Contact Information',
      template: 'contactEmailTemplate',
      context: { name },
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact email sent:', info.response);
  } catch (error) {
      console.error('Error sending contact email:', error);
  }
};

export const contactFormEmail = async (email, name, message, subject, downloadLink) => {
  const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form Message from ${name}`,
      template: 'contactFormTemplate',
      context: {
          name,
          email,
          subject,
          message,
          downloadLink,
      },
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact form email sent:', info.response);
  } catch (error) {
      console.error('Error sending contact form email:', error);
  }
};