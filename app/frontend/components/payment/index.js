'use client';
import { Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { getBookingStatus } from '../../services/booking';
import Stepper from '../stepper';

const PaymentComponent = (props) => {
    const { bookingId, billCode } = props;

    const [data, setData] = useState();


    const refreshPaymentStatus = () => {
        getBookingStatus(bookingId, billCode).then(async res => {
            const resJson = await res.json();
            if (resJson?.data?.payment_status == 'PENDING') {
                setTimeout(() => {
                    refreshPaymentStatus()
                }, 3000)
            } else {
                setData(resJson?.data)
            }
        })
    }
    useEffect(() => {
        refreshPaymentStatus();
    }, [])


    const generatePaymentCard = () => {
        return <Grid container rowSpacing={2} pt={5}>
            <Grid item xs={12}>
                <Typography fontWeight={'bold'} variant='h6'>
                    Ref No:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    {data?.payment?.ref_no}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography fontWeight={'bold'} variant='h6'>
                    Transaction time:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    {data?.payment?.transaction_time}
                </Typography>
            </Grid>
            <Grid item xs={12} pt={1}>
                <Typography fontWeight={'bold'} variant='h6'>
                    {data?.payment?.reason}
                </Typography>
            </Grid>
        </Grid>
    }

    const generateContent = () => {
        if (data?.payment_status == 'CANCELLED') {
            return <Grid container columnSpacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <Grid item xs="12" textAlign={'center'}>
                    <img src='/images/payment_fail.png' style={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs="12">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant='h5' fontWeight={'bold'}>Oooopss..</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography fontSize={20} fontWeight={100}>
                                Pembayaran anda telah gagal.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {generatePaymentCard()}
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        } else if (data?.payment_status == 'PAID') {
            return <Grid container columnSpacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs="12" textAlign={'center'}>
                    <img src='/images/payment_success.png' style={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs="12">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant='h5' fontWeight={'bold'}>Berjaya..!</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography fontSize={20} fontWeight={100}>
                                Pembayaran anda telah berjaya.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {generatePaymentCard()}
                        </Grid>
                        <Grid item xs={12} pt={2}>
                            <Typography variant='h6' fontWeight={'bold'}>Kami telah menghantar QR code anda kepada email anda. Sila pastikan anda bawa QR code tersebut pada hari memancing untuk pengesahan. Terima kasih!</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        } else {
            return <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                <Grid item xs={'12'}>
                    <CircularProgress />
                </Grid>
                <Grid item xs={'12'}>
                    <Typography variant="h5">
                        Sila tunggu sebentar...
                    </Typography>
                </Grid>
            </Grid>
        }
    }

    return <Container maxWidth={'xl'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <Grid container rowSpacing={2} pt={2}>
            <Grid item xs={12}>
                <Card sx={{ boxShadow: 0, border: `1px solid ${grey[400]}`, paddingTop: 5, paddingBottom: 5, paddingLeft: 2, pr: 2 }}>
                    <CardContent sx={{}} >
                        {generateContent()}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    </Container>
}

export default PaymentComponent;