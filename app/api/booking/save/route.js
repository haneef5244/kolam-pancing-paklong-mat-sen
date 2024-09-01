import prisma from "@/app/backend/helpers/prisma";
import { broadcastMessage } from "@/app/backend/helpers/pubsub";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const performTransaction = async (bookingId, kolamId) => {
    try {
        const resp = await prisma.$transaction(async (prisma) => {
            const bookingUpdate = await prisma.kolam_booking.findFirst({
                where: {
                    id: bookingId,
                    kolam_id: kolamId || null,
                    is_deleted: false,
                },
                select: {
                    'user_id': true,
                    'user': true,
                    'amount': true,
                }
            })

            const toyyibPayResp = await fetch(`${process.env.TOYYIB_PAY_BASE_URL}${process.env.TOYYIB_PAY_CREATE_BILL_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'userSecretKey': process.env.TOYYIB_PAY_SECRET,
                    'billName': `${bookingUpdate?.user?.nama_pertama} ${bookingUpdate?.user?.nama_akhir}`,
                    'billDescription': 'Booking Invoice - Kolam Pancing Mat Sen',
                    'billPriceSetting': 1,
                    'billAmount': Number(bookingUpdate?.amount) * 100,
                    'billPayorInfo': 0,
                    'billExpiryDate': moment().add(15, 'minutes').format('DD-MM-YYYY HH:mm:ss'),
                    'billEmail': bookingUpdate?.user?.email,
                    'billPhone': bookingUpdate?.user?.telefon,
                    'billPaymentChannel': 2,
                    'categoryCode': process.env.TOYYIB_PAY_BILL_CATEGORY_CODE,
                    'billCallbackUrl': process.env.TOYYIB_PAY_BILL_CALLBACK_URL,
                    'billExternalReferenceNo': bookingId,
                    'billReturnUrl': `${process.env.TOYYIB_PAY_RETURN_URL}/kolam/booking/${bookingId}/payment`,
                    'billChargeToCustomer': 0,
                })
            })
            const toyyibPayToJson = await toyyibPayResp.json();
            if (toyyibPayToJson?.status == 'error') {
                await broadcastMessage('bookingNotification', [{
                    notificationId: bookingId?.toString(),
                    message: {
                        status: 500,
                        error: 'Something went wrong. Please try again later.'
                    }
                }])
                throw new Error(toyyibPayToJson?.msg)
            } else if (bookingUpdate?.user_id) {
                const updateBooking = await prisma.kolam_booking.update({
                    where: {
                        id: bookingId,
                        kolam_id: kolamId || null,
                        is_deleted: false,
                    },
                    data: {
                        payment_status: 'PENDING',
                        payment: {
                            create: {
                                bill_code: toyyibPayToJson?.[0]?.['BillCode']
                            }
                        },
                    },
                    select: {
                        'user_id': true,
                        'user': {
                            select: {
                                'nama_pertama': true,
                                'nama_akhir': true,
                                'email': true,
                            }
                        },
                        'amount': true,
                        'add_ons': true,
                        'pancangs': true,
                        'tarikh': true,
                    }
                })
                await broadcastMessage('bookingNotification', [{
                    notificationId: bookingId?.toString(),
                    message: {
                        status: 200,
                        url: `${process.env.TOYYIB_PAY_BILL_BASE_URL}/${toyyibPayToJson?.[0]?.['BillCode']}`,
                    }
                }])
            }
        })
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


        if (!bookingId) {
            await broadcastMessage('bookingNotification', [{
                notificationId: bookingId?.toString(),
                message: {
                    status: 500,
                    error: 'Booking ini tidak sah.'
                }
            }])
            return NextResponse.json();
        }

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