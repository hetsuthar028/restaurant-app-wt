import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <Grid container>
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
                    <Typography fontFamily="Bebas Neue" variant="h1">
                        404
                    </Typography>
                    <Typography fontFamily="lato" variant="h3">
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
                            <Typography fontFamily="lato" variant="h5">
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
