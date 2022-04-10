import React, { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Button,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(["auth", "nav"]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const verifyCurrentUser = async () => {
        try {
            let response = await axios.get(
                `http://localhost:5001/user/auth/currentuser`,
                {
                    headers: {
                        authorization: window.localStorage.getItem("bearer"),
                    },
                }
            );
            setIsAdmin(response.data.user.is_admin);
            setIsLoggedIn(true);
            setProfileUrl(response.data.user.profile_url);
            return;
        } catch (error) {
            console.error("Error fetching current user in home:", error);
            setIsAdmin(false);
            setIsLoggedIn(false);
        }
    };

    const handleLogout = () => {
        window.localStorage.clear("bearer");
        enqueueSnackbar("Logged Out!", { variant: "success" });
        return navigate("/login");
    };

    useEffect(async () => {
        await verifyCurrentUser();
    }, []);

    return (
        <Grid container m={0}>
            <Grid item xs={2} sm={2} md={2} sx={{ px: 2 }}>
                <Typography
                    variant="h2"
                    fontFamily="Bartender Serif"
                    sx={{ color: "#ccc" }}
                >
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Foodie
                    </Link>
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{ display: "inline-flex", color: "#DD7230", py: 3 }}
            >
                {isLoggedIn && (
                    <Typography
                        variant="h5"
                        fontFamily="Bartender Serif"
                        sx={{ mx: 2 }}
                    >
                        <Link
                            to="/home"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            {t("nav:home")}
                        </Link>
                    </Typography>
                )}

                {isAdmin && (
                    <Typography
                        variant="h5"
                        fontFamily="Bartender Serif"
                        sx={{ mx: 2 }}
                    >
                        <Link
                            to="/menu/add"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            {t("nav:addMenu")}
                        </Link>
                    </Typography>
                )}

                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    {t("nav:contactUs")}
                </Typography>
                <Typography
                    variant="h5"
                    fontFamily="Bartender Serif"
                    sx={{ mx: 2 }}
                >
                    {t("nav:aboutUs")}
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
                {isLoggedIn ? (
                    <React.Fragment>
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                        >
                            <Avatar
                                sx={{ backgroundColor: "#DD7230", mx: 2 }}
                                src={profileUrl}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                    mt: 1.5,
                                    width: 200,
                                    "& .MuiAvatar-root": {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    "&:before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform:
                                            "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                            }}
                            anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                            }}
                        >
                            <MenuItem>
                                <Avatar /> Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button
                            sx={{
                                border: "3px solid #DD7230",
                                color: "#DD7230",
                                ml: 2,
                            }}
                        >
                            <Link
                                to="/signup"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                {t("auth:signup")}
                            </Link>
                        </Button>
                        <Button
                            sx={{
                                border: "3px solid #DD7230",
                                color: "#DD7230",
                                ml: 2,
                            }}
                        >
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                {t("auth:login")}
                            </Link>
                        </Button>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
};

export default Navbar;
