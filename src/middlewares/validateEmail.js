const emailRegex = /^\S+@\S+\.\S+$/;

export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (email && emailRegex.test(email)) {
        next(); // Proceed if email is valid
    } else {
        res.status(400).json({ message: 'Invalid email format' });
    }
};
