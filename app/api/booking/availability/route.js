import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export const getBookingAvailability = async () => {
    return await prisma.booking_availability.findMany({
        where: {
            tarikh: {
                gte: moment().startOf('day')
            },
        },
        distinct: ['tarikh'],
        select: {
            'tarikh': true
        },
        orderBy: {
            'tarikh': 'asc'
        }
    })
}

export const getBookingAvailabilityByDate = async (date) => {
    return await prisma.booking_availability.findFirst({
        where: {
            tarikh: date
        },
        distinct: ['tarikh'],
        select: {
            'tarikh': true
        },
    })
}

export async function GET() {
    const data = await getBookingAvailability();

    return NextResponse.json({ data });
}