import { sql } from '../config/db.js';

export const createTransaction = async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || !amount || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const transaction = await sql`
        INSERT INTO transactions (user_id, title, amount, category) 
        VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTransactions = async (req, res) => {
    const { userId } = req.params;
    try {
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Invalid transaction ID' });
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
