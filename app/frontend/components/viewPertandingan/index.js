'use client';
import { Alert, Button, Container, Dialog, DialogTitle, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
// import SemuaTangkapanDialog from '../semuaTangkapanDialog';
import Lottie from 'react-lottie';
import Live from '@/app/frontend/lotties/live-text.json';
import { getPublicPubSubToken } from '@/app/backend/actions/pubsubserver';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import { green } from '@mui/material/colors';

export default function ViewPertandingan({ pertandinganId, jenisPertandingan, data = [], tarikhPertandingan }) {
    const [messages, setMessages] = useState(data);
    const [ws, setWs] = useState(null);

    const [snackbarProps, setSnackbarProps] = useState({});


    const [openSemuaTangkapanDialog, setOpenSemuaTangkapanDialog] = useState(false)

    const [isEnded, setIsEnded] = useState(false);
    const [openIsEndedDialog, setOpenIsEndedDialog] = useState(false)


    useEffect(() => {
        const connectToWebPubSub = async (retries = 5, delay = 2000) => {
            try {
                const token = await getPublicPubSubToken(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, `pertandingan_${pertandinganId}`);
                const webSocketUrl = token.url;

                const websocket = new WebSocket(webSocketUrl);
                setWs(websocket);

                // Handle incoming messages
                websocket.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);
                    const parsedData = JSON.parse(messageData);
                    if (parsedData?.data && !isEnded) {
                        setMessages(parsedData?.data);
                    } else if (parsedData?.is_ended) {
                        setIsEnded(true);
                        setOpenIsEndedDialog(true);
                    }
                };

                // Handle WebSocket close
                websocket.onclose = () => {
                    console.log('Connection closed');
                    // Attempt to reconnect
                    if (retries > 0) {
                        console.log(`Retrying connection... (${retries} attempts left)`);
                        setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                    }
                };

                websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    // Optionally handle error and retry
                    if (retries > 0) {
                        console.log(`Retrying connection... (${retries} attempts left)`);
                        setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                    }
                };

            } catch (error) {
                console.error('Connection failed:', error);
                if (retries > 0) {
                    console.log(`Retrying connection... (${retries} attempts left)`);
                    setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                }
            }
        };

        connectToWebPubSub();

        // Cleanup WebSocket connection when component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);


    return <Container maxWidth={'xl'}>
        <Grid container rowSpacing={1} justifyContent={'space-between'} alignItems={'center'} pt={3}>
            <Grid item xs={12}>
                <Alert icon={<Lottie
                    style={{ display: 'flex' }}
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: Live,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice',
                        }
                    }}
                    width={50}
                    isStopped={false}
                    isPaused={false} />} sx={{ display: 'flex', alignItems: 'center' }} variant="filled" >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography sx={{ color: green[100] }} fontWeight={'bold'}>
                                Pertandingan Sedang LIVE
                            </Typography>
                        </Grid>
                    </Grid>
                </Alert>

            </Grid>

            <Grid item xs={12} pb={10}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography fontWeight={'bold'}>No.</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Pancang</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Berat&nbsp;(kg)</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Waktu</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Penimbang</Typography></TableCell>
                            </TableRow>
                            {messages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>Tiada tangkapan setakat ini.</TableCell>
                                </TableRow>
                            )}
                        </TableHead>
                        <TableBody>

                            <TransitionGroup
                                transitionName="fade"
                                transitionEnterTimeout={1000}
                                transitionLeaveTimeout={300}
                                transitionAppearTimeout={1000}
                                transitionAppear={true}
                                component={null}>
                                {messages.map((row, index) => (
                                    <CSSTransition key={row.no} timeout={300} classNames="fade">
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                backgroundColor: index % 2 === 0 ? 'rgba(224, 224, 224, 0.5)' : 'transparent',
                                                '&:hover': { backgroundColor: '#f5f5f5' }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography>{row.no}</Typography>
                                            </TableCell>
                                            <TableCell align="center"><Typography>{row.pancang_value}</Typography></TableCell>
                                            <TableCell align="center"><Typography>{row.berat}</Typography></TableCell>
                                            <TableCell align="center">
                                                <Typography>
                                                    {moment(row.waktu).format('D MMMM YYYY HH:mm A').replace('tengahari', 'PM').replace('pagi', 'AM')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center"><Typography>{row?.timbang?.label}</Typography></TableCell>
                                        </TableRow>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
        <Dialog open={openIsEndedDialog} onClose={() => setOpenIsEndedDialog(false)}>
            <DialogTitle fontWeight={'bold'}>Pertandingan Telah Tamat!</DialogTitle>
        </Dialog>
        {/* <SemuaTangkapanDialog handleClose={() => setOpenSemuaTangkapanDialog(false)} open={openSemuaTangkapanDialog} pertandinganId={pertandinganId} tarikhPertandingan={tarikhPertandingan} jenisPertandingan={jenisPertandingan} /> */}
        {
            snackbarProps?.open ? <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
                <Alert severity={snackbarProps?.severity} variant='filled'>
                    {snackbarProps?.message}
                </Alert>
            </Snackbar> : <></>
        }
    </Container >
}