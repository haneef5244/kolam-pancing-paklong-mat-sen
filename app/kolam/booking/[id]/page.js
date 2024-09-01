import { getBooking } from '@/app/api/booking/route';
import { getPubSubToken } from '@/app/backend/helpers/pubsub';
import { BookingComponent } from '@/app/frontend/components/booking';
import { cookies } from 'next/headers';
import React from 'react';

const Booking = async (props) => {
    const { params } = props;

    const { id } = params;

    const { data, token } = await getData(id);

    return <BookingComponent data={data} token={token} bookingId={id} />
}

const getData = async (id) => {
    const userToken = cookies().get('token')?.value;

    const token = await getPubSubToken('bookingNotification', Number(id))
    const data = await getBooking(Number(id))
    return {
        token,
        data
    }
}

export default Booking