export default async function (server) {
  let callCount = 0;
  server.get('/', async (req, reply) => {
    callCount++;
    if (callCount === 1) {
      reply.status(403).send('Forbidden');
    } else {
      reply.type('text/html').send('<html><body>Success on call ' + callCount + '</body></html>');
    }
  });
}
