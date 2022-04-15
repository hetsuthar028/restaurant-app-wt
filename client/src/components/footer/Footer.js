import React from "react";
import { Grid, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useTranslation } from 'react-i18next';

const Footer = () => {

    const { t } = useTranslation(["common", "nav"]);

    return (
        <Grid item xs={12} md={12} sm={12} textAlign="center" sx={{ my: 5 }}>
            <img
                src="https://www.logomaker.com/api/main/images/1j+ojVVCOMkX9Wyrexe4hGff0anU9UJZxBzAwWIyPj1B...Q1vlSkqhvJ9sKNia1hV7FANhxwHe8c8jSxtAN5K0lM4oHrONIo="
                style={{ height: "150px", width: "auto" }}
            />
            <br />
            <Typography
                fontFamily="lato"
                variant="body2"
                sx={{ color: "#ccc", mt: 1 }}
            >
                © 2022 Foodie {t('common:restaurant')}. {t('nav:allRightsReserved')}.
            </Typography>
            <Typography
                fontFamily="Bartender SmCond Serif Pressed"
                variant="h6"
                sx={{ color: "#ccc", mt: 2 }}
            >
                {t('nav:madeWith')} ❣️ {t('nav:by')}&nbsp;&nbsp;
                <span style={{ color: "#DD7230" }}>
                    <a
                        href="https://github.com/hetsuthar028"
                        style={{ color: "inherit" }}
                    >
                        Het Suthar
                    </a>
                </span>{" "}
                <br />
                <a
                    href="https://github.com/hetsuthar028"
                    style={{ color: "inherit" }}
                >
                    <GitHubIcon sx={{ mt: 2 }} />
                </a>
            </Typography>
        </Grid>
    );
};

export default Footer;
