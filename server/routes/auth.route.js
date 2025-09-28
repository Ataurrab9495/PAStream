import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { login, logout, onBoard, signup } from '../controllers/auth.controller.js';

const app = express.Router();

app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

app.get("/onboarding", authenticate, onBoard);

// check if user is authenticated
app.get("/me", authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "User is authenticated",
    })
});

export default app;