// Function to generate a random token with letters and numbers
export const generateRandomToken = (length = 20) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

// export const resendToken = async (user) => {
//     const newToken = generateRandomToken();
//     user.verificationToken = newToken;
//     user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
//     await user.save();

//     // Send the verification email with the new token
//     const domain = process.env.FRONTEND_URL;
//     const verificationUrl = `${domain}/verify-email/${newToken}`;
//     await sendVerifyEmail(user.email, user.firstName, verificationUrl);
    
//     return newToken;
// };