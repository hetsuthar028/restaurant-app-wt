import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <Grid container sx={{background: `url(https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80)`}}>
            <Grid
                item
                xs={12}
                md={12}
                sm={12}
                textAlign="center"
                sx={{
                    display: "grid",
                    minHeight: "100vh",
                    alignContent: "center",
                    placeContent: "center",
                }}
            >
                <center>
                    <img
                        src="https://cdn.pixabay.com/photo/2014/12/21/23/56/hamburger-576419__340.png"
                        style={{ height: "300px", width: "300px" }}
                    />
                    <Typography fontFamily="Bartender SmCond Serif Pressed" variant="h1" sx={{color: '#ccc'}}>
                        404
                    </Typography>
                    <Typography fontFamily="Bartender SmCond Serif Pressed" variant="h3" sx={{color: '#ccc'}}>
                        That page doesn't exist!
                    </Typography>
                    <Typography fontFamily="lato" variant="h6" color="GrayText">
                        Sorry, the page you were looking for could not be found.
                    </Typography>
                    <Button size="large" sx={{ mt: 2 }}>
                        <Link
                            to="/home"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Typography fontFamily="Bartender SmCond Serif Pressed" variant="h3">
                                Visit Home
                            </Typography>
                        </Link>
                    </Button>
                </center>
            </Grid>
        </Grid>
    );
};

export default NotFoundPage;
