export default async function (fastify) {
  fastify.get('/', async (req, reply) => {
    return reply
      .type('text/html')
      .send('<html><body><a id="download" href="/file.pdf">Download PDF</a></body></html>')
  })
  fastify.get('/file.pdf', async (req, reply) => {
    return reply
      .type('application/pdf')
      .header('Content-Disposition', 'attachment; filename="sample.pdf"')
      .send(Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF', 'binary'))
  })
}
