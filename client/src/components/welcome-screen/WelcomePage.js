import React from "react";
import { Typography, Grid } from "@mui/material";
import "./WelcomePage.css";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import QueryBuilderTwoToneIcon from "@mui/icons-material/QueryBuilderTwoTone";
import Footer from "../footer/Footer";
import Navbar from "../navbar/NavBar";

const WelcomePage = () => {
    return (
        <Grid
            container
            sx={{
                background: `url(https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80)`,
            }}
        >
            <Navbar />

            <Grid item xs={4} sm={4} md={4}>
                <img
                    src="https://artsdistrictkitchen.com/wp-content/uploads/2019/10/Hero-Vertical-Burger.jpg"
                    style={{ width: "100%", height: "100vh" }}
                />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#DD7230" }}
                    variant="h1"
                    textAlign="center"
                >
                    GOOD TIMES
                </Typography>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#ccc" }}
                    variant="h6"
                    textAlign="center"
                >
                    WITH
                </Typography>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#DD7230" }}
                    variant="h1"
                    textAlign="center"
                >
                    GREAT FRIENDS
                </Typography>

                <Grid container my={2}>
                    <Grid item xs={3} sm={3} md={3} textAlign="end">
                        <PushPinRoundedIcon sx={{ color: "#ccc" }} />
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} sx={{ px: 2 }}>
                        <Typography
                            fontFamily="Bartender SmCond Serif Pressed"
                            sx={{ color: "#ccc" }}
                            variant="h6"
                        >
                            1510 South Main Street <br />
                            Las Vegas, NV 89104 <br />
                            Located inside of Able Baker Brewing <br />
                            702.479.6355 <br />
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container my={2}>
                    <Grid item xs={3} sm={3} md={3} textAlign="end">
                        <QueryBuilderTwoToneIcon sx={{ color: "#ccc" }} />
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} sx={{ px: 2 }}>
                        <Typography
                            fontFamily="Bartender SmCond Serif Pressed"
                            sx={{ color: "#ccc" }}
                            variant="h6"
                        >
                            <span style={{ color: "#DD7230" }}>TUE-SAT:</span>{" "}
                            12PM-10PM
                            <br />
                            <span style={{ color: "#DD7230" }}>
                                SUNDAY:
                            </span>{" "}
                            10AM-11:30PM
                            <br />
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Footer */}
            <Footer />
        </Grid>
    );
};

export default WelcomePage;
