import cookie from '@fastify/cookie';

export default async function(server) {
  await server.register(cookie);

  server.get('/echo/cookies', async (req, reply) => {
    return { cookies: req.cookies };
  });

  server.get('/set-cookie', async (req, reply) => {
    const query = req.query;
    Object.entries(query).forEach(([key, value]) => {
      reply.setCookie(key, value, { path: '/' });
    });
    return { message: 'cookies set' };
  });
}
