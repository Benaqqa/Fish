const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Use Render's PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

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
        // Basic request info
        ip: req.ip,
        realIP: req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip,
        userAgent: req.get('User-Agent'),
        time: new Date().toISOString(),
        timestamp: Date.now(),
        
        // Request details
        method: req.method,
        url: req.url,
        referer: req.get('Referer'),
        origin: req.get('Origin'),
        
        // Headers that reveal device/browser info
        accept: req.get('Accept'),
        acceptLanguage: req.get('Accept-Language'),
        acceptEncoding: req.get('Accept-Encoding'),
        cacheControl: req.get('Cache-Control'),
        connection: req.get('Connection'),
        
        // Security and privacy headers
        secFetchDest: req.get('Sec-Fetch-Dest'),
        secFetchMode: req.get('Sec-Fetch-Mode'),
        secFetchSite: req.get('Sec-Fetch-Site'),
        secFetchUser: req.get('Sec-Fetch-User'),
        
        // Additional headers
        host: req.get('Host'),
        userAgentParsed: parseUserAgent(req.get('User-Agent')),
        
        // Query parameters (enhanced data from client-side tracker)
        queryParams: req.query,
        
        // Enhanced client-side data (if available)
        clientData: extractClientData(req.query),
        
        // Request path info
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        
        // Network info
        protocol: req.protocol,
        secure: req.secure,
        subdomains: req.subdomains,
        
        // Session/cookie info (if available)
        cookies: req.headers.cookie,
        
        // Additional client info
        clientIP: getClientIP(req),
        isMobile: isMobileDevice(req.get('User-Agent')),
        isBot: isBot(req.get('User-Agent')),
        
        // Timezone (from Accept-Language header)
        timezone: extractTimezone(req.get('Accept-Language')),
        
        // Screen resolution (if sent via query params)
        screenResolution: req.query.resolution || 'unknown',
        
        // Color depth (if sent via query params)
        colorDepth: req.query.colorDepth || 'unknown',
        
        // Viewport size (if sent via query params)
        viewport: req.query.viewport || 'unknown',
        
        // JavaScript enabled (if sent via query params)
        jsEnabled: req.query.jsEnabled || 'unknown',
        
        // Do not track preference
        doNotTrack: req.get('DNT') || 'unknown',
        
        // Accept headers for content types
        acceptTypes: parseAcceptHeader(req.get('Accept')),
        
        // Language preferences
        languages: parseAcceptLanguage(req.get('Accept-Language')),
        
        // Connection type hints
        saveData: req.get('Save-Data'),
        viewportWidth: req.get('Viewport-Width'),
        deviceMemory: req.get('Device-Memory'),
        
        // Additional metadata
        sessionId: generateSessionId(),
        requestId: generateRequestId(),
        
        // Data collection method
        collectionMethod: req.query.userAgent ? 'enhanced' : 'basic'
    };

    // Log to console instead of file (Render's filesystem is ephemeral)
    console.log('User accessed secret link:', JSON.stringify(userInfo, null, 2));

    // Respond with 403 Forbidden
    res.status(403).send('403 Forbidden');
});

// Helper functions
function parseUserAgent(userAgent) {
    if (!userAgent) return {};
    
    return {
        raw: userAgent,
        browser: extractBrowser(userAgent),
        os: extractOS(userAgent),
        device: extractDevice(userAgent),
        engine: extractEngine(userAgent)
    };
}

function extractBrowser(userAgent) {
    const browsers = {
        chrome: /Chrome/i,
        firefox: /Firefox/i,
        safari: /Safari/i,
        edge: /Edge/i,
        opera: /Opera|OPR/i,
        ie: /MSIE|Trident/i
    };
    
    for (const [browser, regex] of Object.entries(browsers)) {
        if (regex.test(userAgent)) return browser;
    }
    return 'unknown';
}

function extractOS(userAgent) {
    const os = {
        windows: /Windows/i,
        mac: /Mac OS X/i,
        linux: /Linux/i,
        android: /Android/i,
        ios: /iPhone|iPad|iPod/i
    };
    
    for (const [system, regex] of Object.entries(os)) {
        if (regex.test(userAgent)) return system;
    }
    return 'unknown';
}

function extractDevice(userAgent) {
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    return 'desktop';
}

function extractEngine(userAgent) {
    if (/Gecko/i.test(userAgent)) return 'Gecko';
    if (/WebKit/i.test(userAgent)) return 'WebKit';
    if (/Trident/i.test(userAgent)) return 'Trident';
    return 'unknown';
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           req.ip;
}

function isMobileDevice(userAgent) {
    return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

function isBot(userAgent) {
    return /bot|crawler|spider|crawling/i.test(userAgent);
}

function extractTimezone(acceptLanguage) {
    // This is a simplified extraction - timezone info is limited in headers
    return 'unknown'; // Would need client-side JavaScript for accurate timezone
}

function parseAcceptHeader(accept) {
    if (!accept) return [];
    return accept.split(',').map(type => type.trim().split(';')[0]);
}

function parseAcceptLanguage(acceptLanguage) {
    if (!acceptLanguage) return [];
    return acceptLanguage.split(',').map(lang => lang.trim().split(';')[0]);
}

function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function extractClientData(query) {
    const clientData = {};
    
    // Extract enhanced data from query parameters
    if (query.screenWidth) clientData.screen = { width: query.screenWidth, height: query.screenHeight };
    if (query.windowWidth) clientData.window = { width: query.windowWidth, height: query.windowHeight };
    if (query.timezone) clientData.timezone = query.timezone;
    if (query.geolocation && query.geolocation !== 'unknown') {
        try {
            clientData.geolocation = JSON.parse(query.geolocation);
        } catch (e) {
            clientData.geolocation = query.geolocation;
        }
    }
    if (query.canvasFingerprint) clientData.canvasFingerprint = query.canvasFingerprint;
    if (query.webglInfo && query.webglInfo !== 'not_supported') {
        try {
            clientData.webglInfo = JSON.parse(query.webglInfo);
        } catch (e) {
            clientData.webglInfo = query.webglInfo;
        }
    }
    if (query.fonts) {
        try {
            clientData.fonts = JSON.parse(query.fonts);
        } catch (e) {
            clientData.fonts = query.fonts;
        }
    }
    if (query.plugins) {
        try {
            clientData.plugins = JSON.parse(query.plugins);
        } catch (e) {
            clientData.plugins = query.plugins;
        }
    }
    if (query.touchSupport) {
        try {
            clientData.touchSupport = JSON.parse(query.touchSupport);
        } catch (e) {
            clientData.touchSupport = query.touchSupport;
        }
    }
    if (query.performance) {
        try {
            clientData.performance = JSON.parse(query.performance);
        } catch (e) {
            clientData.performance = query.performance;
        }
    }
    if (query.storage) {
        try {
            clientData.storage = JSON.parse(query.storage);
        } catch (e) {
            clientData.storage = query.storage;
        }
    }
    if (query.viewport) {
        try {
            clientData.viewport = JSON.parse(query.viewport);
        } catch (e) {
            clientData.viewport = query.viewport;
        }
    }
    
    return clientData;
}

// Add a 404 page for the homepage
app.get('/', (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .container {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    max-width: 500px;
                }
                .error-code {
                    font-size: 72px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin: 0;
                }
                .error-message {
                    font-size: 24px;
                    color: #2c3e50;
                    margin: 20px 0;
                }
                .description {
                    color: #7f8c8d;
                    margin-bottom: 30px;
                }
                .home-link {
                    background: #3498db;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    transition: background 0.3s;
                }
                .home-link:hover {
                    background: #2980b9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error-code">404</h1>
                <h2 class="error-message">Page Not Found</h2>
                <p class="description">
                    The page you are looking for might have been removed, had its name changed, 
                    or is temporarily unavailable.
                </p>
                <a href="/" class="home-link">Go to Homepage</a>
            </div>
        </body>
        </html>
    `);
});

// Catch-all route for any other non-existent pages
app.use('*', (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .container {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    max-width: 500px;
                }
                .error-code {
                    font-size: 72px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin: 0;
                }
                .error-message {
                    font-size: 24px;
                    color: #2c3e50;
                    margin: 20px 0;
                }
                .description {
                    color: #7f8c8d;
                    margin-bottom: 30px;
                }
                .home-link {
                    background: #3498db;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    transition: background 0.3s;
                }
                .home-link:hover {
                    background: #2980b9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error-code">404</h1>
                <h2 class="error-message">Page Not Found</h2>
                <p class="description">
                    The page you are looking for might have been removed, had its name changed, 
                    or is temporarily unavailable.
                </p>
                <a href="/" class="home-link">Go to Homepage</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
