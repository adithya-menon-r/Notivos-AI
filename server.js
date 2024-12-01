const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors());

const PORT = 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.get('/api/gemini', (req, res) => {
    const chat = JSON.parse(req.query.prompt);

    if (!chat) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "contents": chat
        })
    };

    fetch(GEMINI_API_URL, requestOptions).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch response: ${response.statusText} (Error ${response.status})`);
        }
        return response.json();
    }).then(data => {
        res.json(data.candidates[0].content);
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
