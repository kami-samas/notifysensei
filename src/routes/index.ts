import { FastifyInstance } from 'fastify'

export default (fastify: FastifyInstance) => {
    fastify.register(require('./service').default, { prefix: '/s' })
    fastify.register(require('./notify').default, { prefix: '/n' })
    //register index route
    fastify.get('/', async (_request, reply) => {
        reply.send({ message: 'Hello, This is notifysensei!' })
    })
}