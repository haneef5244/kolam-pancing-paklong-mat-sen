import { Avatar, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import React, { act } from 'react';
import { stepperData } from '../../constants/stepper';
import { blue, green, grey } from '@mui/material/colors';
import './index.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Stepper = ({ activeIndex }) => {

    const generateCircle = () => {
        return <div className='circle'>
            <Grid container>
                <Grid item xs={12}>
                    <CircularProgressbar styles={buildStyles({ trailColor: '#ffffff', textSize: 14, backgroundColor: 'red', pathColor: green[700], textColor: green[900] })} strokeWidth={20} value={((activeIndex + 1) / 5) * 100} text={`${activeIndex + 1} dari 5`} />
                </Grid>
            </Grid>
        </div>

    }

    return <Grid container columnGap={2} marginBottom={2} padding={5} sx={{ background: grey[300], borderRadius: '10px' }}>
        {stepperData.map((step, i) => <Grid item xs sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container display={'flex'} alignItems={'center'}>
                <Grid item xs>
                    <Grid container>
                        <Grid item xs={12}>
                            <div style={{ display: 'flex', columnGap: 10 }}>
                                <div>
                                    <Avatar sx={{ background: i < activeIndex ? 'green' : i == activeIndex ? blue[700] : grey[500] }}>{i + 1}</Avatar>
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <Grid container marginTop={i != stepperData.length - 1 ? '20px' : '10px'}>
                                        {i != stepperData.length - 1 ? <Grid item xs={12}>
                                            <Divider />
                                        </Grid> : <></>}
                                        <Grid item xs={12}>
                                            <Typography variant='caption' fontWeight={'bold'}>
                                                {step.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </div>

                            </div>

                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>)}
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none', } }}>
            <Grid container>
                <Grid item xs>
                    {generateCircle()}
                </Grid>
                <Grid item xs>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='65' fontWeight={'bold'}>{stepperData[activeIndex]?.label}</Typography>
                        </Grid>
                        {stepperData[activeIndex]?.seterusnya ? <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant='h7' fontWeight={'300'}><span style={{ fontWeight: 'bold' }}>Seterusnya:</span></Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>{stepperData[activeIndex]?.seterusnya}</Typography>
                                </Grid>
                            </Grid>

                        </Grid> : <></>}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default Stepper;