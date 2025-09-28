import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user._id);


        res.status(200).json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};