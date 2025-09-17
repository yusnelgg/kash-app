import { sql } from '../config/db.js';

export const getSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;
        
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;
        
        res.status(200).json({
            balance: parseFloat(balanceResult[0].balance),
            income: parseFloat(incomeResult[0].income),
            expense: parseFloat(expenseResult[0].expense)
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
