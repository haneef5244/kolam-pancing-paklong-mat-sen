import KolamComponent from '@/app/frontend/components/kolam';
import { Phishing } from '@mui/icons-material';
import { Fab } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { getAvailabilityByKolamAndTarikh } from '../backend/actions/bookingAvailability';
import { redirect } from 'next/navigation';

const Kolam = async (props) => {
    const { searchParams } = props;
    const { kolam, tarikh } = searchParams;

    let data = []
    if (moment(tarikh).startOf('day').isSameOrAfter(moment().startOf('day'))
        && moment(tarikh).isValid()
        && kolam
    ) {
        data = await getAvailabilityByKolamAndTarikh(Number(kolam), new Date(tarikh));
        console.log(data)
    }

    if (!data?.length) {
        return redirect('/', 'push')
    }

    const left = data?.filter(e => e?.pancang?.is_left)?.sort((a, b) => {
        // Extract and convert the numeric parts of the pancang.value properties
        const numA = parseInt(a.pancang.value.slice(1), 10);
        const numB = parseInt(b.pancang.value.slice(1), 10);

        // Compare the numeric values
        return numA - numB;
    });
    const right = data?.filter(e => e?.pancang?.is_right)?.sort((a, b) => {
        // Extract and convert the numeric parts of the pancang.value properties
        const numA = parseInt(a.pancang.value.slice(1), 10);
        const numB = parseInt(b.pancang.value.slice(1), 10);

        // Compare the numeric values
        return numA - numB;
    });

    return <div>
        <KolamComponent tarikh={tarikh} kolamId={kolam} left={left} right={right} />
    </div>
}

export default Kolam;