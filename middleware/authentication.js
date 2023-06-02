const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization)
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken)

        // Attach the user object to the request
        req.user = decodedToken; // Assuming the decoded token directly contains the user object

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authenticateUser };
