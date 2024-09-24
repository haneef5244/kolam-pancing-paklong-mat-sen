'use server';

import prisma from "../helpers/prisma";

export const getDistinctKolamByPancangs = async (pancangs) => {

    return (JSON.stringify(await prisma.pancang.findMany({
        where: {
            'value': {
                in: pancangs
            }
        },
        select: {
            'kolam_id': true,
        },
        distinct: ['kolam_id']
    })))
}