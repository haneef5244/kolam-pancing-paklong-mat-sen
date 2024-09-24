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
            const unavailableSlots = await prisma.booking_availability.findMany({
                where: {
                    tarikh: tarikhPancing,
                    is_available: false,
                    pancang: {
                        'value': {
                            in: pancang
                        }
                    }
                },
                select: {
                    'pancang': {
                        select: {
                            'value': true,
                            'id': true,
                        }
                    },
                    'kolam_id': true,
                }
            })
            if (unavailableSlots?.length) {
                return NextResponse.json({ error: `Maaf, pancang ${unavailableSlots?.map(e => e?.pancang?.value).join(', ')} telah dipilih oleh pengguna lain.`, unavailableSlots: unavailableSlots?.map(e => e?.pancang?.value) }, { status: 500 })
            }
            const addOnsList = []
            if (addOns?.airMineral) {
                addOnsList.push({
                    type: 'AIR_MINERAL',
                    quantity: addOns?.airMineral
                })
            }
            const slots = await prisma.booking_availability.findMany({
                where: {
                    tarikh: tarikhPancing,
                    is_available: true,
                    pancang: {
                        'value': {
                            in: pancang
                        }
                    }
                },
                select: {
                    'pancang': {
                        select: {
                            'value': true,
                            'id': true,
                        }
                    },
                    'kolam_id': true,
                }
            })

            const resp = await prisma.kolam_booking.create({
                data: {
                    kolam_booking_kolams: {
                        createMany: {
                            data: slots.map(e => ({
                                kolam_id: Number(e?.kolam_id),
                                kolam_booking_pancang_id: Number(e?.pancang?.id)
                            }))
                        }
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


        return NextResponse.json({ message: 'Successfully saved booking!' })
    } catch (e) {
        return NextResponse.json({ error: e.mesage }, { status: 500 })
    }
}