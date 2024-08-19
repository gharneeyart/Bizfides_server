 # Bizfides Server
 This is a Node.js backend application using Express, MongoDB, and Nodemailer. The project implements basic authentication features such as signup, login, logout, forgot-password, reset-password, and email verification.
 ## Table of Contents
 - Introduction
 - Features
 - Technologies Used
 - Installation
 - Contribution
 - Configuration
 - Folder Structure
## Introduction
This project provides a robust backend system for user authentication and management. It includes essential functionalities like signup, login, email verification, password reset, and logout. The project is built with scalability and security in mind, leveraging modern technologies to ensure a reliable and efficient service.
## Features
- User Signup: Allows new users to create an account.
- User Login: Enables users to log into the system.
- User Logout: Safely logs users out of the system.
- Email Verification: Confirms the user's email address.
- Forgot Password: Sends a password reset link to the user's email.
- Reset Password: Allows users to reset their password using the link sent to their email.
## Technologies used
- Node.js: JavaScript runtime for building server-side applications.
- Express: Web framework for Node.js used to create the RESTful API.
- MongoDB: NoSQL database for storing user data.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
- Nodemailer: Module for sending emails, used for email verification and password recovery.
- JWT (JSON Web Tokens): Used for securely transmitting information between parties as a JSON object.
- bcrypt: For hashing passwords before storing them in the database.
- cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- dotenv: For managing environment variables securely.
## Installation
### 1. Clone the repository
  ```sh
git clone https://github.com/gharneeyart/Bizfides_server.git
cd Bizfides_server

```
### 2. Install dependencies
```sh
npm install
```
### 3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```sh
PORT=your-port-number
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
EMAIL_SERVICE=your-email-service
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
```
### 4. Start the development server:
```sh
npm start
```
## Contributon
### 1. Create a new branch with a descriptive name:
```sh
git checkout -b feature/your-feature-name
```
### 2. Make your changes and commit them:
```sh
git commit -m 'Add feature'
```
### 3. Push your changes to the branch:
```sh
git push origin feature/your-feature-name
```
### 4. Open a pull request and describe your changes:
Compare and make pull request to the development branch
## Configuration
- MongoDB: This project uses MongoDB as the database. You can configure the connection string in the `.env` file under `MONGODB_URI`.
- Nodemailer: For email functionality, this project uses Nodemailer. Configure your email service and credentials in the `.env` file.
## Folder Structure
```sh
├── controllers     # Handles the logic for each route
├── routes          # Defines the application routes
├── models          # Mongoose models for MongoDB
├── helpers         # Helper functions for various tasks
├── utils           # Utility functions
├── configs         # Configuration files
├── index.js        # Entry point of the application
└── package.json    # Project dependencies and scripts
```


