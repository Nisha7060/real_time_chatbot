const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createWebSocketServer } = require('./src/socket/socketServer');

const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // ✨ Create WebSocket server
  createWebSocketServer(server);

  server.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});
