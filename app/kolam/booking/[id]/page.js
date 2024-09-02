import { getBooking } from '@/app/api/booking/route';
import { getPubSubToken } from '@/app/backend/helpers/pubsub';
import { BookingComponent } from '@/app/frontend/components/booking';
import { cookies } from 'next/headers';
import React from 'react';

const Booking = async (props) => {
    const { params } = props;

    const { id } = params;

    const { data } = await getData(id);

    return <BookingComponent data={data} bookingId={id} />
}

const getData = async (id) => {
    const userToken = cookies().get('token')?.value;

    const data = await getBooking(Number(id))
    return {
        data
    }
}

export default Booking