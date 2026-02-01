
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, SECRET_KEY } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.json({ message: "Personal Finance API is running" });
});

// Register (Helper for dev/testing, though not explicitly requested globally it's useful)
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, avatarUrl: user.avatarUrl } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Transactions
router.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        let whereClause = { userId: req.user.userId };

        if (month && year) {
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

            whereClause.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Transaction
router.post('/transactions', authenticateToken, async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        const transaction = await prisma.transaction.create({
            data: {
                description,
                amount: parseFloat(amount),
                type,
                category,
                date: date ? new Date(date) : new Date(),
                userId: req.user.userId,
            },
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Transaction
router.delete('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.userId
            }
        });

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        await prisma.transaction.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

import multer from 'multer';
import path from 'path';

// ... (previous imports)

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

// ... (other routes)

// Update User Profile (Support file upload)
router.put('/users/profile', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        let avatarUrl = req.body.avatarUrl;

        // If file uploaded, construct URL
        if (req.file) {
            avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: { avatarUrl }
        });
        res.json({ message: "Profile updated", user: { id: user.id, email: user.email, avatarUrl: user.avatarUrl } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
