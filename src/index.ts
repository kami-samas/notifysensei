import Fastify from 'fastify'
import serverKey from './serverKey'
import routes from './routes'
import path from 'path'
import * as OneSignal from '@onesignal/node-onesignal'
// @ts-ignore
import { port, host, app_key, dir } from '../config'

const app_key_provider = {
    getToken() {
        return app_key
    }
}

const configuration = OneSignal.createConfiguration({
    authMethods: {
        app_key: {
            tokenProvider: app_key_provider
        }
    }
});
const client = new OneSignal.DefaultApi(configuration);

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

serverKey(fastify.log);
fastify.decorate('client', client);

fastify.register(require('@fastify/static'), {
    root: path.join(process.cwd(), dir, 'notifs'),
    prefix: '/s'
})
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