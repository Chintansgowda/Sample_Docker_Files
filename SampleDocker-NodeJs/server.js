const http = require('http');

// Use PORT from environment variables OR fallback to 3000
const PORT = process.env.PORT || 3000;

// Listen on all interfaces (works on EC2, Docker, localhost, Kubernetes)
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World from Node.js");
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
