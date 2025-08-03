# Advanced Data Collection Application

A sophisticated Express.js server that collects comprehensive user data through both server-side and client-side tracking techniques.

## Files for Render Deployment

Your project now has the following files needed for Render:

- `test.js` - Main application file with enhanced data collection
- `package.json` - Dependencies and scripts
- `public/index.html` - Landing page with embedded tracker
- `public/tracker.js` - Client-side data collection script
- `README.md` - This file

## HTTPS Support

This application is configured for HTTPS on Render:

- ✅ **Automatic HTTPS**: Render provides SSL certificates automatically
- ✅ **HTTPS Redirect**: Forces all HTTP traffic to HTTPS in production
- ✅ **Security Headers**: Includes HSTS and other security headers
- ✅ **Production Detection**: Only enforces HTTPS in production environment

## Comprehensive Data Collection

This application collects extensive user data through multiple methods:

### 🔍 **Server-Side Data Collection**
- **IP Address**: Real IP, forwarded IP, client IP
- **User Agent**: Full browser/device identification
- **Request Headers**: Accept, language, encoding, security headers
- **Network Info**: Protocol, security status, subdomains
- **Session Data**: Cookies, session tracking
- **Device Detection**: Mobile/desktop/tablet identification
- **Bot Detection**: Crawler and bot identification
- **Geographic Hints**: Language-based location inference

### 🎯 **Client-Side Enhanced Data Collection**
- **Screen Information**: Resolution, color depth, pixel depth
- **Window Information**: Inner/outer dimensions, viewport
- **Device Capabilities**: Pixel ratio, memory, CPU cores
- **Connection Details**: Type, speed, RTT, save data mode
- **Geolocation**: Precise GPS coordinates (if permitted)
- **Canvas Fingerprinting**: Unique device fingerprint
- **WebGL Information**: Graphics capabilities and vendor
- **Font Detection**: Available system fonts
- **Plugin Information**: Browser plugins and extensions
- **Touch Support**: Touch capabilities and max touch points
- **Performance Data**: Page load times, navigation type
- **Storage Info**: Local/session storage availability
- **Timezone**: Exact timezone and offset
- **Language Preferences**: Detailed language settings

### 📊 **Data Categories Collected**

#### **Device Information**
- Operating system and version
- Browser type and version
- Device type (mobile/desktop/tablet)
- Screen resolution and color depth
- Hardware capabilities (memory, CPU)
- Touch support and capabilities

#### **Network Information**
- IP address and location hints
- Connection type and speed
- Network performance metrics
- Proxy/VPN detection

#### **Privacy and Security**
- Do Not Track preferences
- Privacy settings
- Security headers
- Cookie preferences

#### **Behavioral Data**
- Session tracking
- Page load performance
- Navigation patterns
- Referrer information

#### **Technical Fingerprinting**
- Canvas fingerprinting
- WebGL fingerprinting
- Font fingerprinting
- Plugin fingerprinting
- Hardware fingerprinting

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

## Key Features

- ✅ Added `package.json` with dependencies
- ✅ Updated port to use `process.env.PORT` (Render requirement)
- ✅ Changed file logging to console logging (Render's filesystem is ephemeral)
- ✅ Added health check endpoint at `/`
- ✅ Added proper start script
- ✅ Added HTTPS redirect middleware
- ✅ Added security headers (HSTS, XSS protection, etc.)
- ✅ Enhanced server-side data collection
- ✅ Client-side JavaScript tracker
- ✅ Static file serving
- ✅ Comprehensive user fingerprinting
- ✅ Geolocation support
- ✅ Session tracking
- ✅ Bot detection

## Testing Locally

If you install Node.js, you can test locally:
```bash
npm install
npm start
```

Then visit:
- `http://localhost:3000` - Landing page with tracker
- `http://localhost:3000/secret-link` - Direct data collection endpoint

**Note**: HTTPS redirect only works in production (when `NODE_ENV=production`). Locally, it will work over HTTP.

## Data Collection Methods

### **Method 1: Direct Access**
Users can directly access `/secret-link` to trigger basic server-side data collection.

### **Method 2: Enhanced Tracking**
Users visit the landing page (`/`) which loads the client-side tracker, then clicking the link collects comprehensive data including:
- Geolocation (if permitted)
- Device fingerprinting
- Performance metrics
- Hardware capabilities
- And much more...

## Privacy Considerations

⚠️ **Important**: This application demonstrates advanced data collection techniques. Ensure compliance with:
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- Local privacy laws
- Website privacy policies
- User consent requirements

The application respects user privacy settings like Do Not Track headers and geolocation permissions. 