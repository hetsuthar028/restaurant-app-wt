import React from "react";
import { Card, Grid, Typography, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";

const ItemCard = (props) => {
    const { menuItem, handleOpenDeleteDialog, isAdmin } = props;
    const navigate = useNavigate();

    const handleEdit = (menuId) => {
        navigate("/menu/add", {
            state: { edit: true, menuId: menuId, menuItem: menuItem },
        });
    };

    return (
        // sx={{ border: "1.5px #F4C95D solid" }}
        <Card elevation={4}>
            <Grid container>
                <Grid item xs={10} sm={10} md={10} sx={{ pl: 2, py: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {/* Chilli Paneer */}
                        {menuItem.name}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={2}
                    md={2}
                    sm={2}
                    sx={{ pr: 2, py: 1 }}
                    textAlign="end"
                >
                    <CircleIcon
                        sx={{
                            width: "25px",
                            height: "25px",
                            color: menuItem.is_veg ? "green" : "red",
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={12} sm={12}>
                    <img
                        // src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHw%3D"
                        src={menuItem.images[0]}
                        style={{ height: "200px", width: "100%" }}
                    />
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ pl: 2, py: 1 }}>
                    <Button variant="contained" size="small" sx={{ mx: 1 }}>
                        ₹{menuItem.price}/-
                    </Button>

                    {/* Only if the user is admin */}
                    {isAdmin && (
                        <React.Fragment>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "#854D27", mx: 1 }}
                            >
                                <Typography
                                    fontFamily="Bartender SmCond Serif Pressed"
                                    onClick={() => handleEdit(menuItem._id)}
                                >
                                    Edit
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "#DD7230", mx: 1 }}
                            >
                                <Typography
                                    fontFamily="Bartender SmCond Serif Pressed"
                                    onClick={() =>
                                        handleOpenDeleteDialog(menuItem._id)
                                    }
                                >
                                    Delete
                                </Typography>
                            </Button>
                        </React.Fragment>
                    )}
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2">
                        {`${menuItem.description.slice(0, 120)}...`}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ItemCard;
