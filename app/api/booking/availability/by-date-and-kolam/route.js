import { getAvailabilityByKolamAndTarikh } from "@/app/backend/actions/bookingAvailability";
import { NextResponse } from "next/server";

export async function GET(req) {
    const date = req?.nextUrl?.searchParams?.get('date');
    const kolam = req?.nextUrl?.searchParams?.get('kolam');

    const data = await getAvailabilityByKolamAndTarikh(Number(kolam), new Date(date));
    return NextResponse.json({ data })
}