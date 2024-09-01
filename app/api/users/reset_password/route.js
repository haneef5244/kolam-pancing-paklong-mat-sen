import { addQueue } from "@/app/backend/helpers/email/queue";
import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const body = await req.json();

    if (body?.email) {

        const user = await prisma.user.findFirst({
            where: {
                email: body?.email || null
            },
            select: {
                'id': true,
                'nama_pertama': true,
            }
        })

        if (user?.id) {
            const hashed = await bcrypt.hash(JSON.stringify({ email: body?.email, id: user?.id }), 10);
            const forgotPasswordToken = jwt.sign({
                hashed,
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '48h',
                });
            await prisma.user.update({
                where: {
                    email: body?.email || null
                },
                data: {
                    forgot_password: forgotPasswordToken,
                },
                select: {
                    'id': true,
                    'nama_pertama': true,
                }
            })
            await addQueue('email', {
                data: {
                    senderAddress: process.env.AZURE_SENDER_ADDRESS,
                    recipients: {
                        to: [{ address: body?.email }]
                    },
                    emailSubject: '[Kolam Pancing Paklong Mat Sen] Reset Katalaluan Anda',
                    namaPertama: user?.nama_pertama,
                    type: 'forgot-password',
                    verificationUrl: `${process.env.KOLAM_MAT_SEN_URL}/user/forgot-password/${forgotPasswordToken}`
                }
            })
            return NextResponse.json({ message: 'Successful!' });
        } else {
            return NextResponse.json({ error: 'Email tidak wujud.' }, { status: 500 })
        }
    }
}

export const validateForgotPasswordToken = async token => {
    try {
        if (!token) {
            return false;
        }
        jwt.verify(token, process.env.TOKEN_KEY);
        const user = await prisma.user.findFirst({
            where: {
                forgot_password: token || null,
            },
            select: {
                'id': true,
                'email': true,
                'nama_pertama': true
            }
        });
        if (user?.id) {
            return true
        }
        return false;

    } catch (e) {
        return false;
    }


}