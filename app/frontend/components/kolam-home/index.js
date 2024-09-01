
'use client'
import { Alert, Card, CardContent, Container, Fab, Grid, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { blue, green, grey, orange, purple, red, teal, yellow } from "@mui/material/colors";
import { Festival, PointOfSale, Restaurant, Scale, ScaleOutlined, Wc } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { noSSR } from "next/dynamic";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import PondLayout from "../pond";

const centerText = (text) => {
    return <div style={{
        margin: 0, position: 'absolute', top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff'
    }}>
        <Typography>{text}</Typography>
    </div>
}


const batas = (nama, size = 1) => {
    return <Grid item xs={size} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <div style={{ whiteSpace: 'nowrap', textOverflow: 'clip', overflow: 'visible', width: '40px', }}>
            <Typography fontSize={16} color={'#ffffff'}
                sx={{
                    transform: 'rotate(-90deg)',
                    WebkitTransform: 'rotate(-90deg)',
                }}>{nama}</Typography>
        </div>
    </Grid>
}


export default function KolamHome() {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs', { noSSR: true }));
    const isSm = useMediaQuery(theme.breakpoints.only('sm', { noSSR: true }));
    const isMd = useMediaQuery(theme.breakpoints.only('md', { noSSR: true }));
    const isLg = useMediaQuery(theme.breakpoints.up('lg', { noSSR: true }));

    const navigate = useRouter();

    const [showInfo, setShowInfo] = useState(true);

    const generateKolamSpacing = () => {
        if (isXs) return 2;
        else if (isSm) return 4;
        else if (isMd) return 6;
        else if (isLg) return 10
    }

    const generateKolamPadding = () => {
        if (isXs) return 2;
        else if (isSm) return 4;
        else if (isMd) return 6;
        else if (isLg) return 40
    }

    const generateKolamHeight = (id) => {
        if (id == 1) return '400px';
        else if (id == 2) return '600px';
        else if (id == 3) return '580px';
    }

    const generateNombor = (props, nombor, color = green[700]) => {
        return <div style={{ backgroundColor: color, padding: 5, color: '#ffffff', position: 'absolute', ...props }}>
            <Typography>{nombor}</Typography>
        </div>
    }

    const generateKolamCard = (kolamId, id) => {
        if (id == 1) {
            return <Card onClick={() => navigate.push(`/kolam/${id}`)} sx={{ bgcolor: blue[200], height: generateKolamHeight(Number(id)), position: 'relative' }}>
                <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h7" fontWeight={'bold'} sx={{ color: '#ffffff', textTransform: 'uppercase', textShadow: '1px 1px black' }}>{kolamId}</Typography>
                </CardContent>
                <div style={{ backgroundColor: green[700], padding: 5, color: '#ffffff', position: 'absolute', top: 30, left: 0 }}>
                    00146
                </div>
                {generateNombor({ top: 0, right: 0 }, '00001')}
                {generateNombor({ bottom: 0, right: 0 }, '00145')}
                {generateNombor({ bottom: 30, left: 0 }, '00283')}
            </Card >
        } else if (id == 2) {
            return <Card onClick={() => navigate.push(`/kolam/${id}`)} sx={{ bgcolor: blue[200], height: generateKolamHeight(Number(id)), position: 'relative' }}>
                <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h7" fontWeight={'bold'} sx={{ color: '#ffffff', textTransform: 'uppercase', textShadow: '1px 1px black' }}>{kolamId}</Typography>
                </CardContent>
                <div style={{ backgroundColor: green[700], padding: 5, color: '#ffffff', position: 'absolute', top: 30, left: 0 }}>
                    00284
                </div>
                {generateNombor({ top: 0, right: 0 }, '00596')}
                {generateNombor({ bottom: 0, right: 0 }, '00915')}
                {generateNombor({ bottom: 30, left: 0 }, '00595')}
                {generateNombor({ bottom: '50%', left: 0 }, <Scale />, orange[600])}
                {generateNombor({ bottom: '50%', right: 0 }, <Scale />, orange[600])}

            </Card >
        } else if (id == 3) {
            return <Card onClick={() => navigate.push(`/kolam/${id}`)} sx={{ bgcolor: blue[200], height: generateKolamHeight(Number(id)), position: 'relative' }}>
                <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h7" fontWeight={'bold'} sx={{ color: '#ffffff', textTransform: 'uppercase', textShadow: '1px 1px black' }}>{kolamId}</Typography>
                </CardContent>
                <div style={{ backgroundColor: green[700], padding: 5, color: '#ffffff', position: 'absolute', top: 10, left: 0 }}>
                    00916
                </div>
                {generateNombor({ top: 0, right: 0 }, '01231')}
                {generateNombor({ bottom: 0, right: 0 }, '01546')}
                {generateNombor({ bottom: 30, left: 0 }, '01230')}
                {generateNombor({ bottom: '55%', left: 0 }, <Scale />, orange[600])}
                {generateNombor({ bottom: '55%', right: 0 }, <Scale />, orange[600])}

            </Card >
        }
        return <Card sx={{ height: generateKolamHeight(Number(id)) }}>
            <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                {kolamId}
            </CardContent>
        </Card>
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ pt: 2, pb: 5, }}>
                <Grid container maxWidth={'sm'}>
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight={'bold'}>Selamat Datang!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontSize={20} >
                            Klik pada kolam yang anda ingin pancing.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            <PondLayout />

        </div>


    );
}
