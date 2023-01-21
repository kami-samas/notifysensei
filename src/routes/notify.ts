import { FastifyInstance } from "fastify";
import * as OneSignal from '@onesignal/node-onesignal'
import fs from 'fs'
import path from 'path'

// @ts-ignore
import { app_id, dir } from '../../config.json'


export default async function notifyRoute(fastify: FastifyInstance) {
    // post a notification
    fastify.post<{
        Body: {
            key: string;
            title: string;
            msg: string;
            body: string;
        };
    }>('/', async (request, reply) => {
        const { title, msg, body, key } = request.body;
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
            const timestamp = Date.now();
            const fileName = path.join(`${process.cwd()}`, dir, "notifs", (response.id + "_" + timestamp +".txt"))
            const fileContent = "Title: " + title + "\n" + "Body: " + body + "\n" + "Message: " + msg + "\n" + "Timestamp: " + timestamp;

            fs.writeFileSync(fileName, fileContent);

            reply.send(response);
        }
        catch (e: any) {
            reply.status(500).send(e.message);
        }
    })
}