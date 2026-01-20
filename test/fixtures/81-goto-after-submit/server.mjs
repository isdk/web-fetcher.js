import formbody from '@fastify/formbody';
import cookie from '@fastify/cookie';

export default async function (fastify) {
  await fastify.register(formbody);
  await fastify.register(cookie);

  fastify.post('/step2', async (req, reply) => {
    const body = req.body || {}
    const receivedValue = body.q || 'NO_VALUE'
    console.log('Server received on /step2:', JSON.stringify(body))
    return reply.code(302).redirect(`/step2-final?q=${encodeURIComponent(receivedValue)}`)
  })

  fastify.get('/step2-final', async (req, reply) => {
    const receivedValue = req.query.q || 'NO_VALUE'
    console.log('Server received on /step2-final:', JSON.stringify(receivedValue))
    return reply.type('text/html').send(`<html><body><h1>Step 2 Loaded: ${receivedValue}</h1><a href="/step3">Go to Step 3</a></body></html>`)
  })

  fastify.get('/step3', async (req, reply) => {
    return reply.type('text/html').send('<html><body><h1>Step 3 Loaded</h1></body></html>')
  })
}