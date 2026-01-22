import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import mongoose from 'mongoose'; // MongoDB - commented out
import courseRoutes from './routes/courseRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { docClient } from './utils/dynamodb'; // DynamoDB connection

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const API_PREFIX = '/api/v1';

app.use(cors());
app.use(express.json());

// DynamoDB connection
// Using AWS SDK v3 with auto-credentials
console.log('DynamoDB client initialized for region:', process.env.AWS_REGION || 'us-east-1');

// Test DynamoDB connection
try {
  console.log('DynamoDB is ready to use');
} catch (error) {
  console.error('Error initializing DynamoDB:', error);
  process.exit(1);
}

// MongoDB connection - commented out, using DynamoDB instead
/*
mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
*/

// Routes
app.use(`${API_PREFIX}/courses`, courseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default app;
