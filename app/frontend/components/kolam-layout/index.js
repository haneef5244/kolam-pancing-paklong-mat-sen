'use client';
import { Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Stepper from '@/app/frontend/components/stepper';
import PondLayout from '@/app/frontend/components/pond';
import { useRouter } from "next/navigation";

const KolamLayoutComponent = props => {
    const { tarikh } = props;
    const navigate = useRouter();

    useEffect(() => {
        fetch(`/api/booking/availability/by-date?date=${tarikh}`, {
            cache: 'no-store'
        })
            .then(async res => {
                debugger
                const message = await res.json();
                if (!message?.data?.tarikh) {
                    navigate.push('/')
                }
            })
    }, [])

    return <Container maxWidth="xl" sx={{ pt: 2, pb: 5, }}>
        <Grid container sx={{ pb: 2 }}>
            <Grid item xs={12}>
                <Stepper activeIndex={1} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" fontWeight={'bold'}>Sila klik pada kolam yang anda ingin pilih.</Typography>
            </Grid>
            <Grid item xs={12}>
                <PondLayout tarikh={tarikh} />
            </Grid>
        </Grid>
    </Container>
}

export default KolamLayoutComponent;