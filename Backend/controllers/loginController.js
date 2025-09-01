require('dotenv').config(); // Load env variables

// Controller function for login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === process.env.email && password === process.env.password) {
            return res.send({
                message: "Login Successful",
                status: 1
            });
        } else {
            return res.send({
                message: "Login Failed",
                status: 0
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
};

module.exports = { loginUser };
