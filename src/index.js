import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import authRoutes from './routes/auth.js';

config();
const app = express();

// Middleware: Security headers
app.use(helmet());

// Middleware: Request logger
app.use(morgan('dev'));

// Middleware: Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ✅ Add this line before middleware like rate limiter
app.set('trust proxy', 1); 

// ✅ Use express built-in body parsers (no need for body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: CORS
app.use(cors({
  origin: "https://assingment-xi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you use cookies
}));
// Default route
app.get('/', (req, res) => {
  res.send('Assignment server is running smoothly!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);

export default app;
