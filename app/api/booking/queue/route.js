import { addQueue } from "@/app/backend/helpers/email/queue";
import prisma from "@/app/backend/helpers/prisma";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {
            bookingId,
        } = await req.json();

        const token = cookies().get('token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized', }, { status: 401 })
        }
        const userId = decode(token?.value)?.id;

        const resp = await prisma.kolam_booking.findFirst({
            where: {
                id: bookingId || null,
                user_id: userId || null,
                is_deleted: false
            },
            select: {
                'id': true,
                'tarikh': true,
                'pancangs': true,
                'kolam_id': true,
            }
        });
        if (resp?.id) {
            await addQueue('booking', {
                data: {
                    bookingId,
                    pancangs: resp?.pancangs?.map(e => e.nombor),
                    tarikh: resp?.tarikh,
                    kolamId: resp?.kolam_id
                }
            })
            return NextResponse.json({ message: 'Booking submitted' })
        }
        return NextResponse.json({ error: 'Booking not found!' }, { status: 500 })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }


}