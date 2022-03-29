import React from "react";
import WelcomePage from "./components/welcome-screen/WelcomePage";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "@mui/material";
import { THEME } from './theme/theme';

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={THEME}>
                <AppRouter />
            </ThemeProvider>
        </div>
    );
}

export default App;
