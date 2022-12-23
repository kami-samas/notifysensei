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
        process.env.adminKey = key;
        return key;
    }
    const newKey = shelljs.exec('openssl rand -hex 50', { silent: true }).stdout;
    fastify.info(`Generated new admin key`);
    fs.writeFileSync(`${dir}/admin.key`, newKey.trim());
    fastify.info(`Saved new admin key to ${dir}/admin.key`);
    process.env.adminKey = newKey.trim();
    return newKey.trim();
}