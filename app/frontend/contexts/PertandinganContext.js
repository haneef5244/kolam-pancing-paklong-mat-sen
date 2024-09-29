'use client';

import { getLivePertandingan } from "@/app/backend/actions/pertandingan";
import { LiveHelpOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import Lottie from "react-lottie";
import LiveText from "@/app/frontend/lotties/live-text.json"
import { green } from "@mui/material/colors";
import { usePathname, useRouter } from "next/navigation";

const { createContext, useEffect, useState } = require("react");

const PertandinganContext = createContext();

const PertandinganProvider = (props) => {
    const { children } = props;
    const [pertandinganLive, setPertandinganLive] = useState(null);
    const navigate = useRouter();
    useEffect(() => {
        getLivePertandingan().then(res => {
            if (res?.id) {
                setPertandinganLive(res);
            }
        })
    }, [])

    // Get the current path
    const pathname = usePathname()

    return <PertandinganContext.Provider>
        {children}
        {pertandinganLive?.id && pathname != '/pertandingan/live' ? <Snackbar sx={{ cursor: 'pointer' }} onClick={() => navigate.push('/pertandingan/live')} open={true}>
            <Alert icon={<Lottie
                style={{ display: 'flex' }}
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: LiveText,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice',
                    }
                }}
                width={50}
                isStopped={false}
                isPaused={false} />} sx={{ display: 'flex', alignItems: 'center' }} variant="filled" >
                <Grid container>
                    <Grid item xs={12}>
                        <Typography sx={{ color: green[100] }} fontWeight={'bold'}>
                            Ikuti Pertandingan LIVE
                        </Typography>
                    </Grid>
                </Grid>
            </Alert>
        </Snackbar> : <></>}
    </PertandinganContext.Provider >
}

export { PertandinganContext, PertandinganProvider }