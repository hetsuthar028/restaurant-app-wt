import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    Divider,
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
import ItemCard from "../menu-item/ItemCard";
import TextInput from "../shared/TextInput";
import axios from "axios";
import CategorySection from "./CategorySection";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/NavBar";

const useStyles = makeStyles((theme) => ({
    selectDark: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DD7230',
            color: 'white'
          },
          '& .MuiOutlinedInput-input': {
              color: 'white'
          },
    },
    textDark: {
        '& .MuiOutlinedInput-root, .MuiInputBase-sizeSmall, MuiInputBase-colorPrimary': {
            border: '1px solid red'
        }
    }
}))

const Home = () => {
    const classes = useStyles();
    const [filters, setFilters] = useState({});
    const [allItems, setAllItems] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [toDeleteItem, setToDeleteItem] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const fetchAllItems = () => {
        axios
            .get(`http://localhost:5001/menu/all`, {
                params: {
                    ...filters,
                },
            })
            .then((response) => {
                setAllItems(response.data.menuItems);
            })
            .catch((err) => {
                console.log(
                    "Error in fetching all items:",
                    err?.response?.data
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
                console.log(
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
            console.log("Error fetching current user in home:", error);
            enqueueSnackbar("Please login to view home page!", {
                variant: "error",
            });
            return navigate("/login");
        }
    };

    useEffect(async () => {
        await verifyCurrentUser();
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
            .delete(`http://localhost:5001/menu/delete/${toDeleteItem}`)
            .then((deleteResp) => {
                console.log("Delete response:", deleteResp);
                handleCloseDeleteDialog();
                fetchAllItems();
                if (deleteResp.data.deleteResp.modifiedCount === 1) {
                    return enqueueSnackbar("Menu item deleted successfully!", {
                        variant: "warning",
                    });
                } else {
                    return enqueueSnackbar(
                        "Oops! Menu item can't be delete, Please try again!",
                        { variant: "warning" }
                    );
                }
            })
            .catch((deleteErr) => {
                console.log("Error in delete:", deleteErr);
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
            <Grid container>
                <Grid item xs={12} md={6} sm={6} sx={{ p: 2 }}>
                    <form method='POST'>
                    <FormControl fullWidth sx={{ mx: 1, width: "80%" }}>
                        <TextInput
                            placeholder="Search Food Items"
                            label="Search Food Items"
                            name="query"
                            size="small"
                            value={filters.query}
                            onChange={handleFilterChange}
                            className={classes.textDark}
                            mode='dark'
                        />
                    </FormControl>
                    </form>
                </Grid>
                <Grid item xs={12} md={6} sm={6} textAlign="end" sx={{ p: 2 }}>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                            color: 'white'
                        }}>
                            Price
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={availability}
                            label="Price"
                            name="price"
                            size="small"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={0}>-</MenuItem>
                            <MenuItem value={1}>Low to High</MenuItem>
                            <MenuItem value={-1}>High to Low</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1, }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                            color: 'white'
                        }}>
                            Availability
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={availability}
                            label="Availability"
                            size="small"
                            name="available"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={true}>Available</MenuItem>
                            <MenuItem value={false}>Not available</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                            color: 'white'
                        }}>
                            Course
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Course"
                            name="category"
                            size="small"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            {allCategories.map((category) => (
                                <MenuItem
                                    value={category._id}
                                    key={category._id}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                            color: 'white'
                        }}>
                            Veg or Non-veg
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Veg or Non-veg"
                            size="small"
                            name="is_veg"
                            onChange={handleFilterChange}
                            className={classes.selectDark}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={true}>Veg</MenuItem>
                            <MenuItem value={false}>Non-veg</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
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
                        Click on delete button to remove this menu item from the
                        list. Doing this will remove item from records and won't
                        be available later!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleItemDelete()} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Home;
