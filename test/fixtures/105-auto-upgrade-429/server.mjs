export default async function (server) {
  let callCount = 0;
  server.get('/429', async (req, reply) => {
    callCount++;
    console.log(`[105-server] Received request #${callCount} for /429`);
    if (callCount === 1) {
      reply.status(429).header('Retry-After', '6').send('Too Many Requests');
    } else {
      reply.type('text/html').send('<html><body>Success on call ' + callCount + '</body></html>');
    }
  });
}
