import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Typography,
    Button,
    FormControl,
    Divider,
    Chip,
    Select,
    InputLabel,
    MenuItem,
    FormGroup,
    Checkbox,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
} from "@mui/material";
import TextInput from "../shared/TextInput";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./MenuForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../navbar/NavBar";
import HelperText from "../shared/HelperText";
import { useTranslation } from "react-i18next";

const initialFormValues = {
    name: "",
    description: "",
    category: "",
    price: "",
    preparationTime: "",
    available: false,
    is_jain: false,
    is_veg: "",
};

const initialIngredientForm = {
    name: "",
    value: "",
};

const MenuForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [recipeListCount, setRecipeListCount] = useState(1);
    const [recipeList, setRecipeList] = useState([]);
    const [ingredientList, setIngredientList] = useState({});
    const [ingredientForm, setIngredientForm] = useState(initialIngredientForm);
    const [uploadedImages, setUploadedImages] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [ingredientFormErrors, setIngredientFormErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);

    const [showIngredientsForm, setShowIngredientsForm] = useState(false);
    const [categoryList, setCategoryList] = useState([]);

    const [allImages, setAllImages] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation(["item", "home", "common"]);

    const fetchAllCategories = () => {
        axios
            .get(`http://localhost:5001/category/all`)
            .then((response) => {
                setCategoryList(response.data.categories);
            })
            .catch((err) => {
                console.log("Error loading categories!", err?.response);
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
            if (!response.data.user.is_admin) {
                enqueueSnackbar("Unauthorized access", { variant: "warning" });
                return navigate("/home");
            }
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
        fetchAllCategories();

        // If form is opened for editing
        if (location.state === null) {
            return;
        }

        let { edit, menuItem } = location.state;
        setEditMode(edit ?? false);
        setFormValues({ ...(menuItem ?? initialFormValues) });
        setRecipeListCount(menuItem.recipe.length ?? 0);
        setRecipeList(menuItem.recipe ?? []);
        setIngredientList(menuItem.ingredients ?? {});
    }, []);

    const validateInputs = (name, value) => {
        if ((name === "name" || name === "description") && value.length < 3) {
            return `Invalid ${name}`;
        }

        if (
            (name === "price" || name === "preparationTime") &&
            (!/[0-9]/i.test(value) || parseFloat(value) < 0)
        ) {
            return `Invalid ${name}`;
        }

        if (name === "value" && value.length === 0) {
            return `Invalid ${name}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: validateInputs(name, value),
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormValues({
            ...formValues,
            [name]: checked,
        });
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value === "true",
        });
    };

    const handleRecipeChange = (e) => {
        let { name, value } = e.target;

        let tempRecipeList = [...recipeList];
        tempRecipeList[parseInt(name.substr(-1, 1))] = value;
        setRecipeList([...tempRecipeList]);
    };

    const handleRecipeRemove = (recipeNumber) => {
        let tempRecipeList = recipeList;
        if (recipeListCount !== 1) {
            tempRecipeList.splice(recipeNumber, 1);
            setRecipeList([...tempRecipeList]);
            setRecipeListCount((count) => count - 1);
        }
    };

    const handleIngredientInputChange = (e) => {
        const { name, value } = e.target;

        setIngredientForm({
            ...ingredientForm,
            [name]: value,
        });

        setIngredientFormErrors({
            ...ingredientFormErrors,
            [name]: validateInputs(name, value),
        });
    };

    const handleAddIngredient = (e) => {
        setIngredientList({
            ...ingredientList,
            [ingredientForm.name]: ingredientForm.value,
        });
        setIngredientForm(initialIngredientForm);
        setShowIngredientsForm(false);
    };

    const handleIngredientEdit = (ingredient) => {
        setShowIngredientsForm(true);
        setIngredientForm({
            name: ingredient,
            value: ingredientList[ingredient],
        });
    };

    const handleIngredientDelete = (ingredient) => {
        let tempIngredientList = ingredientList;
        delete tempIngredientList[ingredient];
        setIngredientList({ ...tempIngredientList });
    };

    useEffect(() => {
        setHasErrors(Object.keys(formErrors).some((key) => !!formErrors[key]));
    }, [formErrors]);

    const handleUploadChange = (e) => {
        let { name, value, files } = e.target;

        const imagesFormData = new FormData();
        Object.keys(files).map((key) => {
            imagesFormData.append("itemImage", files[key]);
        });

        axios
            .post(`http://localhost:5001/upload/cache`, imagesFormData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    authorization: window.localStorage.getItem("bearer"),
                },
            })
            .then((response) => {
                let tempList = {};
                let someArr = [];

                Object.keys(files).forEach((key, idx) => {
                    let tempList2 = {};
                    tempList[files[key].name] = response.data.filesNames[idx];
                    tempList2 = {
                        fileData: files[key],
                        filename: files[key].name,
                        cacheFile: response.data.filesNames[idx],
                    };
                    someArr.push(tempList2);
                    if (
                        Object.keys(tempList).length ===
                        response.data.filesNames.length
                    ) {
                        setUploadedImages({
                            ...uploadedImages,
                            ...tempList,
                        });

                        setAllImages([...allImages, ...someArr]);
                    }
                });
            })
            .catch((error) => {
                console.error("Error from cache upload:", error?.response);
                if (error.response.status === 401) {
                    enqueueSnackbar("Login is required", {
                        variant: "warning",
                    });
                    return navigate("/login");
                }
                if (error.response.status === 403) {
                    enqueueSnackbar("Unauthorized request", {
                        variant: "warning",
                    });
                    return navigate("/home");
                }
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (editMode) {
            axios
                .put(
                    `http://localhost:5001/menu/edit/${formValues._id}`,
                    {
                        ...formValues,
                        ingredients: ingredientList,
                        recipe: recipeList,
                        images: allImages.map((file) => file.cacheFile),
                        existingImages: [...formValues.images],
                    },
                    {
                        headers: {
                            authorization:
                                window.localStorage.getItem("bearer"),
                        },
                    }
                )
                .then((editResp) => {
                    enqueueSnackbar("Menu item edited successfully!", {
                        variant: "success",
                    });
                    return navigate("/home");
                })
                .catch((editErr) => {
                    console.error("Error in Edit:", editErr?.response?.data);
                    if (editErr.response.status === 401) {
                        enqueueSnackbar("Login is required", {
                            variant: "warning",
                        });
                        return navigate("/login");
                    }
                    if (editErr.response.status === 403) {
                        enqueueSnackbar("Unauthorized request", {
                            variant: "warning",
                        });
                        return navigate("/home");
                    }
                    return enqueueSnackbar(
                        editErr?.response?.data?.message ??
                            "Please try again in a while!",
                        { variant: "error" }
                    );
                });
        } else {
            axios
                .post(
                    `http://localhost:5001/menu/add`,
                    {
                        ...formValues,
                        ingredients: ingredientList,
                        recipe: recipeList,
                        images: allImages.map((file) => file.cacheFile),
                    },
                    {
                        headers: {
                            authorization:
                                window.localStorage.getItem("bearer"),
                        },
                    }
                )
                .then((response) => {
                    enqueueSnackbar("Menu item added successfully!", {
                        variant: "success",
                    });
                    return navigate("/home");
                })
                .catch((err) => {
                    console.error(
                        "Error in adding menu item:",
                        err?.response?.data
                    );
                    if (err.response.status === 401) {
                        enqueueSnackbar("Login is required", {
                            variant: "warning",
                        });
                        return navigate("/login");
                    }
                    if (err.response.status === 403) {
                        enqueueSnackbar("Unauthorized request", {
                            variant: "warning",
                        });
                        return navigate("/home");
                    }
                    return enqueueSnackbar(
                        err?.response?.data?.message ??
                            "Please try again in a while!",
                        { variant: "error" }
                    );
                });
        }
    };

    const handleImageDelete = (idx, mode = 0) => {
        if (mode === 0) {
            let tempImages = allImages;
            tempImages.splice(idx, 1);
            setAllImages([...tempImages]);
        } else {
            let tempImages = formValues.images;
            tempImages.splice(idx, 1);
            setFormValues({
                ...formValues,
                images: [...tempImages],
            });
        }
    };

    return (
        <Grid container>
            <Navbar />
            <Grid item xs={12} md={12} sm={12} my={1} sx={{ px: 2 }}>
                <Typography
                    variant="h4"
                    fontFamily="Bebas Neue"
                    textAlign="center"
                >
                    {editMode
                        ? t("item:formTitleEdit")
                        : t("item:formTitleAdd")}
                </Typography>
                <Divider sx={{ my: 1 }}>
                    <Chip label={t("item:formSubtitle")} />
                </Divider>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <form method="POST" onSubmit={handleFormSubmit}>
                    {/* Main Form */}
                    <Grid container>
                        <Grid item xs={2} md={2} sm={2}></Grid>
                        <Grid item xs={8} md={8} sm={8} my={2} sx={{ px: 2 }}>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:itemName")}
                                    label={t("item:itemName")}
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    error={!!formErrors.name}
                                />
                                <HelperText text={formErrors?.name} />
                            </FormControl>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:description")}
                                    label={t("item:description")}
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                    error={!!formErrors.description}
                                />
                                <HelperText text={formErrors?.description} />
                            </FormControl>
                            <FormControl sx={{ minWidth: 200, my: 1 }}>
                                <InputLabel id="demo-simple-select-label">
                                    {t("item:courseType")}
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={t("item:courseType")}
                                    defaultValue={""}
                                    required
                                    name="category"
                                    value={formValues.category ?? ""}
                                    onChange={handleInputChange}
                                >
                                    {categoryList.map((category) => (
                                        <MenuItem
                                            key={category._id}
                                            value={category._id}
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
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:price")}
                                    label={t("item:price")}
                                    name="price"
                                    type="number"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    error={!!formErrors.price}
                                />
                                <HelperText text={formErrors?.price} />
                            </FormControl>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:preparationTime")}
                                    label={t("item:preparationTime")}
                                    name="preparationTime"
                                    type="number"
                                    value={formValues.preparationTime}
                                    onChange={handleInputChange}
                                    error={!!formErrors.preparationTime}
                                />
                                <HelperText
                                    text={formErrors?.preparationTime}
                                />
                            </FormControl>

                            <Divider sx={{ my: 1 }} />

                            {/* Food Types Section */}
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues.available}
                                        />
                                    }
                                    name="available"
                                    label={t("home:available")}
                                    onChange={handleCheckboxChange}
                                />
                            </FormGroup>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={formValues.is_veg}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel
                                        value={true}
                                        control={<Radio />}
                                        label={t("home:veg")}
                                        name="is_veg"
                                    />
                                    <FormControlLabel
                                        value={false}
                                        control={<Radio />}
                                        label={t("home:nonVeg")}
                                        name="is_veg"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues.is_jain}
                                        />
                                    }
                                    label="Jain"
                                    name="is_jain"
                                    onChange={handleCheckboxChange}
                                />
                            </FormGroup>
                            <Divider sx={{ my: 1 }} />

                            {/* Ingredients section */}
                            <Grid container my={2}>
                                <Grid
                                    item
                                    xs={4}
                                    sm={6}
                                    md={2}
                                    textAlign="start"
                                >
                                    <Typography variant="h6">
                                        {t("item:ingredient", { count: 2 })}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} sm={6} md={10}>
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            setShowIngredientsForm(
                                                (value) => !value
                                            )
                                        }
                                    >
                                        {/* ➕ */}
                                        {t("item:addAnIngredient")}
                                    </Button>
                                </Grid>
                            </Grid>

                            {showIngredientsForm && (
                                <Card sx={{ p: 2 }} elevation={2}>
                                    <Grid container>
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sm={12}
                                            textAlign="center"
                                        >
                                            <Typography variant="body1">
                                                {t("item:ingredient", {
                                                    count: 1,
                                                })}
                                            </Typography>
                                            <FormControl sx={{ mx: 1 }}>
                                                <TextInput
                                                    size="small"
                                                    placeholder={`${t(
                                                        "item:ingredient",
                                                        { count: 1 }
                                                    )} ${t("item:name")}`}
                                                    label={`${t(
                                                        "item:ingredient",
                                                        { count: 1 }
                                                    )} ${t("item:name")}`}
                                                    name="name"
                                                    onChange={
                                                        handleIngredientInputChange
                                                    }
                                                    value={ingredientForm.name}
                                                />
                                                <HelperText
                                                    text={
                                                        ingredientFormErrors?.name
                                                    }
                                                />
                                            </FormControl>
                                            <FormControl sx={{ mx: 1 }}>
                                                <TextInput
                                                    size="small"
                                                    placeholder={`${t(
                                                        "item:amount"
                                                    )} / ${t("item:quantity")}`}
                                                    label={`${t(
                                                        "item:amount"
                                                    )} / ${t("item:quantity")}`}
                                                    name="value"
                                                    value={ingredientForm.value}
                                                    onChange={
                                                        handleIngredientInputChange
                                                    }
                                                />
                                                <HelperText
                                                    text={
                                                        ingredientFormErrors?.value
                                                    }
                                                />
                                            </FormControl>
                                            <br />
                                            <FormControl
                                                sx={{ display: "inline" }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    sx={{ m: 1 }}
                                                    onClick={
                                                        handleAddIngredient
                                                    }
                                                >
                                                    {t("common:add")}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{ m: 1 }}
                                                    onClick={() =>
                                                        setShowIngredientsForm(
                                                            false
                                                        )
                                                    }
                                                >
                                                    {t("common:cancel")}
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Card>
                            )}

                            {/* Ingredients list */}
                            <Grid container>
                                {Object.keys(ingredientList).map(
                                    (ingredient, idx) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={4}
                                            key={ingredient}
                                        >
                                            <Card
                                                elevation={2}
                                                sx={{ p: 1, m: 1 }}
                                            >
                                                <Typography
                                                    sx={{ display: "inline" }}
                                                >
                                                    {ingredient} -{" "}
                                                    {ingredientList[ingredient]}
                                                </Typography>
                                                <Box
                                                    component="div"
                                                    sx={{ display: "inline" }}
                                                    textAlign="end"
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            handleIngredientEdit(
                                                                ingredient
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            handleIngredientDelete(
                                                                ingredient
                                                            )
                                                        }
                                                    >
                                                        ❌
                                                    </Button>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    )
                                )}
                            </Grid>

                            <Divider sx={{ my: 1 }} />

                            {/* Recipe section */}
                            <Typography variant="h6">
                                {t("item:recipe")}
                            </Typography>

                            <Grid container my={2}>
                                {[...Array(recipeListCount).keys()].map(
                                    (count) => (
                                        <React.Fragment key={count}>
                                            <Grid
                                                item
                                                xs={2}
                                                md={2}
                                                sm={2}
                                                sx={{ my: 1 }}
                                            >
                                                <Button variant="contained">
                                                    {t("item:step")} -{" "}
                                                    {count + 1}
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}
                                                sm={1}
                                                md={1}
                                                textAlign="start"
                                                sx={{ my: 1 }}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        setRecipeListCount(
                                                            (count) => count + 1
                                                        )
                                                    }
                                                >
                                                    ➕
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleRecipeRemove(
                                                            count
                                                        )
                                                    }
                                                >
                                                    ➖
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={8}
                                                sm={9}
                                                md={9}
                                                textAlign="start"
                                            >
                                                <FormControl
                                                    fullWidth
                                                    sx={{ my: 1 }}
                                                >
                                                    <TextInput
                                                        placeholder={`${t(
                                                            "item:recipe"
                                                        )} ${t(
                                                            "item:step"
                                                        )} - ${count + 1}`}
                                                        label={`${t(
                                                            "item:recipe"
                                                        )} ${t(
                                                            "item:step"
                                                        )} - ${count + 1}`}
                                                        name={`recipe${count}`}
                                                        onChange={
                                                            handleRecipeChange
                                                        }
                                                        value={
                                                            recipeList[count] ??
                                                            ""
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </React.Fragment>
                                    )
                                )}
                            </Grid>

                            <Divider sx={{ my: 1 }} />

                            {/* Images section */}
                            <Typography variant="h6" my={1}>
                                {t("item:images")}
                            </Typography>

                            <input
                                id="itemImagesUploadInput"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                style={{ visibility: "hidden" }}
                                multiple={true}
                                onChange={handleUploadChange}
                            />

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    document
                                        .getElementById("itemImagesUploadInput")
                                        .click()
                                }
                            >
                                <CameraAltRoundedIcon />
                            </Button>

                            <Grid container>
                                {editMode &&
                                    formValues?.images?.map((imageUrl, idx) => (
                                        <Card
                                            className="container"
                                            key={idx}
                                            elevation={3}
                                            sx={{ m: 2 }}
                                        >
                                            <img
                                                src={imageUrl}
                                                key={idx}
                                                className="uploadedImage"
                                                style={{
                                                    height: "200px",
                                                    width: "200px",
                                                }}
                                            />
                                            <div className="overlay">
                                                <Button
                                                    className="text"
                                                    size="large"
                                                    sx={{ fontSize: "30px" }}
                                                    onClick={() =>
                                                        handleImageDelete(
                                                            idx,
                                                            1
                                                        )
                                                    }
                                                >
                                                    ❌
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                {allImages.map((imageData, idx) => (
                                    <Card
                                        className="container"
                                        key={idx}
                                        elevation={3}
                                        sx={{ m: 2 }}
                                    >
                                        <img
                                            src={URL.createObjectURL(
                                                imageData.fileData
                                            )}
                                            key={idx}
                                            className="uploadedImage"
                                            style={{
                                                height: "200px",
                                                width: "200px",
                                            }}
                                        />
                                        <div className="overlay">
                                            <Button
                                                className="text"
                                                size="large"
                                                sx={{ fontSize: "30px" }}
                                                onClick={() =>
                                                    handleImageDelete(idx, 0)
                                                }
                                            >
                                                ❌
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Grid>

                            <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid item xs={2} md={2} sm={2}></Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                            sm={12}
                            sx={{ mt: 2, mb: 2 }}
                            textAlign="center"
                        >
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                size="large"
                                type="submit"
                                disabled={hasErrors}
                            >
                                {t(
                                    `common:${(editMode
                                        ? "Edit"
                                        : "Add"
                                    ).toLowerCase()}`
                                )}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                size="large"
                                onClick={() => navigate("/home")}
                            >
                                {t("common:cancel")}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default MenuForm;
