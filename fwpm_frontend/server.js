const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Determine environment
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Log the environment
console.log(`Running in ${dev ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);

// Load the appropriate environment variables
const envFile = dev ? '.env.development' : '.env.production';
const envPath = path.join(process.cwd(), '..', envFile);

if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  require('dotenv').config({ path: envPath });
} else {
  console.log(`Environment file ${envPath} not found, using existing environment variables or defaults`);
}

// Get the port from environment or default to 3000
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    
    // Add CORS headers to allow appropriate origins
    // In production, restrict to specific domains
    const allowedOrigins = dev 
      ? '*' 
      : process.env.CORS_ALLOWED_ORIGINS || 'https://fwpm.nwas.nbnco.net.au';
    
    if (allowedOrigins === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
      const origin = req.headers.origin;
      if (origin && allowedOrigins.split(',').includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Handle the request
    handle(req, res, parsedUrl)
      .catch(err => {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 