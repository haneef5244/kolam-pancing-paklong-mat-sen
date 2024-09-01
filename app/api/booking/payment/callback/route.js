import { addQueue } from "@/app/backend/helpers/email/queue";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.formData();
    let body = Object.fromEntries(data);

    await addQueue('payment', {
        data: {
            ...body
        }
    })
    return NextResponse.json({});
}