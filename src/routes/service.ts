import { FastifyInstance } from 'fastify'

export default async function serviceRoute(fastify: FastifyInstance) {
    // Get the service
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params
        const service = await fastify.csv.reader(id)
        if (!service) {
            reply.code(404).send({ message: 'Service not found' })
        }
        reply.send(service)
    })
}