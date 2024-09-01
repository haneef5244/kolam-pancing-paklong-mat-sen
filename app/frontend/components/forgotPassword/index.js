'use client';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { confirmResetPassword } from '../../services/user';

const ForgotPasswordComponent = props => {
    const { isValid, token } = props;
    const navigate = useRouter();

    const [loading, setLoading] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(false);

    const [headerHeight, setHeaderHeight] = useState(0);
    useEffect(() => {
        if (!isValid) {
            navigate.push('/')
        } else {
            const header = document.getElementById('header');
            setHeaderHeight(header?.scrollHeight);
        }
    }, [])

    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    const [password1ErrorMessage, setPassword1ErrorMessage] = useState('');
    const [password2ErrorMessage, setPassword2ErrorMessage] = useState('');

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);


    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const [snackbarProps, setSnackbarProps] = useState({});

    const handleChangePassword1 = (value) => {
        if (value?.length > 39) {
            return
        }
        setNewPassword1(value)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChangePassword2 = (value) => {
        if (value?.length > 39) {
            return
        }
        setNewPassword2(value)
    }

    const validateForm = () => {
        let valid = true;
        if (newPassword1?.length == 0) {
            setPassword1ErrorMessage('Kata Laluan tidak boleh kosong')
            valid = false;
        }
        if (newPassword2?.length == 0) {
            setPassword2ErrorMessage('Kata Laluan tidak boleh kosong')
            valid = false;
        }
        if (newPassword1 != newPassword2) {
            setPassword2ErrorMessage('Konfirmasi Kata Laluan tidak sama dengan Kata Laluan')
            valid = false;
        }
        if (newPassword1?.length < 10) {
            setPassword1ErrorMessage('Kata Laluan perlu sekurangnya 10 patah perkataan')
            valid = false;
        }
        if (newPassword2?.length < 10) {
            setPassword2ErrorMessage('Konfirmasi Kata Laluan perlu sekurangnya 10 patah perkataan')
            valid = false;
        }
        return valid;
    }

    const handleSubmitForm = () => {
        setLoading(true);
        if (validateForm()) {
            confirmResetPassword({
                token,
                password: newPassword1,
            }).then(async resp => {
                const message = await resp.json();
                if (!resp.ok) {
                    setSnackbarProps({
                        open: true,
                        message: message?.error,
                        severity: 'error'
                    })
                } else {
                    setDisplayDialog(true)
                }
            })
        }
        setLoading(false);
    }

    return <Container maxWidth={'sm'} sx={{ mt: 3 }}>
        <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12}>
                <Typography variant='h6' fontWeight={500}>Masukkan kata laluan baru anda</Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel error={password1ErrorMessage} htmlFor="outlined-adornment-password">Kata Laluan</InputLabel>
                    <OutlinedInput
                        sx={{
                            borderRadius: 2
                        }}
                        id="outlined-adornment-password"
                        value={newPassword1}
                        type={showPassword1 ? 'text' : 'password'}
                        error={password1ErrorMessage}
                        onChange={e => handleChangePassword1(e?.target?.value)}
                        startAdornment={
                            <InputAdornment position='start'>
                                <IconButton
                                    edge="end"
                                >
                                    <LockOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword1}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Kata Laluan"
                    />
                    <FormHelperText sx={{ color: red[600] }}>{password1ErrorMessage}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel error={password2ErrorMessage} htmlFor="outlined-adornment-password2">Konfirmasi Kata Laluan</InputLabel>
                    <OutlinedInput
                        sx={{
                            borderRadius: 2
                        }}
                        id="outlined-adornment-password2"
                        value={newPassword2}
                        type={showPassword2 ? 'text' : 'password'}
                        error={password2ErrorMessage}
                        onChange={e => handleChangePassword2(e?.target?.value)}
                        startAdornment={
                            <InputAdornment position='start'>
                                <IconButton
                                    edge="end"
                                >
                                    <LockOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword2}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Konfirmasi Kata Laluan"
                    />
                    <FormHelperText sx={{ color: red[600] }}>{password2ErrorMessage}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <LoadingButton onClick={handleSubmitForm} size='large' loading={loading} variant='contained' fullWidth>
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Hantar
                    </Typography>
                </LoadingButton>
            </Grid>
        </Grid>
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
        <Dialog onClose={() => navigate.push('/')} open={displayDialog}>
            <DialogTitle>
                Berjaya!
            </DialogTitle>
            <DialogContent>
                Kata laluan anda telah berjaya ditukar. Sila kembali ke login untuk mula memancing!
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate.push('/')}>Ok</Button>
            </DialogActions>
        </Dialog>
    </Container>
}

export default ForgotPasswordComponent;