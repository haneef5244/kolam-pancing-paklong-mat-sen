'use client';
import { Button, Chip, Container, Grid, Typography } from '@mui/material';
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

    const [minyak, setMinyak] = useState({});
    const [cacing, setCacing] = useState({});

    const { data, bookingId, token } = props;
    if (!data) {
        navigate.push('/')
    }

    const [loadingButton, setLoadingButton] = useState(false);

    useEffect(() => {
        const header = document.getElementById('header');
        setHeaderHeight(header?.scrollHeight);
        let totalCost = 0
        for (let p of data?.pancangs) {
            totalCost += 120
        }
        for (let ao of data?.add_ons) {
            if (ao?.type == 'MINYAK') {
                totalCost += 10 * ao?.quantity
            } else if (ao?.type == 'CACING') {
                totalCost += 10 * ao?.quantity
            }
        }
        setJumlah(totalCost)
        const minyakObj = data?.add_ons?.filter(e => e?.type == 'MINYAK');
        if (minyakObj?.length) {
            setMinyak(minyakObj?.[0])
        }
        const cacingObj = data?.add_ons?.filter(e => e?.type == 'CACING');
        if (minyakObj?.length) {
            setCacing(cacingObj?.[0])
        }
    }, [])

    useEffect(() => {
        if (token && token?.token && !client) {
            client = new W3CWebSocket(token?.token);
            client.onopen = () => {
                console.log('WebSocket Client Connected 2');
            };

            client.onmessage = (res) => {
                let resp = JSON.parse(res.data)
                if (resp?.status == 500) {
                    alert(resp?.error)
                } else if (resp?.status == 200) {
                    window.location.href = resp?.url;
                }
            };
        }
    }, [token])

    const handleProceedBooking = async () => {
        setLoadingButton(true);
        const resp = await queue({
            bookingId: Number(bookingId)
        });


    }

    return <Container maxWidth={'sm'} sx={{ minHeight: `calc(100vh - ${headerHeight}px)`, display: 'flex', alignItems: 'center' }} >
        <Grid container sx={{ margin: '0 auto', alignContent: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${grey[400]}`, padding: { xs: 3, md: 10 } }} >
            <Grid item xs={12}>
                <Stepper activeIndex={2} />
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

            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} pt={2}>
                        <Grid container>
                            {cacing?.type ?
                                <Grid item xs={9}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography>Cacing x {cacing?.quantity}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid> : <></>}
                            {cacing?.type ? <Grid item xs={3} >
                                <Typography fontWeight={'bold'}>
                                    RM {cacing?.quantity * 10}
                                </Typography>
                            </Grid> : <></>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            <Grid item xs={12} pt={2}>
                <Grid container>
                    {minyak?.type ?
                        <Grid item xs={9}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography>Minyak x {minyak?.quantity}</Typography>
                                </Grid>
                            </Grid>
                        </Grid> : <></>}
                    {minyak?.type ? <Grid item xs={3} >
                        <Typography fontWeight={'bold'}>
                            RM {minyak?.quantity * 10}
                        </Typography>
                    </Grid> : <></>}
                </Grid>
            </Grid>
            <Grid item xs={12} pt={2} textAlign={'end'}>
                <LoadingButton loading={loadingButton} sx={{ textTransform: 'capitalize' }} onClick={() => handleProceedBooking()} variant='contained'><Typography>Buat bayaran</Typography></LoadingButton>
            </Grid>
        </Grid >
    </Container >
}