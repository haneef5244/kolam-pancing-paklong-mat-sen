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
            'kolam_booking_kolams': {
                select: {
                    'kolam_booking_pancang': {
                        'select': {
                            'value': true,
                        }
                    },
                    'kolam_id': true,
                },
                where: {
                    is_deleted: false
                }
            },
            'tarikh': true,
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
        for (let x of i?.kolam_booking_kolams) {
            nombors.push(x?.kolam_booking_pancang?.value)
        }
    }
    const updatedBookingAvailabilities = await prisma.booking_availability.updateMany({
        where: {
            OR: dueBills?.map(e => ({
                OR: e?.kolam_booking_kolams?.map(s => ({
                    'kolam_id': Number(s?.kolam_id),
                    pancang: {
                        value: s?.kolam_booking_pancang?.value
                    }
                })),
                tarikh: moment(e?.tarikh).toISOString(),
                is_available: false,
            }))
        },
        data: {
            is_available: true
        }
    })
    return NextResponse.json({ data: dueBills, datePast: moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss') })
}