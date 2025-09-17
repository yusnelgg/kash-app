import express from 'express';
import dotenv, { parse } from 'dotenv';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRouter from './routes/transactions.js';
import summaryRouter from './routes/summary.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(rateLimiter);

const PORT = process.env.PORT || 5001;

app.use('/api/transactions', transactionsRouter);
app.use('/api/transactions/summary', summaryRouter);

async function initDB() {
    // Initialize the database connection
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log('Database connected and table ensured.');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});