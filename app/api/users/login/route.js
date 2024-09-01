import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                username: username || null
            },
            select: {
                'id': true,
                'username': true,
                'password': true,
                'email': true,
                'nama_pertama': true,
                'nama_akhir': true,
                'telefon': true,
                'is_verified': true
            }
        });

        if (user?.username && bcrypt.compare(password, user?.password)) {
            if (!user?.is_verified) {
                return NextResponse.json({ error: 'Sila sahkan akaun anda melalui email.' }, { status: 500 });
            }
            const token = jwt.sign({
                id: user?.id,
                username,
                email: user?.email,
                firstName: user?.nama_pertama,
                lastName: user?.nama_akhir,
                telefon: user?.telefon
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '48h'
                });
            cookies().set('token', token)
            return NextResponse.json({ message: 'Successful' });
        } else {
            return NextResponse.json({ error: 'Invalid username or password.' }, { status: 500 });
        }
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}