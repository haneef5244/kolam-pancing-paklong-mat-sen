'use server';

import { WebPubSubServiceClient } from "@azure/web-pubsub";

export async function getPublicPubSubToken(connectionString, hubName) {
    const serviceClient = new WebPubSubServiceClient(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, hubName);
    const token = await serviceClient.getClientAccessToken();

    return token;
}