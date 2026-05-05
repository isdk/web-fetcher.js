export default async function (server) {
  let callCount = 0;
  server.get('/', async (req, reply) => {
    callCount++;
    if (callCount === 1) {
      // Return 200 but with JS detection pattern
      reply.type('text/html').send('<html><body><script>window.__NEXT_DATA__ = {}</script></body></html>');
    } else {
      reply.type('text/html').send('<html><body>Success on call ' + callCount + '</body></html>');
    }
  });
}
