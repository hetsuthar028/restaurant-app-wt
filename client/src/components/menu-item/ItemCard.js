import React from "react";
import { Card, Grid, Typography, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const ItemCard = () => {
    return (
        // sx={{ border: "1.5px #F4C95D solid" }}
        <Card elevation={4}>
            <Grid container>
                <Grid item xs={10} sm={10} md={10} sx={{ pl: 2, py: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Chilli Paneer
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
                        sx={{ width: "25px", height: "25px", color: "green" }}
                    />
                </Grid>

                <Grid item xs={12} md={12} sm={12}>
                    <img
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHw%3D"
                        style={{ height: "200px", width: "100%" }}
                    />
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ pl: 2, py: 1 }}>
                    <Button variant="contained" size="small">
                        ₹799/-
                    </Button>
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ pl: 2, py: 1 }}>
                    <Typography variant="subtitle2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore...
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ItemCard;
