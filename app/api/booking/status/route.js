import { NextResponse } from "next/server";
import { getVerifiedPayment } from "../payment/route";

export async function GET(req) {
    try {
        const bookingId = req.nextUrl.searchParams.get('bookingId');
        const billCode = req.nextUrl.searchParams.get('billCode');

        const resp = await getVerifiedPayment(bookingId, billCode)

        return NextResponse.json({ data: resp });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }

}