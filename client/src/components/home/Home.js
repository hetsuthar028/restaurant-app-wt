import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    Divider,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
} from "@mui/material";
import ItemCard from "../menu-item/ItemCard";
import TextInput from "../shared/TextInput";
import axios from "axios";

const Home = () => {
    const [age, setAge] = React.useState("");
    const [filters, setFilters] = useState({});
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    const fetchAllItems = () => {
        axios
            .get(`http://localhost:5001/menu/all`)
            .then((response) => {
                console.log("All menu items:", response.data.menuItems);
                setAllItems(response.data.menuItems);
                setFilteredItems(response.data.menuItems);
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
                console.log("All categories:", response.data.categories);
                setAllCategories(response.data.categories);
            })
            .catch((err) => {
                console.log(
                    "Error in fetching all categories:",
                    err?.response?.data
                );
            });
    };

    useEffect(() => {
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

    useEffect(() => {
        console.log("Filters", filters);
    }, [filters]);

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <Grid container>
            <Grid container>
                <Grid item xs={12} md={6} sm={6} sx={{ p: 2 }}>
                    <FormControl sx={{ mx: 1, width: "75%" }}>
                        <TextInput
                            placeholder="Search Food Items"
                            label="Search Food Items"
                            name="itemFilter"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} sm={6} textAlign="end" sx={{ p: 2 }}>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel id="demo-simple-select-label">
                            Availability
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={availability}
                            defaultValue={""}
                            label="Availability"
                            name="availability"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={true}>Available</MenuItem>
                            <MenuItem value={false}>Not available</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, mx: 1 }}>
                        <InputLabel id="demo-simple-select-label">
                            Course
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Course"
                            name="category"
                            onChange={handleFilterChange}
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
                        <InputLabel id="demo-simple-select-label">
                            Veg or Non-veg
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Veg or Non-veg"
                            name="is_veg"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={true}>Veg</MenuItem>
                            <MenuItem value={false}>Non-veg</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {allCategories.map((category) => (
                <Grid item xs={12} md={12} sm={12} key={category._id}>
                    <Typography
                        fontFamily="Bebas Neue"
                        variant="h4"
                        textAlign="center"
                        my={1}
                    >
                        {category.name}
                    </Typography>
                    <Divider sx={{ mx: 2 }} />

                    <Grid container>
                        {allItems.map(
                            (menuItem) =>
                                category._id === menuItem.category && (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={3}
                                        sx={{ p: 2 }}
                                        key={menuItem._id}
                                    >
                                        <ItemCard menuItem={menuItem} />
                                    </Grid>
                                )
                        )}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default Home;
