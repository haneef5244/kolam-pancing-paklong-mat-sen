import prisma from "@/app/backend/helpers/prisma";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


export async function GET(req) {
    const id = req.nextUrl.searchParams.get('id');

    const resp = await getBooking(Number(id))

    if (!resp) {
        return NextResponse.json({ error: 'Booking not found!' }, { status: 500 })
    }
    return NextResponse.json({ data: resp });
}

export async function getBooking(id) {

    try {
        const token = cookies().get('token');

        if (!token?.value) {
            return null;
        }
        const decodedToken = decode(token?.value);

        const userId = decodedToken?.id

        //jwt.verify(token?.value, process.env.TOKEN_KEY)

        if (!userId) {
            return null;
        }

        const resp = await prisma.kolam_booking.findFirst({
            where: {
                id: id || null,
                is_deleted: false,
                user_id: userId || null
            },
            select: {
                'id': true,
                'pancangs': true,
                'add_ons': true,
                'tarikh': true,
            }
        })
        if (!resp.id) {
            return null;
        }
        return resp;
    } catch (e) {
        console.error(e)
        return null;
    }

}