import prisma from "@/app/backend/helpers/prisma";
import { broadcastMessage } from "@/app/backend/helpers/pubsub";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const performTransaction = async (bookingId, kolamId) => {
    try {

        console.log('Transaction successful:')
    } catch (e) {
        console.error('Transaction failed:', e.message);
    }
}

export async function POST(req) {
    try {
        const {
            bookingId,
            pancangs, //arr
            tarikh,
            kolamId,
        } = await req.json();


        const createdBooking = await prisma.kolam_booking.findFirst({
            where: {
                kolam_id: kolamId || null,
                pancangs: {
                    some: {
                        nombor: {
                            in: pancangs
                        }
                    }
                },
                tarikh: tarikh || null,
                payment_status: {
                    in: ['PENDING', 'PAID']
                },
                is_deleted: false,
            },
            select: {
                'id': true,
            },
        })
        // booking already made, cancel this
        if (createdBooking?.id) {
            await broadcastMessage('bookingNotification', [{
                notificationId: bookingId?.toString(),
                message: {
                    status: 500,
                    error: 'Maaf, pengguna lain telah membuat booking untuk pancang ini.'
                }
            }])
        } else {
            await performTransaction(bookingId, kolamId);
        }

        return NextResponse.json({ message: 'Successfully executed queue.' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }

}