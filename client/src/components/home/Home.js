import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import TextInput from "../shared/TextInput";
import axios from "axios";
import CategorySection from "./CategorySection";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    selectDark: {
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DD7230",
            color: "white",
        },
        "& .MuiOutlinedInput-input": {
            color: "white",
        },
    },
    textDark: {
        "& .MuiOutlinedInput-root, .MuiInputBase-sizeSmall, MuiInputBase-colorPrimary":
            {
                border: "1px solid red",
            },
    },
}));

const Home = () => {
    const classes = useStyles();
    const [filters, setFilters] = useState({});
    const [allItems, setAllItems] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [toDeleteItem, setToDeleteItem] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { t } = useTranslation(["home", "common"]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const fetchAllItems = () => {
        axios
            .get(`http://localhost:5001/menu/all`, {
                params: {
                    ...filters,
                },
                headers: {
                    authorization: window.localStorage.getItem("bearer"),
                },
            })
            .then((response) => {
                setAllItems(response.data.menuItems);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    enqueueSnackbar("Please login to view home page!", {
                        variant: "warning",
                    });
                    return navigate("/login");
                }
                if (err.response.status === 440) {
                    enqueueSnackbar(err.response?.data?.message, {
                        variant: "warning",
                    });
                    return navigate("/login");
                }
                console.error(
                    "Error in fetching all items:",
                    err?.response?.data,
                    err.response
                );
            });
    };

    const fetchAllCategories = () => {
        axios
            .get(`http://localhost:5001/category/all`)
            .then((response) => {
                setAllCategories(response.data.categories);
            })
            .catch((err) => {
                console.error(
                    "Error in fetching all categories:",
                    err?.response?.data
                );
            });
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
            return;
        } catch (error) {
            console.error("Error fetching current user in home:", error);
            enqueueSnackbar("Please login to view home page!", {
                variant: "error",
            });
            return navigate("/login");
        }
    };

    useEffect(() => {
        verifyCurrentUser();
        fetchAllItems();
        fetchAllCategories();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleOpenDeleteDialog = (itemId) => {
        setOpenDeleteDialog(true);
        setToDeleteItem(itemId);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setToDeleteItem("");
    };

    const handleItemDelete = () => {
        axios
            .delete(`http://localhost:5001/menu/delete/${toDeleteItem}`, {
                headers: {
                    authorization: window.localStorage.getItem("bearer"),
                },
            })
            .then((deleteResp) => {
                handleCloseDeleteDialog();
                fetchAllItems();
                if (deleteResp.data.deleteResp.modifiedCount === 1) {
                    return enqueueSnackbar("Menu item deleted successfully!", {
                        variant: "success",
                    });
                } else {
                    return enqueueSnackbar(
                        "Oops! Menu item can't be delete, Please try again!",
                        { variant: "warning" }
                    );
                }
            })
            .catch((deleteErr) => {
                console.error("Error in delete:", deleteErr?.response);
                if (deleteErr.response.status === 401) {
                    enqueueSnackbar("Login is required", {
                        variant: "warning",
                    });
                    return navigate("/login");
                }
                if (deleteErr.response.status === 403) {
                    return enqueueSnackbar("Unauthorized request", {
                        variant: "warning",
                    });
                }
                handleCloseDeleteDialog();
                return enqueueSnackbar(
                    "Oops! Menu item can't be delete, Please try again!",
                    { variant: "warning" }
                );
            });
    };

    useEffect(() => {
        fetchAllItems();
    }, [filters]);

    return (
        <Grid
            container
            sx={{
                background: `url(https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80)`,
            }}
        >
            <Navbar />

            {/* Filter, Sorting Options */}
            <Grid container>
                <Grid item xs={12} md={6} sm={6} sx={{ p: 2 }}>
                    <form method="POST">
                        <FormControl fullWidth sx={{ mx: 1, width: "80%" }}>
                            <TextInput
                                placeholder={t("home:searchFoodItems")}
                                label={t("home:searchFoodItems")}
                                name="query"
                                size="small"
                                value={filters.query}
                                onChange={handleFilterChange}
                                className={classes.textDark}
                                mode="dark"
                            />
                        </FormControl>
                    </form>
                </Grid>
                <Grid item xs={12} md={6} sm={6} textAlign="end" sx={{ p: 2 }}>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel
                            id="demo-simple-select-label"
                            sx={{
                                color: "white",
                            }}
                        >
                            {t("home:price")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={availability}
                            label={t("home:price")}
                            name="price"
                            size="small"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={0}>-</MenuItem>
                            <MenuItem value={1}>{t("home:lowToHigh")}</MenuItem>
                            <MenuItem value={-1}>
                                {t("home:highToLow")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel
                            id="demo-simple-select-label"
                            sx={{
                                color: "white",
                            }}
                        >
                            {t("home:availability")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={availability}
                            label={t("home:availability")}
                            size="small"
                            name="available"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>{t("home:all")}</MenuItem>
                            <MenuItem value={true}>
                                {t("home:available")}
                            </MenuItem>
                            <MenuItem value={false}>
                                {t("home:notAvailable")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel
                            id="demo-simple-select-label"
                            sx={{
                                color: "white",
                            }}
                        >
                            {t("home:course")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("home:course")}
                            name="category"
                            size="small"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>{t("home:all")}</MenuItem>
                            {allCategories.map((category) => (
                                <MenuItem
                                    value={category._id}
                                    key={category._id}
                                >
                                    {t(
                                        `home:${category.name
                                            .toString()
                                            .toLowerCase()}`
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel
                            id="demo-simple-select-label"
                            sx={{
                                color: "white",
                            }}
                        >
                            {t("home:vegOrNonVeg")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("home:vegOrNonVeg")}
                            size="small"
                            name="is_veg"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>{t("home:all")}</MenuItem>
                            <MenuItem value={true}>{t("home:veg")}</MenuItem>
                            <MenuItem value={false}>
                                {t("home:nonVeg")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Fallback message */}
            <Grid item xs={12} sm={12} md={12} my={2}>
                {allItems.length === 0 && (
                    <center>
                        <Typography
                            fontFamily="Bartender SmCond Serif Pressed"
                            variant="h3"
                            sx={{ color: "#ccc" }}
                        >
                            {t("home:noMenuFoundMessage")}
                        </Typography>
                    </center>
                )}
            </Grid>

            {/* Categories Section */}
            {allCategories.map((category) => (
                <CategorySection
                    items={allItems.filter(
                        (menuItem) => category._id === menuItem.category
                    )}
                    category={category}
                    key={category._id}
                    handleOpenDeleteDialog={handleOpenDeleteDialog}
                    isAdmin={isAdmin}
                />
            ))}

            {/* Delete item dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete a menu item?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("home:deleteWarning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        {t("common:cancel")}
                    </Button>
                    <Button onClick={() => handleItemDelete()} autoFocus>
                        {t("common:delete")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </Grid>
    );
};

export default Home;
