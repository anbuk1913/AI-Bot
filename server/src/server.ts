import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();
import { errorHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chatRoutes';


const app = express();
const PORT = process.env.PORT

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
        }
    }
}));

app.use(compression());

const allowedOrigins = [
  process.env.CLIENT_HOST_DOMAIN,
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));




const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/chat', chatRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
    try {
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
        });
    } catch (error) {
        console.log('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();