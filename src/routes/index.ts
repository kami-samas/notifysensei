import { FastifyInstance } from 'fastify'

export default (fastify: FastifyInstance) => {
    fastify.register(require('./service').default, { prefix: '/s' })
    fastify.register(require('./notify').default, { prefix: '/n' })
}