import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getStreamToken } from "../controllers/chat.controller.js"

const app = express.Router();

app.get('/token', authenticate, getStreamToken);

export default app;