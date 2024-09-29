'use client';

import { ThemeProvider, createTheme } from "@mui/material";
import { LoginContext, LoginProvider } from "./frontend/contexts/LoginContext";
import { SnackbarProvider } from "./frontend/contexts/SnackbarContext";
import { UserProvider } from "./frontend/contexts/UserContext";
import { PertandinganProvider } from "./frontend/contexts/PertandinganContext";




export function Providers({ children, font }) {
    const theme = createTheme({
        typography: {
            fontFamily: font.style.fontFamily
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <PertandinganProvider>
                <SnackbarProvider>
                    <LoginProvider>
                        <UserProvider>
                            {children}
                        </UserProvider>
                    </LoginProvider>
                </SnackbarProvider>
            </PertandinganProvider>
        </ThemeProvider>
    )
}