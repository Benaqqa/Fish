# Node.js Application

A simple Express.js server that logs user information when they access a secret link.

## Files for Render Deployment

Your project now has the following files needed for Render:

- `test.js` - Main application file
- `package.json` - Dependencies and scripts
- `README.md` - This file

## HTTPS Support

This application is configured for HTTPS on Render:

- ✅ **Automatic HTTPS**: Render provides SSL certificates automatically
- ✅ **HTTPS Redirect**: Forces all HTTP traffic to HTTPS in production
- ✅ **Security Headers**: Includes HSTS and other security headers
- ✅ **Production Detection**: Only enforces HTTPS in production environment

## Deployment Steps

1. **Install Node.js and npm** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a package manager like Chocolatey: `choco install nodejs`

2. **Install dependencies locally** (optional, for testing):
   ```bash
   npm install
   ```

3. **Push to GitHub**:
   - Create a new repository on GitHub
   - Push your code to the repository

4. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Render will automatically detect it's a Node.js app
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Deploy!

## Key Changes Made for Render

- ✅ Added `package.json` with dependencies
- ✅ Updated port to use `process.env.PORT` (Render requirement)
- ✅ Changed file logging to console logging (Render's filesystem is ephemeral)
- ✅ Added health check endpoint at `/`
- ✅ Added proper start script
- ✅ Added HTTPS redirect middleware
- ✅ Added security headers (HSTS, XSS protection, etc.)

## Testing Locally

If you install Node.js, you can test locally:
```bash
npm install
npm start
```

Then visit `http://localhost:3000` and `http://localhost:3000/secret-link`

**Note**: HTTPS redirect only works in production (when `NODE_ENV=production`). Locally, it will work over HTTP. 