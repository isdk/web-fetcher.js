import fastify from 'fastify';
import { WebFetcher } from './dist/index.mjs';

async function run() {
  const server = fastify();
  server.get('/', (req, reply) => {
    reply
      .header('Set-Cookie', 'test-session-cookie=state-value; Path=/; Domain=localhost')
      .type('text/html')
      .send('<html><body><h1>Hello</h1></body></html>');
  });

  const address = await server.listen({ port: 0 });
  const port = new URL(address).port;
  const baseUrl = `http://localhost:${port}`;

  const fetcher = new WebFetcher();
  // Using cheerio engine as it is faster and doesn't require browser
  const session = await fetcher.createSession({ engine: 'cheerio' });

  await session.execute({ id: 'goto', params: { url: baseUrl } });

  const state = await session.getState();
  console.log('state:', JSON.stringify(state.sessionState, null, 2));

  await session.dispose();
  await server.close();
}

run().catch(console.error);
