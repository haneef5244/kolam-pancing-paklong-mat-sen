import prisma from "@/app/backend/helpers/prisma";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    const token = cookies().get('token')


    return NextResponse.json({})
}

export async function getVerifiedPayment(bookingId, billCode) {

    const token = cookies().get('token')
    if (!token?.value) {
        throw new Error('Invalid payment!')
    }
    const decodedToken = decode(token?.value);

    const userId = decodedToken?.id;

    if (!userId) {
        throw new Error('Invalid payment!')
    }

    const resp = await prisma.kolam_booking.findFirst({
        where: {
            id: bookingId ? Number(bookingId) : null,
            payment: {
                bill_code: billCode || null,
            },
            user_id: userId || null,
        },
        select: {
            'payment_status': true,
            'payment': {
                select: {
                    'status': true,
                    'reason': true,
                    'fpx_transaction_id': true,
                    'transaction_time': true,
                    'ref_no': true,
                }
            }
        }
    })
    return resp;
}
