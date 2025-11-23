import express, { urlencoded } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({limit : "16kb"}));

app.use(urlencoded({extended: true, limit : "16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
    credentials: true // Allow cookies and authentication headers
}));

//routes

import userRouter from "./routes/user.routes.js"
// import ownerDashboardRouter from "./routes/ownerDashboard.routes.js"

// routes declaration

app.use("/api/users", userRouter);
// app.use("/api/owner-dashboard", ownerDashboardRouter);


// Secured routes

export { app };