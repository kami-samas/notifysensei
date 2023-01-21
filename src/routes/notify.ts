import { FastifyInstance } from "fastify";
import * as OneSignal from '@onesignal/node-onesignal'

// @ts-ignore
import { app_id } from '../../config.json'


export default async function notifyRoute(fastify: FastifyInstance) {
    // post a notification
    fastify.post<{
        Body: {
            key: string;
            title: string;
            body: string;
        };
    }>('/', async (request, reply) => {
        const { title, body, key } = request.body;
        // add check for key
        if (key !== process.env.serverKey) {
            reply.status(401).send('Invalid key');
            return;
        }
        const notification = new OneSignal.Notification();
        notification.priority = 10;
        notification.app_id = app_id;
        notification.included_segments = ['Subscribed Users'];
        notification.headings = { en: title };
        notification.contents = { en: body };

        try {
            // @ts-ignore
            const response = await fastify.client.createNotification(notification);
            reply.send(response);
        }
        catch (e: any) {
            reply.status(500).send(e.message);
        }
    })
}