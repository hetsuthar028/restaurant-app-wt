import React from "react";
import { Typography, Grid, Card, Button, Avatar } from "@mui/material";
import "./WelcomePage.css";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import QueryBuilderTwoToneIcon from "@mui/icons-material/QueryBuilderTwoTone";
import { Link } from "react-router-dom";
import Footer from "../footer/Footer";

const WelcomePage = () => {
    return (
        <Grid
            container
            sx={{
                background: `url(https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80)`,
            }}
        >
            <Grid item xs={2} sm={2} md={2} sx={{ px: 2 }}>
                <Typography
                    variant="h2"
                    fontFamily="Bartender Serif"
                    sx={{ color: "#ccc" }}
                >
                    Foodie
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{ display: "inline-flex", color: "#DD7230", py: 3 }}
            >
                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    Home
                </Typography>
                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    Add menu
                </Typography>
                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    Contact Us
                </Typography>
                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    About Us
                </Typography>
            </Grid>

            <Grid
                item
                xs={12}
                sm={4}
                md={4}
                textAlign="end"
                sx={{
                    px: 2,
                    py: 3,
                    display: "inline-flex",
                    placeContent: "end",
                }}
            >
                <Button sx={{ border: "3px solid #DD7230", color: "#DD7230" }}>
                    tel: 1111-111-111
                </Button>
                <Avatar sx={{ backgroundColor: "#DD7230", mx: 2 }} />
            </Grid>

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
