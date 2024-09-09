import prisma from "@/app/backend/helpers/prisma";
import { broadcastMessage } from "@/app/backend/helpers/pubsub";
import { NextResponse } from "next/server";
import { getVerifiedPayment } from "../route";
import CryptoJS from 'crypto-js'
import QRCode from 'qrcode';
import { addQueue } from "@/app/backend/helpers/email/queue";
import { getBlobSasUrl, uploadBase64Image, uploadBase64ImageToBlob } from "@/app/backend/helpers/blob";
import moment from "moment";

export async function POST(req) {
    try {
        const body = await req.json();

        const booking = await prisma.kolam_booking.update({
            where: {
                id: body.order_id ? Number(body.order_id) : null,
                payment: {
                    bill_code: body?.billcode,
                },
                is_deleted: false,
            },
            data: {
                payment_status: body?.status == 1 ? 'PAID' : body?.status == '3' ? 'CANCELLED' : 'PENDING',
                payment: {
                    update: {
                        where: {
                            kolam_booking_id: body.order_id ? Number(body.order_id) : null,
                            bill_code: body?.billcode || null,
                        },
                        data: {
                            fpx_transaction_id: body?.fpx_transaction_id,
                            status: body?.status,
                            reason: body?.reason,
                            ref_no: body?.refno,
                            transaction_id: body?.transaction_id,
                            transaction_time: new Date(body?.transaction_time),
                        },
                    },
                },
            },
            select: {
                'payment_status': true,
                'kolam_id': true,
                'payment': {
                    select: {
                        'status': true,
                        'reason': true,
                        'fpx_transaction_id': true,
                        'transaction_time': true,
                        'ref_no': true,
                    }
                },
                'user': {
                    select: {
                        'id': true,
                        'email': true,
                        'nama_pertama': true,
                        'nama_akhir': true,
                    }
                },
                'amount': true,
                'add_ons': true,
                'pancangs': true,
                'tarikh': true,
            }
        });
        if (body?.status == 1) {
            const qrBlobName = `${booking?.user?.id}-${body.order_id}-${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}.png`

            const updateQrFile = await prisma.kolam_booking.update({
                where: {
                    id: body.order_id ? Number(body.order_id) : null,
                    payment: {
                        bill_code: body?.billcode,
                    },
                    is_deleted: false,
                },
                data: {
                    qr_link_file_name: qrBlobName
                }
            })

            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({
                bookingId: Number(body?.order_id),
            }), process.env.QR_SECRET_KEY).toString();

            const qrCodeImage = await QRCode.toDataURL(encryptedData);
            await uploadBase64ImageToBlob(qrBlobName, 'payment-qr', qrCodeImage);
            const sasUrl = getBlobSasUrl(qrBlobName, 'payment-qr', moment(booking?.tarikh).add(3, 'day').endOf('day'))
            let paymentInfo = []

            paymentInfo.push({
                item: 'Pancang',
                bilangan: booking?.pancangs?.length,
                nota: booking?.pancangs?.map(p => `Pancang ${p?.nombor}`).join(','),
                amaun: `RM ${booking?.pancangs?.length * 90}`
            })
            if (booking?.add_ons?.length) {
                for (let ao of booking?.add_ons) {
                    paymentInfo.push({
                        item: ao?.type == 'AIR_MINERAL' ? 'Air Mineral' : '',
                        bilangan: ao?.quantity,
                        amaun: `RM ${ao?.type == 'AIR_MINERAL' ? 2 * ao?.quantity : 0}`
                    })
                }
            }
            await addQueue('email', {
                data: {
                    senderAddress: process.env.AZURE_SENDER_ADDRESS,
                    recipients: {
                        to: [{ address: booking?.user?.email }]
                    },
                    emailSubject: '[Kolam Pancing Paklong Mat Sen] Booking Berjaya!',
                    props: {
                        namaPertama: booking?.user?.nama_pertama,
                        tarikhPancing: moment(booking?.tarikh).format('Do MMMM YYYY'),
                        kolamId: booking?.kolam_id,
                        paymentInfo,
                        qrCodeImage: sasUrl
                    },
                    type: 'booking-successful'
                }
            })
        } else if (body?.status == 3) {
            await prisma.booking_availability.updateMany({
                where: {
                    pancang: {
                        value: {
                            in: booking?.pancangs?.map(e => e?.nombor)
                        }
                    },
                    tarikh: new Date(booking?.tarikh),
                    kolam_id: Number(booking?.kolam_id),
                },
                data: {
                    is_available: true
                }
            });
        }

        return NextResponse.json({ message: 'Successful' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}