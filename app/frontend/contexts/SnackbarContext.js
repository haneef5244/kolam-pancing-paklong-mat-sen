'use client';

import { Alert, Grid, Snackbar, Typography } from "@mui/material";

const { createContext, useState } = require("react");

const SnackbarContext = createContext();

const SnackbarProvider = ({ children }) => {

    const [snackbarProps, setSnackbarProps] = useState({});

    return <SnackbarContext.Provider value={({ snackbarProps, setSnackbarProps })}>
        {children}
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
    </SnackbarContext.Provider>
}

export { SnackbarContext, SnackbarProvider }