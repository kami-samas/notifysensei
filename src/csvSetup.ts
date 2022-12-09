import { createObjectCsvWriter } from 'csv-writer'
import { FastifyInstance } from 'fastify'
import fs from 'fs'

// @ts-ignore
import { dir } from '../config.json'

const csvFile = `${dir}/data.csv`

export default (fastify: FastifyInstance) => {
    if (!fs.existsSync(csvFile)) {
        fs.writeFileSync(csvFile, '');
    }
    const csvWriter = createObjectCsvWriter({
        path: csvFile,
        header: [
            { id: 'serviceID', title: 'ID' },
            { id: 'key', title: 'KEY' },
        ]
    });

    fastify.decorate('csvWriter', csvWriter);
}