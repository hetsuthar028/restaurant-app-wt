import React from "react";
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

const Home = () => {
    const [age, setAge] = React.useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <Grid container>
            <Grid item xs={12} md={12} sm={12}>
                <Typography
                    fontFamily="Bebas Neue"
                    variant="h4"
                    textAlign="center"
                    my={1}
                >
                    Starters
                </Typography>
                <Divider sx={{ mx: 2 }} />

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
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sm={6}
                        textAlign="end"
                        sx={{ p: 2 }}
                    >
                        <FormControl sx={{ minWidth: 120, mx: 1 }}>
                            <InputLabel id="demo-simple-select-label">
                                Availability
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Availability"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>All</MenuItem>
                                <MenuItem value={20}>Available</MenuItem>
                                <MenuItem value={30}>Not available</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120, mx: 1 }}>
                            <InputLabel id="demo-simple-select-label">
                                Course
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Course"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>All</MenuItem>
                                <MenuItem value={20}>Starters</MenuItem>
                                <MenuItem value={30}>Beverages</MenuItem>
                                <MenuItem value={40}>Pizza</MenuItem>
                                <MenuItem value={50}>Mains</MenuItem>
                                <MenuItem value={60}>Dessert</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120, mx: 1 }}>
                            <InputLabel id="demo-simple-select-label">
                                Veg or Non-veg
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Veg or Non-veg"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Veg</MenuItem>
                                <MenuItem value={20}>Jain</MenuItem>
                                <MenuItem value={30}>Non-veg</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container>
                    {[1, 2, 3, 4, 5, 6, 7].map((a) => (
                        <Grid item xs={12} sm={4} md={3} sx={{ p: 2 }} key={a}>
                            <ItemCard />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Home;
