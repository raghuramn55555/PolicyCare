import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import logger from './utils/logger.js';
import recommendRouter from './routes/recommend.js';
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import popularRouter from './routes/popular.js';
import policeRouter from './routes/police.js';
import insuranceRouter from './routes/insurance.js';
import vectorDB from './services/vectorDB.js';
import { initializePolicies, initializeAgents } from './services/policyLoader.js';

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PolicySetu API is running' });
});

app.use('/recommend', recommendRouter);
app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/popular', popularRouter);
app.use('/api/police', policeRouter);
app.use('/api/insurance', insuranceRouter);

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, 'Server');
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// --------------- Startup ---------------
async function initializeServer() {
  try {
    logger.info('Initializing VectorDB...', 'Startup');
    await vectorDB.initialize();

    logger.info('Loading policies and agents...', 'Startup');
    await initializePolicies();
    await initializeAgents();

    logger.info('All data loaded — server is ready', 'Startup');
  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`, 'Startup');
  }
}

const server = app.listen(config.port, async () => {
  logger.info(`Server running on http://localhost:${config.port}`, 'Startup');
  await initializeServer();
});

// --------------- Graceful Shutdown ---------------
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`, 'Server');
  server.close(() => {
    logger.info('HTTP server closed', 'Server');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
