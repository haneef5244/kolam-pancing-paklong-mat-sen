import { addQueue } from "@/app/backend/helpers/email/queue";
import prisma from "@/app/backend/helpers/prisma";
import { create } from "@mui/material/styles/createTransitions";
import { decode } from "jsonwebtoken";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const token = cookies().get('token');
        if (!token?.value) {
            return NextResponse.json({ message: 'Sila login dahulu.' }, { status: 401 })
        }
        const { username } = decode(token?.value);
        const user = await prisma.user.findFirst({
            where: {
                username: username || null
            },
            select: {
                'id': true
            },

        })
        if (!user.id) {
            return NextResponse.json({ message: 'Akaun tidak wujud.' }, { status: 401 })
        }

        const {
            amount,
            kolam_id, //arr
            pancang, //arr
            addOns,
            tarikhPancing,
        } = await req.json();


        if (amount && kolam_id && pancang?.length && moment(tarikhPancing).isValid()) {
            let pancangs = pancang.map(p => {
                return {
                    nombor: Number(p)
                }
            })
            const createdBooking = await prisma.kolam_booking.findFirst({
                where: {
                    kolam_id: kolam_id || null,
                    pancangs: {
                        some: {
                            nombor: {
                                in: pancang
                            }
                        }
                    },
                    tarikh: tarikhPancing,
                    payment_status: {
                        in: ['PENDING', 'PAID']
                    },
                    is_deleted: false
                },
                select: {
                    'id': true,
                },
            })
            if (createdBooking?.id) {
                return NextResponse.json({ error: 'Maaf, pilihan pancang anda telah dibook oleh user lain.' }, { status: 500 })
            }
            const addOnsList = []
            if (addOns?.minyak) {
                addOnsList.push({
                    type: 'MINYAK',
                    quantity: addOns?.minyak
                })
            }
            if (addOns?.cacing) {
                addOnsList.push({
                    type: 'CACING',
                    quantity: addOns?.cacing
                })
            }


            if (!createdBooking?.id) {
                const resp = await prisma.kolam_booking.create({
                    data: {
                        kolam_id,
                        pancangs: {
                            create: pancangs
                        },
                        add_ons: {
                            create: addOnsList
                        },
                        tarikh: tarikhPancing,
                        user_id: user?.id,
                        amount,
                    },
                    select: {
                        'id': true
                    }
                });

                return NextResponse.json({ message: 'Booking created successfully!', booking: resp?.id })
            }
        }


        return NextResponse.json({ message: 'Successfully saved booking!' })
    } catch (e) {
        return NextResponse.json({ error: e.mesage }, { status: 500 })
    }
}