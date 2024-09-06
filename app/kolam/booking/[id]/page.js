
import { BookingComponent } from '@/app/frontend/components/booking';
import React from 'react';

const Booking = async (props) => {
    const { params } = props;

    const { id } = params;

    return <BookingComponent bookingId={id} />
}

export default Booking