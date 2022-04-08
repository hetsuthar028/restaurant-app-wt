import React, { Suspense } from "react";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "@mui/material";
import { THEME } from "./theme/theme";
import { SnackbarProvider } from "notistack";

function App() {
    return (
        <div className="App">
            <Suspense fallback={"Loading..."}>
                <SnackbarProvider maxSnack={3}>
                    <ThemeProvider theme={THEME}>
                        <AppRouter />
                    </ThemeProvider>
                </SnackbarProvider>
            </Suspense>
        </div>
    );
}

export default App;
