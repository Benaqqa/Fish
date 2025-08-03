const express = require('express');
const fs = require('fs');
const app = express();

// Use Render's PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Security headers middleware
app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Force HTTPS redirect (for production)
app.use((req, res, next) => {
    // Check if we're in production (Render sets NODE_ENV)
    if (process.env.NODE_ENV === 'production') {
        // Check if the request is HTTP (not HTTPS)
        if (req.headers['x-forwarded-proto'] !== 'https') {
            // Redirect to HTTPS
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
    }
    next();
});

app.get('/secret-link', (req, res) => {
    const userInfo = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        time: new Date().toISOString()
    };

    // Log to console instead of file (Render's filesystem is ephemeral)
    console.log('User accessed secret link:', userInfo);

    // Respond with 403 Forbidden
    res.status(403).send('403 Forbidden');
});

// Add a basic health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
