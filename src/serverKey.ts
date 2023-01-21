import { FastifyBaseLogger } from 'fastify'
import fs from 'fs'
import shelljs from 'shelljs'
// @ts-ignore
import { dir } from '../config.json'

export default (fastify: FastifyBaseLogger) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let key;
    try {
        key = fs.readFileSync(`${dir}/admin.key`, 'utf8')
    } catch (e) {}
    if (key) {
        process.env.serverKey = key;
        return key;
    }
    const newKey = shelljs.exec('openssl rand -hex 20', { silent: true }).stdout;
    fastify.info(`Generated new server key`);
    fs.writeFileSync(`${dir}/server.key`, newKey.trim());
    fastify.info(`Saved new server key to ${dir}/server.key`);
    shelljs.exec(`mkdir ${dir}/notifs`, { silent: true })
    process.env.adminKey = newKey.trim();
    return newKey.trim();
}