'use client';
import { Alert, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import { green } from '@mui/material/colors';

export default function ViewPertandinganTamat({ pertandinganId, jenisPertandingan, data = [], tarikhPertandingan }) {
    const [messages, setMessages] = useState(data);

    return <Container maxWidth={'xl'}>
        <Grid container rowSpacing={1} justifyContent={'space-between'} alignItems={'center'} pt={3}>
            <Grid item xs={12}>
                <Alert sx={{ display: 'flex', alignItems: 'center' }} variant="filled" >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography sx={{ color: green[100] }} fontWeight={'bold'}>
                                Keputusan Pertandingan {jenisPertandingan} - {moment(tarikhPertandingan).format('D MMM YYYY')}
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
                                <TableCell><Typography fontWeight={'bold'}>Hadiah</Typography></TableCell>
                                <TableCell align='center'><Typography fontWeight={'bold'}>No.</Typography></TableCell>
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
                                                <Typography>{row.hadiah}</Typography>
                                            </TableCell>
                                            <TableCell align='center'>
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
    </Container >
}