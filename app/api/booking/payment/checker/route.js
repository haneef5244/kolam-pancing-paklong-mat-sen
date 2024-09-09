export const revalidate = 1; // Revalidate every second

import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req) {
    const dueBills = await prisma.kolam_booking.findMany({
        where: {
            'created_on': {
                lte: moment().subtract(15, 'minutes').toISOString(),
            },
            payment_status: 'PENDING'
        },
        select: {
            'id': true,
            'pancangs': true,
            'tarikh': true,
            'kolam_id': true,
            'created_on': true,
        }
    })
    const updatedKolamBookings = await prisma.kolam_booking.updateMany({
        where: {
            'created_on': {
                lte: moment().subtract(15, 'minutes').toISOString(),
            },
            payment_status: 'PENDING'
        },
        data: {
            payment_status: 'CANCELLED'
        }
    })
    let nombors = []
    for (let i of dueBills) {
        for (let x of i?.pancangs) {
            nombors.push(x.nombor)
        }
    }
    const updatedBookingAvailabilities = await prisma.booking_availability.updateMany({
        where: {
            kolam_id: {
                in: dueBills?.map(e => Number(e?.kolam_id)),
            },
            tarikh: {
                in: dueBills?.map(e => new Date(e?.tarikh)),
            },
            is_available: false,
            pancang: {
                value: {
                    in: nombors
                }
            }
        },
        data: {
            is_available: true
        }
    })
    return NextResponse.json({ data: dueBills, datePast: moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss') })
}