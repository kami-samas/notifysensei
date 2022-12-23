import shelljs from 'shelljs'
import { FastifyInstance } from 'fastify'

interface IDParams {
    id: string;
};
interface CreateBody {
    name: string;
    adminPass: string;
}
export default async function serviceRoute(fastify: FastifyInstance) {
    // Get the service
    fastify.get<{
        Params: IDParams; 
    }>('/:id', async (request, reply) => {
        const { id } = request.params
        // @ts-ignore
        const service = await fastify.csv.reader({ id })
        if (!service) {
            reply.code(404).send({ message: 'Service not found' })
            return
        }
        reply.send(service)
    })
    fastify.post<{
        Body: CreateBody;
    }>('/create', async (request, reply) => {
        const { name, adminPass } = request.body;

        if (adminPass !== process.env.adminKey) {
            reply.code(401).send({ message: 'Unauthorized' })
            return
        }
        // @ts-ignore
        const service = await fastify.csv.reader({ name })
        if (service) {
            reply.code(409).send({ message: 'Service already exists' })
            return
        }
        const key = serviceKey();
        // @ts-ignore
        const id = fastify.snowflake.getUniqueID();
        // @ts-ignore
        await fastify.csv.writer.writeRecords([{ serviceID: id, serviceName: name, key }])
        reply.send({ message: 'Service created', id, key  })
    })
}

function serviceKey(): string {
    return shelljs.exec('openssl rand -hex 50', { silent: true }).stdout.trim();
}