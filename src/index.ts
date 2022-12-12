import Fastify from 'fastify'
import adminKey from './adminKey'
import csvSetup from './csvSetup'
import routes from './routes'
import { applicationDefault, initializeApp } from 'firebase-admin/app'

// @ts-ignore
import { port } from '../config'

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
initializeApp({
    credential: applicationDefault(),
})
adminKey(fastify.log);
csvSetup(fastify);
const endTiming = parseHrtimeToMs(process.hrtime(timing));
fastify.log.info(`Server Configuration ended in ${endTiming}s`);

// Register all routes
routes(fastify);
fastify.listen({
    port,
}, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})


function parseHrtimeToMs(hrtime: [number, number]) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

