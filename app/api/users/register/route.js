import { generateErrorMessage } from "@/app/backend/constants/prisma/errorMessages";
import { addQueue } from "@/app/backend/helpers/email/queue";
import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const body = await req.json();

        const { username, password, nama_pertama, email, telefon } = body;

        const encryptedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({
            username,
            email,
        },
            process.env.TOKEN_KEY,
            {
                expiresIn: '48h'
            }
        );

        const resp = await prisma.user.create({
            data: {
                ...body,
                password: encryptedPassword,
                verification_token: verificationToken
            }
        })
        if (resp?.id) {
            await addQueue('email', {
                data: {
                    senderAddress: process.env.AZURE_SENDER_ADDRESS,
                    recipients: {
                        to: [{ address: email }]
                    },
                    emailSubject: '[Kolam Pancing Paklong Mat Sen] Verifikasi Email',
                    namaPertama: nama_pertama,
                    type: 'registration-verification',
                    verificationUrl: `${process.env.KOLAM_MAT_SEN_URL}/verification/${verificationToken}`,

                }
            })
            return NextResponse.json({ message: 'Successful!' })
        }

    } catch (e) {
        if (e.name == 'PrismaClientKnownRequestError') {
            return NextResponse.json({ error: generateErrorMessage(e?.code, e?.meta?.target?.[0]) }, { status: 500 });
        }
        return NextResponse.json({ error: e?.message }, { status: 500 });
    }


}