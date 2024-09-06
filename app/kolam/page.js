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

    if (moment(tarikh).startOf('day').isSameOrAfter(moment().startOf('day'))
        && moment(tarikh).isValid()
        && kolam
    ) {
        return <div>
            <KolamComponent tarikh={tarikh} kolamId={kolam} />
        </div>
    } else {
        redirect('/', 'push')
    }
}

export default Kolam;