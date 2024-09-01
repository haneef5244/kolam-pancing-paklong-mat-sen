import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import prisma from "@/app/backend/helpers/prisma";
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            token,
            password
        } = body;

        const verifiedToken = jwt.verify(token, process.env.TOKEN_KEY);

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.findFirst({
            where: {
                forgot_password: token
            },
            select: {
                'id': true
            }
        })
        if (!user?.id) {
            return NextResponse.json({ error: 'Permintaan anda tidak sah!' }, { status: 500 })
        }
        const updatedUser = await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                password: encryptedPassword,
                forgot_password: null,
            },
            select: {
                'id': true
            }
        })
        if (updatedUser?.id) {
            return NextResponse.json({ message: 'Successful' })
        }
    } catch (e) {
        return NextResponse.json({ error: 'Permintaan anda tidak sah!' }, { status: 500 })
    }


}