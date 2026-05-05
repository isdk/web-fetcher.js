export default async function (server) {
  let callCount = 0;
  server.get('/retry', async (req, reply) => {
    callCount++;
    console.log(`[106-server] Received request #${callCount} for /retry`);
    if (callCount === 1) {
      reply.status(429).header('Retry-After', '1').send('Too Many Requests');
    } else {
      reply.type('text/html').send('<html><body>Success on call ' + callCount + '</body></html>');
    }
  });
}
