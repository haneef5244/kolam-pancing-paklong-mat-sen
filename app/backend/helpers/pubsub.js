import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const { WebPubSubServiceClient } = require('@azure/web-pubsub');


export const broadcastMessage = async (hub, notifications) => {
    let serviceClient = new WebPubSubServiceClient(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, hub);
    notifications.forEach(e => {
        serviceClient.userExists(e?.notificationId).then(exists => {
            if (exists) {
                serviceClient.sendToUser(e.notificationId, e.message)
            }
        })
    })
}
export const getPubSubTokenPayment = async (hub, id) => {
    try {
        if (!id) {
            return null;
        }

        const userToken = cookies().get('token');
        if (!userToken) {
            return null;
        }
        const userId = decode(userToken?.value)?.id

        if (!userId) {
            return null;
        }

        const booking = await prisma.kolam_booking.findFirst({
            where: {
                id: id || null,
                user_id: userId || null,
                is_deleted: false,
            },
            select: {
                'id': true
            }
        })

        if (!booking || !booking?.id) {
            return null;
        }

        const service = new WebPubSubServiceClient(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, hub);
        const token = await service.getClientAccessToken({ userId: id?.toString() });
        return {
            token: token.url,
        }
    } catch (e) {
        throw e;
    }


}

export const getPubSubToken = async (hub, id) => {
    if (!id) {
        return null;
    }

    const userToken = cookies().get('token');
    if (!userToken) {
        return null;
    }
    const userId = decode(userToken?.value)?.id

    if (!userId) {
        return null;
    }

    const booking = await prisma.kolam_booking.findFirst({
        where: {
            id: id || null,
            user_id: userId || null,
            is_deleted: false,
            payment_status: 'CREATED'
        },
        select: {
            'id': true
        }
    })

    if (!booking || !booking?.id) {
        return null;
    }

    const service = new WebPubSubServiceClient(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, hub);
    const token = await service.getClientAccessToken({ userId: id?.toString() });
    return {
        token: token.url,
    }
}