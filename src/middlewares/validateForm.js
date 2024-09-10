const emailRegex = /^\S+@\S+\.\S+$/;

const validateForm = (req, res, next) => {
    const { email } = req.body;
    if (email && emailRegex.test(email)) {
        next(); // Proceed if email is valid
    } else {
        res.status(400).json({ message: 'Invalid email format' });
    }
    next(); // Continue to the next middleware or controller
};

export default validateForm;
