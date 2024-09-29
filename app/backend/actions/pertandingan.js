'use server';

import moment from "moment";
import prisma from "../helpers/prisma";
import { getBlobSasUrl } from "../helpers/blob";

export const getAllPertandingan = async () => {
    const data = await prisma.pertandingan.findMany({
        where: {
            tarikh: {
                gte: moment().startOf('day').toISOString()
            },
            is_deleted: false,
        },
        select: {
            'jenis': true,
            'poster_url': true,
            'tarikh': true,
        },
    });

    for (let d of data) {
        if (d?.poster_url) {
            d.poster_url = getBlobSasUrl(d?.poster_url,
                'posters',
                moment().utc().add(5, "minute"),
                process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_NAME,
                process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_KEY);
        }
    }
    return data;
}

export const getLivePertandingan = async () => {
    const data = await prisma.pertandingan.findFirst({
        where: {
            is_started: true,
            is_ended: false,
        },
        select: {
            'id': true,
            'jenis': true,
            'tarikh': true,
        }
    })
    return data;
}

export const getPertandinganLog = async (pertandinganId) => {
    let result = await prisma.pertandingan_audit_log.findMany({
        where: {
            pertandingan_id: Number(pertandinganId),
        },
        select: {
            'pancang_value': true,
            'berat': true,
            'waktu': true,
            'timbang': {
                'select': {
                    'label': true,
                }
            },
            'id': true
        },
        orderBy: [{
            berat: 'desc'
        }, {
            waktu: 'desc'
        }],
        'take': 250
    })
    result = result?.map((e, no) => ({ ...e, no: no + 1 }))
    return result;
}