import { Avatar, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import React, { act } from 'react';
import { stepperData } from '../../constants/stepper';
import { blue, grey } from '@mui/material/colors';
import './index.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Stepper = ({ activeIndex }) => {

    const generateCircle = () => {
        let circleStyle = {}
        circleStyle.borderTopRightRadius = '50%'
        circleStyle.borderBottomRightRadius = '50%'
        circleStyle.borderBottomLeftRadius = '50%'
        circleStyle.borderTopLeftRadius = '50%'
        if (activeIndex == 0) {
            circleStyle.borderTopRight = '2px solid red'
            circleStyle.borderBottomRight = `2px solid ${grey[200]}`
            circleStyle.borderBottomLeft = `2px solid ${grey[200]}`
            circleStyle.borderTopLeft = `2px solid ${grey[200]}`
        }
        if (activeIndex == 1) {
            circleStyle.background = 'linear-gradient(45deg, red 50%, yellow 50%),linear - gradient(-45deg, green 50 %, blue 50 %)'
            circleStyle.backgroundSize = '100% 100%'
            circleStyle.position = '0 0, 0 100%'
            circleStyle.backgroundRepeat = 'no-repeat'
        }
        if (activeIndex == 2) {
            circleStyle.background = 'linear-gradient(45deg, red 50%, yellow 50%),linear - gradient(-45deg, green 50 %, blue 50 %)'
            circleStyle.backgroundSize = '100% 100%'
            circleStyle.position = '0 0, 0 100%'
            circleStyle.backgroundRepeat = 'no-repeat'
            circleStyle.borderTopRight = '2px solid red'
            circleStyle.borderBottomRight = '2px solid red'
            circleStyle.borderBottomLeft = '2px solid red'
            circleStyle.borderTopLeft = `2px solid ${grey[200]}`
        }
        if (activeIndex == 3) {
            circleStyle.background = 'linear-gradient(45deg, red 50%, yellow 50%),linear - gradient(-45deg, green 50 %, blue 50 %)'

            circleStyle.borderBottomRight = '2px solid red'
            circleStyle.borderBottomLeft = '2px solid red'
            circleStyle.borderTopLeft = `2px solid ${grey[200]}`
        }
        return <div className='circle'>
            <CircularProgressbar value={((activeIndex + 1) / 4) * 100} text={`${activeIndex + 1} dari 4`} />
        </div>

    }

    return <Grid container columnGap={2} marginBottom={2} padding={5} sx={{ background: grey[100], borderRadius: '10px' }}>
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
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant='65' fontWeight={'bold'}>{stepperData[activeIndex]?.label}</Typography>

                        </Grid>
                        {stepperData[activeIndex]?.seterusnya ? <Grid item xs={12}>
                            <Typography variant='h7' fontWeight={'300'}>Seterusnya: {stepperData[activeIndex]?.seterusnya}</Typography>
                        </Grid> : <></>}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default Stepper;