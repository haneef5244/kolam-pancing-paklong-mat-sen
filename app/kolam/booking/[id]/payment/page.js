import { getVerifiedPayment } from '@/app/api/booking/payment/route';
import { getBooking } from '@/app/api/booking/route';
import { getPubSubToken, getPubSubTokenPayment } from '@/app/backend/helpers/pubsub';
import { BookingComponent } from '@/app/frontend/components/booking';
import PaymentComponent from '@/app/frontend/components/payment';
import { cookies } from 'next/headers';
import React from 'react';

const Payment = async (props) => {
    const { params } = props;

    const { id } = params;

    const { searchParams } = props;
    const { billcode } = searchParams
    const data = await getData(id, billcode);

    return <PaymentComponent bookingId={id} billCode={billcode} data={data} />
}

const getData = async (bookingId, billCode) => {
    const data = await getVerifiedPayment(bookingId, billCode);
    return data;
}

export default Payment