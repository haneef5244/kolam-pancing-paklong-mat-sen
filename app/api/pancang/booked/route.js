import prisma from "@/app/backend/helpers/prisma";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    const kolamId = req.nextUrl.searchParams.get('kolamId');
    const tarikh = req.nextUrl.searchParams.get('tarikh');

    const token = cookies().get('token');
    if (!token?.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 500 })
    }
    const decodedToken = decode(token?.value);

    if (!decodedToken?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 500 })
    }

    const resp = await prisma.kolam_booking.findMany({
        where: {
            kolam_id: kolamId ? Number(kolamId) : null,
            tarikh: new Date(tarikh),
            payment_status: {
                in: ['PAID', 'PENDING']
            }
        },
        select: {
            'kolam_id': true,
            'pancangs': {
                select: {
                    'nombor': true
                }
            },
            'tarikh': true,
        }
    })
    const pancangObj = {
    }

    for (let i of resp) {
        for (let p of i?.pancangs) {
            pancangObj[p?.nombor] = true;
        }
    }

    return NextResponse.json({ data: pancangObj });
}