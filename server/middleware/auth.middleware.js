import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                message: "bachaaa... you are not authenticated to access this route"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                message: "bachaaa... your token is invalid"
            })
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "bachaaa... user associated with this token no longer exists"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        })
    }
}