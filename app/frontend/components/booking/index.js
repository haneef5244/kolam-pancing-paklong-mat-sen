'use client';
import { Alert, Button, Chip, Container, Grid, Snackbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import { queue } from '../../services/booking';
import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Stepper from '../stepper';
import { LoadingButton } from '@mui/lab';

let client = null;

export const BookingComponent = props => {
    const navigate = useRouter();

    const [jumlah, setJumlah] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const [airMineral, setAirMineral] = useState({});


    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { bookingId } = props;

    const [data, setData] = useState({});


    const [loadingButton, setLoadingButton] = useState(false);

    useEffect(() => {
        fetch(`/api/booking?id=${bookingId}`).then(async res => {
            const message = await res.json();
            if (!message?.data) {
                navigate.push('/');
            } else {
                const header = document.getElementById('header');
                setHeaderHeight(header?.scrollHeight);
                let totalCost = 0
                for (let p of message?.data?.pancangs) {
                    totalCost += 120
                }
                for (let ao of message?.data?.add_ons) {
                    if (ao?.type == 'AIR_MINERAL') {
                        totalCost += 2 * ao?.quantity
                    }
                }
                setJumlah(totalCost)

                const airMineralObj = message?.data?.add_ons?.filter(e => e?.type == 'AIR_MINERAL');
                if (airMineralObj?.length) {
                    setAirMineral(airMineralObj?.[0])
                }
                setData(message.data);
            }

        })

    }, [])

    const handleProceedBooking = async () => {
        setLoadingButton(true);
        const resp = await queue({
            bookingId: Number(bookingId)
        });
        const message = await resp.json();
        if (resp?.ok) {
            window.location.href = message?.url;
        } else {
            setErrorMessage(message?.error)
            setOpenError(true);
            setLoadingButton(false)
        }
    }

    return <Container maxWidth={'sm'} sx={{ minHeight: `calc(100vh - ${headerHeight}px)`, display: 'flex', alignItems: 'center' }} >
        <Grid container sx={{ margin: '0 auto', alignContent: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${grey[400]}`, padding: { xs: 3, md: 10 } }} >
            <Grid item xs={12}>
                <Stepper activeIndex={3} />
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            Jumlah Keseluruhan
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant='h5' fontWeight={'bold'}>
                            RM {jumlah}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Grid container>
                            <Grid item xs={9}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography>Pancang x {data?.pancangs?.length}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container rowSpacing={1} columnSpacing={1}>
                                            {data?.pancangs?.map(e => <Grid item xs='auto'>
                                                <Chip label={e?.nombor} />
                                            </Grid>)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} >
                                <Typography fontWeight={'bold'}>
                                    RM {data?.pancangs?.length * 120}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} pt={2}>
                <Grid container>
                    {airMineral?.type ?
                        <Grid item xs={9}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography>Air Mineral x {airMineral?.quantity}</Typography>
                                </Grid>
                            </Grid>
                        </Grid> : <></>}
                    {airMineral?.type ? <Grid item xs={3} >
                        <Typography fontWeight={'bold'}>
                            RM {airMineral?.quantity * 2}
                        </Typography>
                    </Grid> : <></>}
                </Grid>
            </Grid>
            <Grid item xs={12} pt={2} textAlign={'end'}>
                <LoadingButton loading={loadingButton} sx={{ textTransform: 'capitalize' }} onClick={() => handleProceedBooking()} variant='contained'><Typography>Buat bayaran</Typography></LoadingButton>
            </Grid>
        </Grid >
        <Snackbar open={openError} onClose={() => setOpenError(false)} autoHideDuration={5000}>
            <Alert severity='error' variant='filled'>{errorMessage}</Alert>
        </Snackbar>
    </Container >
}