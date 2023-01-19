import { FastifyInstance } from "fastify";
import { getMessaging } from "firebase-admin/messaging";

export default async function notifyRoute(fastify: FastifyInstance) {
    // post a notification
    fastify.post<{
        Body: {
            serviceKey: string;
            title: string;
            body: string;
        };
    }>('/', async (request, reply) => {
        const { serviceKey, title, body } = request.body;
        // @ts-ignore
        const service = await fastify.csv.reader({ key: serviceKey });
        if (!service) {
            reply.code(401).send({ message: 'Unauthorized' });
            return;
        }
        console.log(`Sending notification to ${service.NAME}`);
        getMessaging().sendToTopic(service.NAME, {
            data: {
                title, body
            }
        })
        reply.send({ message: 'Notification sent' });
    })
}