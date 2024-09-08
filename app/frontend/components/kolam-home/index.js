
'use client'
import { Alert, Button, Card, CardContent, CardMedia, Chip, Container, Fab, Grid, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import PondLayout from "../pond";
import { useEffect, useState } from "react";
import { getBookingDates } from "../../services/booking";
import moment from "moment";
import Stepper from "../stepper";
import { useRouter } from "next/navigation";
import { grey } from "@mui/material/colors";

export default function KolamHome({ data }) {
    const navigate = useRouter();
    const [dates, setDates] = useState(data);

    return (
        <div style={{ minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ pt: 2, pb: 5, }}>
                <Grid container maxWidth={'xl'}>
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={'bold'}>Selamat Datang!</Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Typography fontWeight={'bold'}>Untuk mulakan proses tempahan, sila ikut langkah di bawah</Typography>
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
                                    {dates?.map(date => <Grid item xs="12" sm={6} lg={4} xl={3}>
                                        <Card sx={{ border: `1px solid ${grey[300]}`, boxShadow: 'none' }}>
                                            <CardMedia component={"img"} src={date?.poster_url} />
                                            <CardContent sx={{ border: 'none' }}>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Grid container>
                                                            <Grid item xs="12">
                                                                <Typography>Tarikh Pertandingan:</Typography>
                                                            </Grid>
                                                            <Grid item xs="12">
                                                                <Typography fontWeight={'bold'}>{moment(date?.tarikh).format('Do MMM YYYY')}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Grid container>
                                                            <Grid item xs="12">
                                                                <Typography>Jenis Pertandingan:</Typography>
                                                            </Grid>
                                                            <Grid item xs="12">
                                                                <Typography fontWeight={'bold'}>{date?.jenis}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} pt={2} textAlign={'center'}>
                                                        <Button onClick={() => navigate.push(`/kolam-layout/${moment(date.tarikh).format('YYYY-MM-DD')}`)} variant="contained">
                                                            <Typography textTransform={'capitalize'}>Pilih Pertandingan Ini</Typography>
                                                        </Button>
                                                    </Grid>
                                                </Grid>

                                            </CardContent>
                                        </Card>


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
