import { createObjectCsvWriter } from 'csv-writer'
import { FastifyInstance } from 'fastify'
import csvToJson from 'csvtojson'
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
            { id: 'serviceName', title: 'NAME'},
            { id: 'key', title: 'KEY' },
        ]
    });

    fastify.decorate('csv', {
        writer: csvWriter,
        reader: csvReader
    });
}

const csvReader = async ({ id, name, key }: { id: string; name: string; key: string; }) => {
    const data = await csvToJson().fromFile(csvFile)
    return data.find((service: { ID: string; NAME: string; KEY: string; }) => {
        if (id) {
            return service.ID === id
        }
        if (name) {
            return service.NAME === name
        }
        if (key) {
            return service.KEY === key
        }
    })
}