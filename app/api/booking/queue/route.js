import { addQueue } from "@/app/backend/helpers/email/queue";
import prisma from "@/app/backend/helpers/prisma";
import { Prisma } from "@prisma/client";
import { decode } from "jsonwebtoken";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import momenttz from 'moment-timezone';

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

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ini tidak sah.' }, { status: 500 })
        }

        const booking = await prisma.kolam_booking.findFirst({
            where: {
                id: Number(bookingId),
                is_deleted: false,
                is_checked_in: false,
                user_id: userId,
            },
            select: {
                'kolam_booking_kolams': {
                    'select': {
                        'kolam_id': true,
                        'kolam_booking_pancang': true,
                    }
                },
                'id': true,
                'tarikh': true,
                'amount': true,
                'user_id': true,
                'user': true,
            }
        })

        if (booking?.id) {
            try {
                const toyyibPayUrl = await prisma.$transaction(async txn => {
                    const tarikh = booking.tarikh;

                    const bookingAvailabilityLock = await txn.$executeRaw`
                    SELECT * from booking_availability AS ba
                    JOIN pancang AS p
                        ON ba.pancang_id = p.id
                    WHERE 
                        ${Prisma.join(
                        booking?.kolam_booking_kolams?.map(e => Prisma.sql`(
                                p.value = ${e?.kolam_booking_pancang?.value}
                                AND ba.kolam_id = ${e?.kolam_id}
                                and ba.tarikh = ${tarikh}
                                and ba.is_available = true
                            )`
                        ),
                        ' OR '
                    )}
                    FOR UPDATE`;

                    if (bookingAvailabilityLock == booking?.kolam_booking_kolams?.length) {
                        const malaysiaTime = momenttz.tz("Asia/Kuala_Lumpur");
                        const expiryDate = malaysiaTime.add(15, 'minutes');
                        const toyyibPayResp = await fetch(`${process.env.TOYYIB_PAY_BASE_URL}${process.env.TOYYIB_PAY_CREATE_BILL_URL}`, {
                            method: 'POST',
                            cache: 'no-store',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({
                                'userSecretKey': process.env.TOYYIB_PAY_SECRET,
                                'billName': `${booking?.user?.nama_pertama} ${booking?.user?.nama_akhir}`,
                                'billDescription': 'Booking Invoice - Kolam Pancing Mat Sen',
                                'billPriceSetting': 1,
                                'billAmount': Number(booking?.amount) * 100,
                                'billPayorInfo': 0,
                                'billExpiryDate': expiryDate.format('DD-MM-YYYY HH:mm:ss'),
                                'billEmail': booking?.user?.email,
                                'billPhone': booking?.user?.telefon,
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
                            throw new Error(toyyibPayToJson?.msg)
                        }
                        await txn.kolam_booking.update({
                            where: {
                                id: Number(booking?.id),
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
                                'tarikh': true,
                            }
                        })
                        const updatedBookingAvailability = await txn.booking_availability.updateMany({
                            where: {
                                OR: booking?.kolam_booking_kolams?.map(e => ({
                                    pancang_id: Number(e?.kolam_booking_pancang?.id),
                                    kolam_id: Number(e?.kolam_id)
                                })),
                                tarikh: booking?.tarikh
                            },
                            data: {
                                is_available: false,
                            }
                        })
                        return `${process.env.TOYYIB_PAY_BILL_BASE_URL}/${toyyibPayToJson?.[0]?.['BillCode']}`;
                        // also update booking_Availability
                    } else if (bookingAvailabilityLock == 0) {
                        throw new Error('Maaf, pancang yang anda pilih telah ditempah oleh pengguna lain. Sila pilih pancang lain.')
                    } else {
                        throw new Error('Maaf, beberapa pancang yang pilih telah ditempah oleh pengguna lain. Sila pilih pancang lain.')
                    }
                })

                if (toyyibPayUrl) {
                    return NextResponse.json({ url: toyyibPayUrl })
                }
            } catch (e) {
                return NextResponse.json({ error: e?.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Tempahan ini tak sah!' }, { status: 500 })
        }

    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }


}