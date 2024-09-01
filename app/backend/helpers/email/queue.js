import { QueueClient } from "@azure/storage-queue"
import { v4 as uuidv4 } from 'uuid';

export const addQueue = async (queueName, message) => {
    try {
        const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);
        const jsonString = JSON.stringify(message);
        const data = Buffer.from(jsonString).toString('base64')
        const resp = await queueClient.sendMessage(data)
        return resp;
    }
    catch (e) {
        throw e;
    }
}