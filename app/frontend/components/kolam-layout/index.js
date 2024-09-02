'use client';
import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import Stepper from '@/app/frontend/components/stepper';
import PondLayout from '@/app/frontend/components/pond';

const KolamLayoutComponent = props => {
    const { tarikh } = props;
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