'use client';
import React from 'react';
import { Info } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { cyan, green, grey, red } from "@mui/material/colors";
import ScrollDown from '@/app/frontend/lotties/scroll-down.json';
import Lottie from 'react-lottie';
import './index.css';

const TapakTarikhKolamComponent = props => {
    const { leftItems, rightItems } = props;

    const renderButtons = (buttons) => {

        return <Grid container flexDirection={'row'} alignItems={'space-between'} height={'100%'}>
            {buttons.map((button, i) => <Grid item xs={12} width={'100%'}>
                <Button
                    key={button?.pancang?.value}
                    disabled={!button?.is_available || !button?.pancang?.is_available}
                    className={`pond-button ${!button?.is_available || !button?.pancang?.is_available ? 'not-available' : 'available'}`}
                    sx={{
                        width: '64px',
                        ':disabled': {
                            color: grey[300]
                        }
                    }}
                >
                    {button?.pancang?.value}
                </Button>
            </Grid>)}
        </Grid>
    };

    return <Container maxWidth={"lg"} sx={{ mt: 2 }}>
        <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Grid item xs={12}>
                <Typography variant='h6'>
                    Untuk lakukan tempahan melalui talian, sila cipta akaun dan log masuk
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                    <Grid item xs={'auto'}>
                        <Grid container columnSpacing={1}>
                            <Grid item xs='auto'>
                                <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: green[600] }}></div>
                            </Grid>
                            <Grid item xs='auto'>
                                <Typography fontWeight={600}>Masih Terbuka</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Grid container columnSpacing={1}>
                            <Grid item xs='auto'>
                                <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: red[600] }}></div>
                            </Grid>
                            <Grid item xs='auto'>
                                <Typography fontWeight={600}>Sudah Diambil</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>

                <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={7} mt={3}
                        sx={{
                            height: {
                                xs: '40vh',
                                md: '70vh'
                            },
                            overflowY: {
                                xs: 'scroll !important',
                                md: 'scroll !important'
                            }
                        }}
                    >
                        <div style={{ display: 'flex', columnGap: 4 }}>
                            <div style={{ width: '64px' }}>
                                {renderButtons(leftItems)}
                            </div>
                            <div style={{ position: 'relative', width: '-webkit-fill-available' }}>


                                <div className="pond" style={{ position: 'relative', height: '100%' }}>
                                    <div style={{ position: 'sticky', top: '0%', left: '50%' }}>
                                        <Container>
                                            <Button fullWidth></Button>
                                        </Container>
                                    </div>
                                    <div style={{ position: 'sticky', left: '50%' }}>
                                        <Lottie options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: ScrollDown,
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice',
                                            }
                                        }}
                                            height={100}
                                            width={100}
                                            isStopped={false}
                                            isPaused={false} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '64px', alignItems: 'end' }}>
                                {renderButtons(rightItems)}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
}

export default TapakTarikhKolamComponent;