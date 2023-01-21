import { FastifyInstance } from "fastify";
import * as OneSignal from '@onesignal/node-onesignal'
import fs from 'fs'
import path from 'path'

// @ts-ignore
import { app_id, dir, url } from '../../config.json'


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
        const timestamp = Date.now();
        const { title, msg, body, key } = request.body;
        // add check for key
        if (key !== process.env.serverKey) {
            reply.status(401).send('Invalid key');
            return;
        }
        const notification = new OneSignal.Notification();
        notification.priority = 100;
        notification.app_id = app_id;
        notification.included_segments = ['Subscribed Users'];
        notification.headings = { en: title };
        notification.contents = { en: body };
        notification.url = `${url}/n/r?time=${timestamp}`

        try {
            // @ts-ignore
            const response = await fastify.client.createNotification(notification);
            const fileName = path.join(`${process.cwd()}`, dir, "notifs", (response.id + "_" + timestamp +".txt"))
            const fileContent = "Title: " + title + "\n" + "Body: " +  body + "\n" + "Message: " + msg + "\n" + "Timestamp: " + timestamp;

            fs.writeFileSync(fileName, fileContent);

            reply.send(response);
        }
        catch (e: any) {
            reply.status(500).send(e);
        }
    })

    fastify.get<{
        Querystring: {
            time: string;
        };
    }>('/r', async (request, reply) => {
        const { time } = request.query;
        // create a regex to match the file
        const regex = new RegExp(`.*_${time}.txt`);
        // get all files in the directory
        const files = fs.readdirSync(path.join(`${process.cwd()}`, dir, "notifs"));
        // find the file
        const fileName = files.find(file => regex.test(file));
        // check if the file exists
        if (!fileName) {
            reply.status(404).send('File not found');
            return;
        }
        // now create a url to the file
        const fileUrl = `${url}/s/${fileName.split('/').pop()}`;
        // now redirrect
        reply
            .redirect(302
                , fileUrl
            )
    })
}