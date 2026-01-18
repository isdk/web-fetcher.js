export default async function (server) {
  server.get('/target', async (request, reply) => {
    reply.type('text/html').send('<html><body><div id="result">Target Page</div></body></html>');
  });
}
