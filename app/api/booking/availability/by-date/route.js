import { NextResponse } from "next/server";
import { getBookingAvailabilityByDate } from "../route";

export async function GET(req) {
    const date = req?.nextUrl?.searchParams?.get('date');

    const data = await getBookingAvailabilityByDate(date);
    return NextResponse.json({ data });
}
