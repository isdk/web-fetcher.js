export default async function (fastify) {
  fastify.post('/step2', async (req, reply) => {
    return reply.redirect(302, '/step2-a')
  })
  fastify.get('/step2-a', async (req, reply) => {
    return reply.redirect(301, '/step2-b')
  })
  fastify.get('/step2-b', async (req, reply) => {
    return reply.type('text/html').send('<html><body><h1>Final Destination</h1></body></html>')
  })
}
