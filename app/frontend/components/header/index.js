'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { cyan, grey, red } from '@mui/material/colors';
import Link from 'next/link';
import { LoginPopup } from '../loginPopup';
import { LoginContext } from '../../contexts/LoginContext';
import { UserContext } from '../../contexts/UserContext';
import { getCookie, getCookies } from 'cookies-next';
import { getCookieClient } from '../../helpers/cookie';
import { logout } from '../../services/user';
import { Card, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { decode } from 'jsonwebtoken';
import { Book, BookOnline, BookOutlined, HomeOutlined, Logout, NavigateBefore } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const pages = [];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const { setDisplayLogin } = React.useContext(LoginContext);
    const { token, getToken } = React.useContext(UserContext);

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const pathname = usePathname();

    const [displayHeader, setDisplayHeader] = React.useState(false);


    React.useEffect(() => {
        setDisplayHeader(pathname != '/')
    }, [])

    const navigate = useRouter();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        const tokenCookie = getCookieClient('token');
        console.log(`tokenCookie = `, tokenCookie)
        if (!token) {
            setDisplayLogin(true)
        } else {
            setAnchorElUser(event.currentTarget);
        }
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogOut = async () => {
        const resp = await logout();
        if (resp?.ok) {
            getToken();
            handleCloseUserMenu()
            navigate.push('/')
        }
    }

    const handleClickLink = (link) => {
        handleCloseUserMenu()
        navigate.push(link)
    }

    return (
        <AppBar id="header" position="static" sx={{ backgroundColor: grey[100], display: pathname != '/' ? 'block' : 'none' }}>
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <Avatar sx={{ width: { xs: 45, sm: 50 }, height: { xs: 45, sm: 50 } }} src='/logo/logo.png' />

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            fontSize: { xs: '16px' },
                            ml: { xs: 1, md: 'none' },
                            mr: 2,
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        Kolam Pancing Paklong Mat Sen
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {token ? <>
                            <Tooltip title={token ? "Info akaun" : ''}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Card sx={{ boxShadow: 'none', maxWidth: '250px' }}>
                                    <CardMedia sx={{ display: 'flex', mt: 2, alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                                        <Avatar src='non' sx={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} />
                                    </CardMedia>
                                    <CardContent sx={{ padding: 0, paddingBottom: '0px !important' }} >
                                        <Grid container>
                                            <Grid item xs={12} sx={{ p: '0px 16px' }}>
                                                <Typography fontWeight={100}>Selamat datang <span style={{ fontWeight: 'bold' }}>{decode(token)?.firstName} {decode(token)?.lastName}</span></Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <List>
                                                    <ListItem disablePadding >
                                                        <ListItemButton onClick={() => handleClickLink('/home')}>
                                                            <ListItemIcon>
                                                                <HomeOutlined />
                                                            </ListItemIcon>
                                                            <ListItemText primary={<Typography fontWeight={200}>Home</Typography>} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem disablePadding >
                                                        <ListItemButton onClick={() => handleClickLink('/user/booking')}>
                                                            <ListItemIcon>
                                                                <BookOutlined />
                                                            </ListItemIcon>
                                                            <ListItemText primary={<Typography fontWeight={200}>Booking</Typography>} />
                                                        </ListItemButton>
                                                    </ListItem>

                                                    <ListItem disablePadding >
                                                        <ListItemButton onClick={handleLogOut}>
                                                            <ListItemIcon>
                                                                <Logout />
                                                            </ListItemIcon>
                                                            <ListItemText primary={<Typography fontWeight={200}>Logout</Typography>} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Menu>
                        </> : <></>}

                    </Box>
                </Toolbar>
            </Container>
            <LoginPopup />
        </AppBar >
    );
}
export default ResponsiveAppBar;
