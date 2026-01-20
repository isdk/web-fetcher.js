import formbody from '@fastify/formbody';

export default async function (fastify) {
  await fastify.register(formbody);

  fastify.post('/step2', async (req, reply) => {
    // Return 307: MUST preserve POST method
    return reply.redirect(307, '/step2-final')
  })

  // This endpoint MUST be hit via POST
  fastify.post('/step2-final', async (req, reply) => {
    const val = req.body.val || 'NO_VALUE'
    return reply.type('text/html').send(`<html><body><h1>Step 2 Final: ${val}</h1><div id="method">POST</div></body></html>`)
  })

  // If hit via GET, return error to fail the test
  fastify.get('/step2-final', async (req, reply) => {
    return reply.status(405).send('Method Not Allowed: 307 should have preserved POST')
  })
}
