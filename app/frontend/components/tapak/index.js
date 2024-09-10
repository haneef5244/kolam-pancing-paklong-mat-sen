'use client';
import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import moment from "moment";
import { useRouter } from 'next/navigation';

const TapakComponent = ({ pertandingan }) => {
    const navigate = useRouter();

    return <Container maxWidth={'xl'}>
        <Box pt={5}>
            <Grid container rowSpacing={2} columnSpacing={2}>
                {pertandingan?.map(p => <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                    <Card sx={{ boxShadow: 0, border: `1px solid ${grey[400]}`, borderRadius: '10px' }}>
                        <CardMedia component={'img'} src={p?.poster_url} />
                        <CardContent>
                            <Grid container rowSpacing={2}>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography fontWeight={'bold'}>Jenis</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {p?.jenis ?? '-'}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography fontWeight={'bold'}>Tarikh</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {moment(p?.tarikh).format("Do MMMM YYYY")}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} textAlign={'center'}>
                                    <Button onClick={() => navigate.push(`/tapak/${moment(p?.tarikh).format('YYYY-MM-DD')}`)} variant="contained" sx={{ textTransform: 'capitalize' }}>
                                        <Typography>Lihat Pancang</Typography>
                                    </Button>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                </Grid>)}
            </Grid>

        </Box>

    </Container>
}

export default TapakComponent;