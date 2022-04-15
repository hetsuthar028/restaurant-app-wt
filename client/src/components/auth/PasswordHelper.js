import React from "react";
import { Grid, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

const PasswordHelper = (props) => {
    const { formErrors } = props;

    return (
        <Grid container sx={{ width: "80%", my: 0.5 }}>
            <Grid item xs={12} sm={3} md={3} textAlign="start">
                {formErrors.password?.alphabet ? (
                    <CloseRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "red",
                            display: "inline",
                        }}
                    />
                ) : (
                    <DoneRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "green",
                            display: "inline",
                        }}
                    />
                )}
                <Typography variant="caption" sx={{ display: "inline" }}>
                    Alphabets
                </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3} textAlign="start">
                {formErrors.password?.digit ? (
                    <CloseRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "red",
                            display: "inline",
                        }}
                    />
                ) : (
                    <DoneRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "green",
                            display: "inline",
                        }}
                    />
                )}
                <Typography variant="caption" sx={{ display: "inline" }}>
                    Digits
                </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3} textAlign="start">
                {formErrors.password?.specialChar ? (
                    <CloseRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "red",
                            display: "inline",
                        }}
                    />
                ) : (
                    <DoneRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "green",
                            display: "inline",
                        }}
                    />
                )}
                <Typography variant="caption" sx={{ display: "inline" }}>
                    Special Characters
                </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3} textAlign="start">
                {formErrors.password?.minlength ? (
                    <CloseRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "red",
                            display: "inline",
                        }}
                    />
                ) : (
                    <DoneRoundedIcon
                        sx={{
                            height: "20px",
                            width: "auto",
                            color: "green",
                            display: "inline",
                        }}
                    />
                )}
                <Typography variant="caption" sx={{ display: "inline" }}>
                    More than 8 characters
                </Typography>
            </Grid>
        </Grid>
    );
};

export default PasswordHelper;
