import Fastify from 'fastify'
import adminKey from './adminKey'
import csvSetup from './csvSetup'
import routes from './routes'
import admin from 'firebase-admin/app'
import { Snowflake } from 'nodejs-snowflake'
// @ts-ignore
import { port, host } from '../config'
// @ts-ignore
import googleConfig from  '../configFiles/googleAccount.json'

const envToLogger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
            },
        },
    },
    production: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
            },
        },
    },
    test: true,
}

const fastify = Fastify({
    logger: envToLogger['production'] ?? true
});

const timing = process.hrtime();
admin.initializeApp({
    credential: admin.cert({
        projectId: googleConfig.project_id,
        clientEmail: googleConfig.client_email,
        privateKey: googleConfig.private_key,
    }),
})
adminKey(fastify.log);
csvSetup(fastify);
fastify.decorate('snowflake', new Snowflake())
const endTiming = parseHrtimeToMs(process.hrtime(timing));
fastify.log.info(`Server Configuration ended in ${endTiming}s`);

// Register all routes
routes(fastify);
fastify.listen({
    port, host
}, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

function parseHrtimeToMs(hrtime: [number, number]) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

