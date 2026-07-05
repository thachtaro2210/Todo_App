import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', routes);

// Error handling - always last
app.use(notFound);
app.use(errorHandler);

export default app;
