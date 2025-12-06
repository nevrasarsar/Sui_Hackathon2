const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Load questions
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

// In-memory user limit tracking: { "0xAddress_YYYY-MM-DD": count }
// Optimized: { "0xAddress": { date: "YYYY-MM-DD", count: 0 } }
const userDailyLimits = {};

// Helper: Get Today's Date String
const getTodayDate = () => new Date().toISOString().split('T')[0];

app.get('/api/questions', (req, res) => {
    // Return all questions without showing correct answer ideally
    // For this step, simply returning the structure.
    const publicQuestions = questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        difficulty: q.difficulty
    }));
    res.json(publicQuestions);
});

app.post('/api/submit', (req, res) => {
    const { user_address, question_id, selected_option_id } = req.body;

    if (!user_address || !question_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Check Limits
    const today = getTodayDate();

    if (!userDailyLimits[user_address]) {
        userDailyLimits[user_address] = { date: today, count: 0 };
    }

    // Reset if new day
    if (userDailyLimits[user_address].date !== today) {
        userDailyLimits[user_address] = { date: today, count: 0 };
    }

    if (userDailyLimits[user_address].count >= 10) {
        return res.status(403).json({ error: "Daily limit reached (10 questions)" });
    }

    // 2. Validate Answer
    const question = questions.find(q => q.id === question_id);
    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    const isCorrect = (question.correct_option_id === selected_option_id);

    // Increment count only if answered (or maybe just attempted? Sticking to attempted)
    userDailyLimits[user_address].count += 1;

    res.json({
        correct: isCorrect,
        correct_option_id: question.correct_option_id, // Reveal answer
        remaining_daily_limit: 10 - userDailyLimits[user_address].count
    });
});

// Phase 2.2: Batch Quiz Submission and Signature Generation
app.post('/api/submit-quiz', (req, res) => {
    const { user_address, answers } = req.body; // answers: [{ question_id: 1, selected_option_id: 2 }, ...]

    if (!user_address || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Invalid input format" });
    }

    // 1. Check Daily Limit (Global Check)
    const today = getTodayDate();
    if (!userDailyLimits[user_address]) {
        userDailyLimits[user_address] = { date: today, count: 0 };
    }
    // Reset if new day
    if (userDailyLimits[user_address].date !== today) {
        userDailyLimits[user_address] = { date: today, count: 0 };
    }

    // Check if adding these answers exceeds limit
    if (userDailyLimits[user_address].count + answers.length > 10) {
        return res.status(403).json({ error: "Daily limit exceeded" });
    }

    // 2. Validate Answers
    let correctCount = 0;

    answers.forEach(ans => {
        const question = questions.find(q => q.id === ans.question_id);
        if (question && question.correct_option_id === ans.selected_option_id) {
            correctCount++;
        }
    });

    // Update Usage
    userDailyLimits[user_address].count += answers.length;

    // 3. Simulate Transaction Signature
    // In a real app, we would sign a message like `Hash(user + correctCount + nonce)` with a private key.
    // The Move contract would verify this signature before minting/updating to prevent cheating.
    const mockSignature = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}...signed_by_admin`;

    res.json({
        success: true,
        correct_count: correctCount,
        total_attempted: answers.length,
        signature: mockSignature,
        message: "Use this signature to call smart contract"
    });
});

app.get('/api/user/:address/limit', (req, res) => {
    const { address } = req.params;
    const today = getTodayDate();

    let count = 0;
    if (userDailyLimits[address] && userDailyLimits[address].date === today) {
        count = userDailyLimits[address].count;
    }

    res.json({
        date: today,
        used: count,
        remaining: 10 - count
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
