import prisma from "@/app/backend/helpers/prisma";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function GET(req) {
    const data = await getUserBookings();
    return NextResponse.json({ data });
}

export const getUserBookings = async () => {
    const token = cookies().get('token');

    if (!token?.value) {
        throw new Error('Invalid user!')
    }
    const decodedToken = decode(token?.value)

    if (!decodedToken?.id) {
        throw new Error('Invalid user!')
    }

    return prisma.kolam_booking.findMany({
        where: {
            user_id: decodedToken.id || null,
            payment_status: {
                in: ['PAID', 'PENDING', 'CANCELLED']
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
            'payment_status': true,
            'add_ons': {
                select: {
                    'type': true,
                    'quantity': true
                }
            },
            'created_on': true,
            'amount': true,
            'payment': {
                select: {
                    'ref_no': true
                }
            },
            'id': true,
        },
        orderBy: {
            'tarikh': 'desc'
        }
    })
}