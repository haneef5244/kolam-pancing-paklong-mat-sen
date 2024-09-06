'use client';
import { Box, Chip, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicTable from "../basicTable";
import moment from "moment";
import { cyan, green, red, yellow } from "@mui/material/colors";

const generateHeaders = () => {
    return [
        {
            props: {},
            value: 'Id'
        },
        {
            props: {},
            value: 'Kolam'
        },
        {
            props: {},
            value: 'Tarikh Pancing',
        },
        {
            props: {},
            value: 'Pancang'
        },
        {
            props: {},
            value: 'Add Ons'
        },
        {
            props: {},
            value: 'Amaun'
        },
        {
            props: {},
            value: 'Status',
        },
        {
            props: {},
            value: 'Tarikh Booking'
        },
    ]
}

const UserBookingComponent = (props) => {

    const [headers, setHeaders] = useState([]);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        setHeaders(generateHeaders())
    }, [])

    const generatePaymentChip = (status) => {
        if (status == 'CANCELLED') {
            return <Chip sx={{ background: red[500], color: '#ffffff' }} label={status} />
        }
        else if (status == 'PAID') {
            return <Chip sx={{ background: green[500], color: '#ffffff' }} label={status} />
        }
        if (status == 'PENDING') {
            return <Chip sx={{ background: yellow[800], color: '#ffffff' }} label={status} />
        }
    }

    useEffect(() => {
        fetch('/api/users/booking', {
            method: 'GET'
        }).then(async res => {
            const message = await res.json();

            if (message?.data) {
                let newData = [];
                for (let d of props?.data) {
                    let colData = []
                    colData.push({
                        props: {},
                        value: d?.id
                    })
                    colData.push({
                        props: {},
                        value: d?.kolam_id
                    })
                    colData.push({
                        props: {},
                        value: moment(d?.tarikh).format('Do MMMM YYYY')
                    })
                    colData.push({
                        props: {},
                        value: <Grid container columnSpacing={2} rowSpacing={2}>
                            {d?.pancangs?.map(pancang => <Grid item xs="auto">
                                <Chip label={pancang?.nombor} />
                            </Grid>)}
                        </Grid>
                    })
                    colData.push({
                        props: {},
                        value: <Grid container>
                            {d?.add_ons.map(ao => <Grid item xs="12">
                                {ao?.type?.replace('_', ' ')} x {ao?.quantity}
                            </Grid>)}
                        </Grid>
                    })
                    colData.push({
                        props: {},
                        value: `RM ${d?.amount}`
                    })
                    colData.push({
                        props: {},
                        value: generatePaymentChip(d?.payment_status)
                    })
                    colData.push({
                        props: {},
                        value: moment(d?.created_on).format('Do MMMM YYYY, h:mm:ss a')
                    })
                    newData.push(colData);
                }
                setData(newData);
            }
        })

    }, [])

    return <Container maxWidth={'lg'} sx={{ pt: 5, pb: 5 }}>
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{ background: cyan[800], padding: 2, borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                    <Typography variant="h6" color={"white"} fontWeight={'bold'}>
                        Sejarah booking anda.
                    </Typography>

                </Box>
            </Grid>
        </Grid>
        <BasicTable
            headers={generateHeaders()}
            rows={data}
        />
    </Container>
}

export default UserBookingComponent;