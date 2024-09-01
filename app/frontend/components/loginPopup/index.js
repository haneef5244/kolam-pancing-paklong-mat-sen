import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue, green, red } from '@mui/material/colors';
import { LoginContext } from '../../contexts/LoginContext';
import { Alert, Box, DialogActions, DialogContent, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, register } from '../../services/user';
import { UserContext } from '../../contexts/UserContext';

export function LoginPopup() {
    const { displayLogin, setDisplayLogin } = React.useContext(LoginContext);
    const { getToken } = React.useContext(UserContext);

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const [isLogin, setIsLogin] = React.useState(true);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [namaPertama, setNamaPertama] = React.useState('');
    const [namaTerakhir, setNamaTerakhir] = React.useState('');
    const [telefon, setTelefon] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [namaPertamaErrorMessage, setNamaPertamaErrorMessage] = React.useState('');
    const [namaTerakhirErrorMessage, setNamaTerakhirErrorMessage] = React.useState('');
    const [telefonErrorMessage, setTelefonErrorMessage] = React.useState('');
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

    const [snackbarProps, setSnackbarProps] = React.useState({});

    const [showPassword, setShowPassword] = React.useState(false);

    const [displaySuccessfulRegister, setDisplaySuccessfulRegister] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const invalidName = (val) => {
        return /[^a-zA-Z0-9 ]/.test(val);
    }

    const invalidUsername = val => {
        return /[^a-zA-Z0-9]/.test(val);
    }

    const isValidRegisterForm = () => {
        let valid = true;
        if (!username) {
            setUsernameErrorMessage('Username perlu diisi')
            valid = false;
        } else if (invalidUsername(username)) {
            setUsernameErrorMessage('Hanya huruf atau nombor boleh digunakan')
        }
        if (!password) {
            setPasswordErrorMessage('Password perlu diisi')
            valid = false;
        }
        if (!namaPertama) {
            setNamaPertamaErrorMessage('Nama pertama perlu diisi')
            valid = false;
        } else if (invalidName(namaPertama)) {
            setNamaPertamaErrorMessage('Hanya huruf atau nombor boleh digunakan')
        }
        if (!namaTerakhir) {
            setNamaTerakhirErrorMessage('Nama terakhir perlu diisi')
            valid = false;
        } else if (invalidName(namaTerakhir)) {
            setNamaTerakhirErrorMessage('Hanya huruf atau nombor boleh digunakan')
        }
        if (!telefon) {
            setTelefonErrorMessage('No. telefon perlu diisi')
            valid = false;
        }
        if (!email) {
            setEmailErrorMessage('Email perlu diisi')
            valid = false;
        }
        return valid;
    }

    const isValidLoginForm = () => {
        let valid = true;
        if (!username) {
            setUsernameErrorMessage('Username perlu diisi')
            valid = false
        }
        if (!password) {
            setPasswordErrorMessage('Password perlu diisi')
            valid = false;
        }
        return valid;
    }

    const handleSubmit = async (isRegister) => {
        if (isRegister && isValidRegisterForm()) {
            const response = await register({
                username,
                password,
                nama_pertama: namaPertama,
                nama_akhir: namaTerakhir,
                telefon,
                email
            })
            const message = await response.json();
            if (!response.ok) {
                setSnackbarProps({
                    open: true,
                    message: message?.error,
                    background: red[800],
                    severity: 'error'
                })
            } else {
                setDisplaySuccessfulRegister(true);
                setDisplayLogin(false);
            }
        } else if (!isRegister && isValidLoginForm()) {
            const response = await login({
                username,
                password,
            })
            const message = await response.json();
            if (!response.ok) {
                setSnackbarProps({
                    open: true,
                    message: message?.error,
                    severity: 'error'
                })
            } else {
                setDisplayLogin(false);
                getToken();
            }
        }
    }

    const handleOnChangeUsername = (value) => {
        if (value.length > 20) {
            return;
        }
        setUsername(value);
    }

    const handleOnChangePassword = (value) => {
        if (value.length > 20) {
            return;
        }
        setPassword(value);
    }

    const handleOnChangeNamaPertama = value => {
        if (value.length > 20) {
            return;
        }
        setNamaPertama(value);
    }

    const handleOnChangeNamaTerakhir = value => {
        if (value.length > 20) {
            return;
        }
        setNamaTerakhir(value);
    }

    const handleOnChangeTelefon = value => {
        if (!(/^[0-9]+$/.test(value)) || value.length > 20) {
            return;
        }
        setTelefon(value);
    }

    const handleOnChangeEmail = value => {
        if (value.length > 20) {
            return;
        }
        setEmail(value);
    }

    return <>
        <Dialog onClose={() => setDisplayLogin(false)} open={displayLogin}>
            <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ mt: 2 }}>
                    <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid item xs={12}>
                            <TextField type='text' autoComplete='username' value={username} onChange={e => handleOnChangeUsername(e.target.value)} helperText={usernameErrorMessage} error={usernameErrorMessage} fullWidth id="outlined-basic" label="Username" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel error={passwordErrorMessage} htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={password}
                                    type={showPassword ? 'text' : 'password'}
                                    error={passwordErrorMessage}
                                    onChange={e => handleOnChangePassword(e?.target?.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                                <FormHelperText sx={{ color: red[600] }}>{passwordErrorMessage}</FormHelperText>
                            </FormControl>
                        </Grid>
                        {!isLogin ? <Grid item xs={6}>
                            <TextField type='text' autoComplete='given-name' value={namaPertama} onChange={e => handleOnChangeNamaPertama(e?.target?.value)} fullWidth id="outlined-basic" helperText={namaPertamaErrorMessage} error={namaPertamaErrorMessage} label="Nama Pertama" variant="outlined" />
                        </Grid> : <></>}
                        {!isLogin ? <Grid item xs={6}>
                            <TextField type='text' autoComplete='family-name' value={namaTerakhir} onChange={e => handleOnChangeNamaTerakhir(e?.target?.value)} fullWidth id="outlined-basic" helperText={namaTerakhirErrorMessage} error={namaTerakhirErrorMessage} label="Nama Terakhir" variant="outlined" />
                        </Grid> : <></>}
                        {!isLogin ? <Grid item xs={6}>
                            <TextField type='tel' autoComplete='tel' value={telefon} onChange={e => handleOnChangeTelefon(e?.target?.value)} fullWidth id="outlined-basic" helperText={telefonErrorMessage} error={telefonErrorMessage} label="No. telefon" variant="outlined" />
                        </Grid> : <></>}
                        {!isLogin ? <Grid item xs={6}>
                            <TextField type='email' autoComplete='email' value={email} onChange={e => handleOnChangeEmail(e?.target?.value)} fullWidth id="outlined-basic" helperText={emailErrorMessage} error={emailErrorMessage} label="Email" variant="outlined" />
                        </Grid> : <></>}
                        <Grid item xs={12}>
                            <Grid container alignItems={'center'} justifyContent={'space-between'}>
                                {isLogin ? <Grid item onClick={() => setIsLogin(!isLogin)} sx={{ cursor: 'pointer' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: green[700] }}>
                                        Register akaun
                                    </Typography>
                                </Grid> : <></>}
                                {isLogin ? <Grid item >
                                    <Button onClick={() => handleSubmit(false)}>Login</Button>
                                </Grid> : <></>}
                                {!isLogin ? <Grid item onClick={() => setIsLogin(!isLogin)} sx={{ cursor: 'pointer' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: green[700] }}>
                                        Kembali ke Login
                                    </Typography>
                                </Grid> : <></>}
                                {!isLogin ? <Grid item onClick={() => handleSubmit(true)} sx={{ cursor: 'pointer' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: green[700] }}>
                                        Register
                                    </Typography>
                                </Grid> : <></>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Snackbar
                    open={snackbarProps?.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarProps({})}
                    message={snackbarProps?.message}
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
            </DialogContent>
        </Dialog>
        <Dialog open={displaySuccessfulRegister}>
            <DialogTitle>
                Pendaftaran telah berjaya!
            </DialogTitle>
            <DialogContent>
                E-mail verifikasi telah dihantar pada anda. Sila buat verifikasi untuk login.
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDisplaySuccessfulRegister(false)}>Ok</Button>
            </DialogActions>
        </Dialog>
    </>
}