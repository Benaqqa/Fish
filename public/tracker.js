// Enhanced client-side data collection
(function() {
    'use strict';
    
    // Collect comprehensive user data
    function collectUserData() {
        const data = {
            // Basic browser info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            
            // Screen information
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth,
            screenAvailWidth: screen.availWidth,
            screenAvailHeight: screen.availHeight,
            
            // Window information
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            windowOuterWidth: window.outerWidth,
            windowOuterHeight: window.outerHeight,
            
            // Device information
            devicePixelRatio: window.devicePixelRatio,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            
            // Connection information
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            connectionDownlink: navigator.connection ? navigator.connection.downlink : 'unknown',
            connectionRtt: navigator.connection ? navigator.connection.rtt : 'unknown',
            connectionSaveData: navigator.connection ? navigator.connection.saveData : 'unknown',
            
            // Timezone and time
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            currentTime: new Date().toISOString(),
            timestamp: Date.now(),
            
            // Geolocation (if available)
            geolocation: 'unknown',
            
            // Canvas fingerprinting
            canvasFingerprint: generateCanvasFingerprint(),
            
            // WebGL information
            webglInfo: getWebGLInfo(),
            
            // Font detection
            fonts: detectFonts(),
            
            // Plugin information
            plugins: getPluginInfo(),
            
            // Battery information (if available)
            battery: 'unknown',
            
            // Touch support
            touchSupport: {
                maxTouchPoints: navigator.maxTouchPoints || 0,
                touchEvent: 'ontouchstart' in window,
                touchStart: 'ontouchstart' in window,
                touchMove: 'ontouchmove' in window,
                touchEnd: 'ontouchend' in window
            },
            
            // Performance information
            performance: {
                timeOrigin: performance.timeOrigin,
                navigation: performance.navigation ? {
                    type: performance.navigation.type,
                    redirectCount: performance.navigation.redirectCount
                } : 'unknown'
            },
            
            // Storage information
            storage: {
                localStorage: typeof(Storage) !== "undefined",
                sessionStorage: typeof(Storage) !== "undefined",
                cookies: document.cookie ? document.cookie.length : 0
            },
            
            // Do not track
            doNotTrack: navigator.doNotTrack || 'unknown',
            
            // Referrer
            referrer: document.referrer,
            
            // URL information
            url: window.location.href,
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            
            // Session storage
            sessionId: getSessionId(),
            
            // Additional metadata
            pageLoadTime: Date.now() - performance.timeOrigin,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        // Try to get geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    data.geolocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed
                    };
                    sendData(data);
                },
                function(error) {
                    data.geolocation = 'denied';
                    sendData(data);
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        } else {
            data.geolocation = 'not_supported';
            sendData(data);
        }
    }
    
    // Generate canvas fingerprint
    function generateCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Canvas fingerprinting test', 2, 2);
            return canvas.toDataURL();
        } catch (e) {
            return 'error';
        }
    }
    
    // Get WebGL information
    function getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'not_supported';
            
            return {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
            };
        } catch (e) {
            return 'error';
        }
    }
    
    // Detect available fonts
    function detectFonts() {
        const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
        const detected = [];
        
        for (let font of fonts) {
            if (document.fonts && document.fonts.check) {
                if (document.fonts.check('12px ' + font)) {
                    detected.push(font);
                }
            }
        }
        
        return detected;
    }
    
    // Get plugin information
    function getPluginInfo() {
        const plugins = [];
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                plugins.push({
                    name: navigator.plugins[i].name,
                    description: navigator.plugins[i].description,
                    filename: navigator.plugins[i].filename
                });
            }
        }
        return plugins;
    }
    
    // Generate or get session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('tracker_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('tracker_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Send data to server
    function sendData(data) {
        // Add query parameters to the current URL
        const url = new URL(window.location.href);
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                url.searchParams.set(key, JSON.stringify(data[key]));
            } else {
                url.searchParams.set(key, data[key]);
            }
        });
        
        // Navigate to the enhanced URL
        window.location.href = url.toString();
    }
    
    // Start collection when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', collectUserData);
    } else {
        collectUserData();
    }
    
})(); 