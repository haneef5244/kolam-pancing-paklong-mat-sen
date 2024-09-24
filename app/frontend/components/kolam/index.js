'use client';
import React, { useEffect, useState } from 'react';
import './index.css'; // Import your CSS file for styling
import { Alert, Button, Card, CardContent, Chip, Container, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Add, CloseOutlined, DoubleArrowOutlined, Info } from '@mui/icons-material';
import { cyan, green, grey, red } from '@mui/material/colors';
import Lottie from 'react-lottie';
import ScrollDown from '@/app/frontend/lotties/scroll-down.json';
import AdditonalProducts from '../additional-products';
import Stepper from '../stepper';
import { create } from '../../services/booking';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import DynamicPond from '../dynamicPond';
import { getDistinctKolamByPancangs } from '@/app/backend/actions/kolam';


const KolamComponent = (props) => {
    const navigate = useRouter();

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'), { noSsr: true });

    const { kolamId, tarikh } = props;

    const [selectedKolam, setSelectedKolam] = useState(kolamId);
    const [loadKolam, setLoadKolam] = useState(true);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [selectedKolamLabel, setSelectedKolamLabel] = useState([]);

    const [bookedSlots, setBookedSlots] = useState([]);
    const [total, setTotal] = useState(0);
    const [snackbarProps, setSnackbarProps] = useState({});
    const [loadingButton, setLoadingButton] = useState(false);
    const [openPancangDialog, setOpenPancangDialog] = useState(false);

    const [additionalProducts, setAdditionalProducts] = useState([
        {
            name: 'Air Mineral',
            priceLabel: 'RM 2',
            price: 2,
            quantity: 0,
            image: '/images/mineral-water.jpeg'
        },
    ])
    const [reservedPancangs, setReservedPancangs] = useState({});

    const refreshData = async () => {
        fetch(`/api/booking/availability/by-date-and-kolam?date=${tarikh}&kolam=${Number(selectedKolam)}`, {
            cache: 'no-store'
        })
            .then(async res => {
                const message = await res.json();
                if (!message?.data?.length) {
                    return navigate.push('/')
                }

                const leftItems = message?.data?.filter(e => e?.pancang?.is_left)?.sort((a, b) => {
                    // Extract and convert the numeric parts of the pancang.value properties
                    const numA = parseInt(a.pancang.value.slice(1), 10);
                    const numB = parseInt(b.pancang.value.slice(1), 10);

                    // Compare the numeric values
                    return numA - numB;
                });
                const rightItems = message?.data?.filter(e => e?.pancang?.is_right)?.sort((a, b) => {
                    // Extract and convert the numeric parts of the pancang.value properties
                    const numA = parseInt(a.pancang.value.slice(1), 10);
                    const numB = parseInt(b.pancang.value.slice(1), 10);

                    // Compare the numeric values
                    return numA - numB;
                });
                setLeft(leftItems)
                setRight(rightItems)
            })
    }

    const refreshKolamSelectedLabel = (latestSlots) => {
        getDistinctKolamByPancangs(latestSlots).then(res => {
            setSelectedKolamLabel(JSON.parse(res).map(res => res?.kolam_id))
        })
    }

    useEffect(() => {
        if (moment(tarikh).startOf('day').isSameOrAfter(moment().startOf('day'))
            && moment(tarikh).isValid()
            && selectedKolam) {
            refreshData();
        } else {
            navigate.push('/')
        }
    }, [selectedKolam])
    const handleBookSlot = (slotId) => {
        if (reservedPancangs[slotId]) {
            return;
        }
        if (bookedSlots.includes(slotId)) {
            let newBookedSlots = bookedSlots.filter(id => id !== slotId)
            setBookedSlots(newBookedSlots);
            refreshKolamSelectedLabel(newBookedSlots)
            setTotal(total - 90)
        } else {
            let newBookedSlots = [...bookedSlots, slotId]
            setBookedSlots(newBookedSlots);
            refreshKolamSelectedLabel(newBookedSlots)
            setTotal(total + 90)
        }

    };

    const renderButtons = (buttons) => {

        return <Grid container flexDirection={'row'} alignItems={'space-between'} height={'100%'}>
            {buttons.map((button, i) => <Grid item xs={12} width={'100%'}>
                <Button
                    key={button?.pancang?.value}
                    disabled={!button?.is_available || !button?.pancang?.is_available}
                    className={`pond-button ${bookedSlots.includes(button?.pancang?.value) ? 'booked' : !button?.is_available || !button?.pancang?.is_available ? 'not-available' : 'available'}`}
                    onClick={() => handleBookSlot(button?.pancang?.value)}
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

    const handleChangeKolam = kolam => {
        let div = document.getElementById('scroll-on-select-pond');
        div?.scrollIntoView({
            behavior: 'smooth'
        })
        setOpenPancangDialog(false);
        setSelectedKolam(kolam);
    }

    const handleCreateBooking = async () => {
        if (!bookedSlots?.length) {
            setSnackbarProps({
                open: true,
                message: 'Sila pilih sekurangnya 1 pancang',
                severity: 'warning'
            })
            return;
        }
        setLoadingButton(true);
        const addOns = {}
        for (let ao of additionalProducts) {
            if (ao?.name == 'Air Mineral' && ao?.quantity > 0) {
                addOns.airMineral = ao?.quantity
            }
        }
        const resp = await create({
            pancang: bookedSlots,
            kolam_id: Number(kolamId),
            tarikhPancing: new Date(tarikh),
            amount: total,
            addOns,
        });
        const respJson = await resp.json();

        if (!resp.ok) {
            if (respJson?.unavailableSlots) {
                setBookedSlots(bookedSlots.filter(e => !respJson?.unavailableSlots.includes(e)));
                await refreshData();
            }
            setSnackbarProps({
                open: true,
                message: respJson?.error,
                severity: 'error'
            })
            setLoadingButton(false);
        } else {
            const { booking } = respJson;
            navigate.push(`/kolam/booking/${booking}`)
        }

    }

    const handleClickAdditionalProducts = (valueToAdd, index) => {

        let newAdditionalProducts = [...additionalProducts];
        if (newAdditionalProducts[index].quantity == 0 && valueToAdd == -1) {
            return
        }
        newAdditionalProducts[index].quantity = newAdditionalProducts[index].quantity + valueToAdd
        if (valueToAdd == 1) {
            setTotal(Number(total) + Number(newAdditionalProducts[index].price));
        } else {
            setTotal(Number(total) - Number(newAdditionalProducts[index].price));
        }
        setAdditionalProducts(newAdditionalProducts)
    }

    const generateAdditionalProductsCalculation = () => {
        let comp = []
        for (let i of additionalProducts) {
            if (i.quantity) {
                comp.push(<Grid container>
                    <Grid item xs={6}>
                        <Typography fontSize={13}>{i.name} x {i.quantity}</Typography>
                    </Grid>
                    <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                        <Typography fontSize={13} fontWeight={'bold'}>RM {i.price * i.quantity}</Typography>
                    </Grid>
                </Grid>)
            }
        }
        return <>
            {comp.map(e => e)}
        </>
    }

    return (
        <Container sx={{ pt: 3, pb: 3 }}>

            <Grid container>
                <Grid item xs={12}>
                    <Stepper activeIndex={2} />
                </Grid>
                <Grid item xs={12}>
                    <div id="scroll-on-select-pond"></div>

                </Grid>
                <Grid item xs={12} pb={1}>
                    <Typography variant='h7'>
                        Pilih pancang anda
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1} display={'flex'} alignItems={'center'}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: green[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontSize={12} fontWeight={600}>Masih Terbuka</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1} display={'flex'} alignItems={'center'}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: red[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontSize={12} fontWeight={600}>Sudah Diambil</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1} display={'flex'} alignItems={'center'}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: grey[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontSize={12} fontWeight={600}>Anda Memilih</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ pt: 2, display: { xs: 'block', md: 'none' } }}>
                    <Card sx={{ backgroundColor: cyan[800], borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                        <CardContent sx={{ paddingBottom: '16px !important' }}>
                            <Grid container columnSpacing={1} alignItems={'center'}>
                                <Grid item xs='auto' alignItems={'center'}>
                                    <Info sx={{ color: '#ffffff', display: 'flex', }} />
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography variant='caption' color={'#ffffff'}>Klik pada kotak hijau untuk pilih pancang anda</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>

                    <Grid container columnSpacing={2}>
                        <Grid item xs={12} md={7} mt={3}
                            sx={{
                                height: {
                                    xs: '50vh',
                                    md: '80vh'
                                },
                                overflowY: {
                                    xs: 'scroll !important',
                                    md: 'scroll !important'
                                }
                            }}
                        >
                            <div style={{ display: 'flex', columnGap: 4 }}>
                                <div style={{ width: '64px' }}>
                                    {renderButtons(left)}
                                </div>
                                <div style={{ position: 'relative', width: '-webkit-fill-available' }}>


                                    <div className="pond" style={{ position: 'relative', height: '100%' }}>
                                        <div style={{ position: 'sticky', top: '0%', left: '50%' }}>
                                            <Container>
                                                <Button fullWidth></Button>
                                            </Container>
                                        </div>
                                        <div style={{ position: 'sticky', top: isXs ? '70%' : '75%', left: '50%' }}>
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
                                    {renderButtons(right, true)}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5} mt={3} columnSpacing={1}
                            sx={{
                                display: {
                                    md: 'block'
                                }
                            }}>
                            <Grid container rowSpacing={1} >
                                <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }} >
                                    <Card sx={{ backgroundColor: cyan[800], borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                                        <CardContent sx={{ paddingBottom: '16px !important' }}>
                                            <Grid container columnSpacing={1} alignItems={'center'}>
                                                <Grid item xs='auto' alignItems={'center'}>
                                                    <Info sx={{ color: '#ffffff', display: 'flex', }} />
                                                </Grid>
                                                <Grid item xs='auto' >
                                                    <Typography variant='caption' color={'#ffffff'}>Klik pada kotak hijau untuk pilih pancang anda</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card sx={{ backgroundColor: '#ffffff', borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                                        <CardContent>
                                            <Grid container columnSpacing={1} alignItems={'center'} rowSpacing={1}>
                                                <Grid item xs={12}>
                                                    <Typography fontSize={12} fontWeight={'bold'} sx={{ color: cyan[600] }}>Pancang yang anda pilih:</Typography>
                                                </Grid>
                                                {bookedSlots.map(b => <Grid item>
                                                    <Chip variant='filled' sx={{ background: green[600], color: '#ffffff' }} label={<Typography fontSize={12} fontWeight={'bold'}>{b}</Typography>} />
                                                </Grid>)}
                                                <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography fontSize={12} fontWeight={'bold'} sx={{ color: cyan[600] }}>Add-Ons:</Typography>
                                                        </Grid>
                                                        <AdditonalProducts handleClickAdditionalProducts={handleClickAdditionalProducts} swiper={additionalProducts} />
                                                    </Grid>
                                                </Grid>

                                                {bookedSlots.length > 0 ? <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography fontSize={13} fontWeight={'bold'} sx={{ color: cyan[600] }}>Ringkasan pembelian:</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <Typography fontSize={13}>
                                                                Lokasi
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography fontSize={13}>
                                                                Kolam {selectedKolamLabel?.map(e => e).join(', ')}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography fontSize={13}>
                                                                Pancang x {bookedSlots.length}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography fontWeight={'bold'} fontSize={13}>
                                                                RM {bookedSlots.length * 90}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    {generateAdditionalProductsCalculation()}
                                                    <Grid container mt={1} mb={1}>
                                                        <Grid item xs={12}>
                                                            <Divider />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container mt={1}>
                                                        <Grid item xs={6}>
                                                            <Typography>
                                                                Jumlah Keseluruhan
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography fontWeight={'bold'}>
                                                                RM {total}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> : <></>}
                                                <Grid item xs={12}>
                                                    <LoadingButton
                                                        loading={loadingButton}
                                                        startIcon={<DoubleArrowOutlined color=' #ffffff' />}
                                                        variant='contained'
                                                        onClick={() => handleCreateBooking()}
                                                        sx={{
                                                            padding: '10px 20px',
                                                            borderRadius: '10px',
                                                            background: cyan[800],
                                                            ':hover': {
                                                                background: cyan[700]
                                                            }
                                                        }}
                                                    >
                                                        <Typography fontSize={12} fontWeight={'bold'} textTransform={'capitalize'}>Seterusnya</Typography>
                                                    </LoadingButton>
                                                </Grid>
                                                <Grid item xs="12">
                                                    <Button variant='outlined'
                                                        onClick={() => setOpenPancangDialog(true)}
                                                        startIcon={<Add />}
                                                        sx={{
                                                            padding: '10px 20px',
                                                            borderRadius: '10px',
                                                            color: cyan[800],
                                                            ':hover': {
                                                                background: grey[100],
                                                                border: `1px solid ${cyan[700]}`
                                                            },
                                                            border: `1px solid ${cyan[700]}`
                                                        }}>
                                                        <Typography fontSize={12} textTransform={'capitalize'}>Ingin tambah pancang dari kolam lain?</Typography>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={openPancangDialog} onClose={() => setOpenPancangDialog(false)}>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenPancangDialog(false)}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                        zIndex: 999
                    })}
                >
                    <CloseOutlined />
                </IconButton>
                <DialogContent>
                    <Grid container rowSpacing={1} >
                        <Grid item xs={12}>
                            <DynamicPond handleClickPond={handleChangeKolam} pond={selectedKolam} />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarProps?.open}
                autoHideDuration={6000}
                onClose={() => setSnackbarProps({})}
            >
                <Alert sx={{ display: 'flex', alignItems: 'center' }} variant="filled" severity={snackbarProps?.severity}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography>
                                {snackbarProps?.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </Alert>
            </Snackbar>
        </Container >


    );
};

export default KolamComponent;
