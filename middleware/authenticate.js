const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema');
const messages = require('../utils/messages');
const createError = require('http-errors');

async function authenticate(req, res, next) {

    try {

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            // Send response with 401 status if token is not provided
            return res.status(400).json({
                message: messages.error.AUTH_TOKEN_NOT_FOUND,
                statusCode: false
            });
        }

        // Decode the JWT token to get user information
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded information
        const user = await UserModel.findById(decodedToken.userId);


        if (!user || user.Is_deleted) {
            // return res.status(401).json({ message: messages.error.AUTH_FAILED, statuscode: false });
            return res.status(400).json({
                message: messages.error.AUTH_FAILED,
                statusCode: false
            });
        }

        // Assuming you have a 'role' field in your UserModel
        const role = user.role?.toLowerCase();

        req.user = { ...user.toJSON(), role };

        next();

    } catch (error) {

        return res.status(400).json({
            message: messages.error.AUTH_FAILED,
            statusCode: false
        });
    }
 

}

module.exports = authenticate;
