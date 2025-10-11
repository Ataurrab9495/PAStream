import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import "dotenv/config";


import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/connectDB.js';

const app = express();
const Port = 3000;

const __dirname = path.resolve();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,   // allow frontend to send cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/users", userRoutes);
app.use("/v1/api/chat", chatRoutes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    connectDB();
});