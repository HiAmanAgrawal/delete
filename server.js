const express = require('express');
const app = express();
const PORT = 3000;

// Use JSON parser
app.use(express.json());

// In-memory count
let count = 0;

// Hardcoded username and password
const USERNAME = 'admin';
const PASSWORD = 'secret';

// Middleware for Basic Auth
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(403).json({ message: 'Invalid username or password' });
    }

    next();
}

// Routes
app.get('/count', (req, res) => {
    res.json({ count });
});

app.post('/count', authenticate, (req, res) => {
    count++;
    res.json({ message: 'Count incremented', count });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
