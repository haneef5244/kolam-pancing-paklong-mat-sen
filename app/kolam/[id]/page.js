import KolamComponent from '@/app/frontend/components/kolam';
import { Phishing } from '@mui/icons-material';
import { Fab } from '@mui/material';
import moment from 'moment';
import React from 'react';

const Kolam = (props) => {
    const { params } = props;

    let leftStart = 0
    let leftEnd = 0
    let rightStart = 0
    let rightEnd = 0

    if (params.id == 1) {
        leftStart = 146
        leftEnd = 283
        rightStart = 1
        rightEnd = 145
    } else if (params.id == 2) {
        leftStart = 284
        leftEnd = 595
        rightStart = 596
        rightEnd = 915
    } else if (params.id == 3) {
        leftStart = 916
        leftEnd = 1230
        rightStart = 1231
        rightEnd = 1546
    }
    const tarikh = moment().day('Saturday').format('YYYY-MM-DD');

    return <div>
        <KolamComponent tarikh={tarikh} kolamId={params.id} leftStart={leftStart} leftEnd={leftEnd} rightStart={rightStart} rightEnd={rightEnd} />
    </div>
}

export default Kolam;