export default async function (server) {
  let callCount = 0;
  server.get('/step1', async (req, reply) => {
    reply.type('text/html').send('<html><body>Step 1</body></html>');
  });
  server.get('/step2', async (req, reply) => {
    callCount++;
    if (callCount === 1) {
      reply.status(403).send('Forbidden on Step 2');
    } else {
      reply.type('text/html').send('<html><body>Step 2 Success</body></html>');
    }
  });
}
