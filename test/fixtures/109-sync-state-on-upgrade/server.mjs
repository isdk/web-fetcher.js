import cookie from '@fastify/cookie'

export default async function (server) {
  server.register(cookie)
  let callCount = 0
  server.get('/', async (req, reply) => {
    callCount++;
    if (callCount === 1) {
      reply.setCookie('test-cookie', 'test-value', { path: '/' });
      reply.status(403).send('Forbidden');
    } else {
      const cookie = req.cookies['test-cookie'];
      reply.type('text/html').send(`<html><body>Cookie: ${cookie}</body></html>`);
    }
  });
}
