import React from "react";
import { Card, Grid, Typography, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./swiper.css";

const ItemCard = (props) => {
    const { menuItem, handleOpenDeleteDialog, isAdmin } = props;
    const navigate = useNavigate();
    const { t } = useTranslation(["common"]);

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
                    {menuItem.images.length === 0 ? (
                        <img
                            src="https://www.logomaker.com/api/main/images/1j+ojVVCOMkX9Wyrexe4hGff0anU9UJZxBzAwWIyPj1B...Q1vlSkqhvJ9sKNia1hV7FANhxwHe8c8jSxtAN5K0lM4oHrONIo="
                            style={{ height: "200px", width: "auto" }}
                        />
                    ) : (
                        <Swiper className="mySwiper">
                            {menuItem.images.map((imageSrc) => (
                                <SwiperSlide key={imageSrc}>
                                    <img
                                        src={imageSrc}
                                        style={{
                                            height: "200px",
                                            width: "100%",
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
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
                                    {t("common:edit")}
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
                                    {t("common:delete")}
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
