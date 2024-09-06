
'use client'
import { Alert, Button, Card, CardContent, Chip, Container, Fab, Grid, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import PondLayout from "../pond";
import { useEffect, useState } from "react";
import { getBookingDates } from "../../services/booking";
import moment from "moment";
import Stepper from "../stepper";
import { useRouter } from "next/navigation";

export default function KolamHome() {
    const navigate = useRouter();
    const [dates, setDates] = useState([]);
    useEffect(() => {
        getBookingDates().then(async res => {
            const respJson = await res.json();
            setDates(respJson?.data);
        })
    }, [])

    return (
        <div style={{ minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ pt: 2, pb: 5, }}>
                <Grid container maxWidth={'xl'}>
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={'bold'}>Selamat Datang!</Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Untuk mulakan proses tempahan, sila ikut langkah di bawah</Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Stepper activeIndex={0} />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography fontSize={20}>
                                    Sila pilih tarikh pancing di bawah:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container rowSpacing={2} columnSpacing={2}>
                                    {dates?.map(date => <Grid item xs="auto">
                                        <Button onClick={() => navigate.push(`/kolam-layout/${moment(date.tarikh).format('YYYY-MM-DD')}`)} variant="contained">
                                            {moment(date?.tarikh).format('Do MMM YYYY')}
                                        </Button>
                                    </Grid>)}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>
            </Container>

        </div>


    );
}
