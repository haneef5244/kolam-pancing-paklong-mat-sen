import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const token = req.nextUrl.searchParams.get('token');

        const decodedToken = jwt.decode(token)
        const user = await prisma.user.update({
            where: {
                verification_token: token,
                email: decodedToken?.email,
                username: decodedToken?.username,
            },
            data: {
                is_verified: true
            }
        })

        if (user.id) {
            return NextResponse.json({ message: 'Successful!' });
        } else {
            return NextResponse.json({ error: 'Invalid operation.' }, { status: 500 })
        }
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}