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

const imageDataFormat = {
    fileData: {},
    cacheFilename: "",
};

const MenuForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [recipeListCount, setRecipeListCount] = useState(1);
    const [recipeList, setRecipeList] = useState([]);
    const [ingredientList, setIngredientList] = useState({});
    const [ingredientForm, setIngredientForm] = useState(initialIngredientForm);
    const [uploadedImages, setUploadedImages] = useState({});

    const [tempImage, setTempImage] = useState([]);
    const [imageURL, setImageURL] = useState([]);
    const [showIngredientsForm, setShowIngredientsForm] = useState(false);
    const [categoryList, setCategoryList] = useState([]);

    const [allImages, setAllImages] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const fetchAllCategories = () => {
        axios
            .get(`http://localhost:5001/category/all`)
            .then((response) => {
                setCategoryList(response.data.categories);
            })
            .catch((err) => {
                console.log("Error loading categories!", err?.response?.data);
            });
    };

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
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

    useEffect(() => {
        // console.log("Recipe List Data", recipeList);
    }, [recipeList]);

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
    };

    const handleAddIngredient = (e) => {
        // console.log("Form values", ingredientForm);
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

    const handleUploadChange = (e) => {
        let { name, value, files } = e.target;
        console.log(files);

        const imagesFormData = new FormData();
        // imagesFormData.append('itemImage', files[0]);
        Object.keys(files).map((key) => {
            imagesFormData.append("itemImage", files[key]);
        });
        // files.map((file) => {
        //     imagesFormData.append('itemImage', file);
        // })

        axios
            .post(`http://localhost:5001/upload/cache`, imagesFormData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Response from cache upload", response.data);
                let tempList = {};
                let someArr = [];

                Object.keys(files).forEach((key, idx) => {
                    console.log("SS", uploadedImages);
                    let tempList2 = {};
                    tempList[files[key].name] = response.data.filesNames[idx];
                    tempList2 = {
                        fileData: files[key],
                        filename: files[key].name,
                        cacheFile: response.data.filesNames[idx],
                    };
                    // setUploadedImages({
                    //     ...uploadedImages,
                    //     [files[key].name]: response.data.filesNames[idx]
                    // })
                    someArr.push(tempList2);
                    if (
                        Object.keys(tempList).length ===
                        response.data.filesNames.length
                    ) {
                        setUploadedImages({
                            ...tempList,
                        });

                        setAllImages([...someArr]);
                    }
                });
            })
            .catch((error) => {
                console.log("Error from cache upload:", error?.response);
            });

        // console.log("Form Data", imagesFormData);
        setTempImage([...files]);
    };

    useEffect(() => {
        const newTempList = [];
        console.log("TEMP IMAGE", tempImage);
        tempImage.forEach((image) =>
            newTempList.push(URL.createObjectURL(image))
        );
        // console.log("NEW LIST", newTempList);
        setImageURL([...newTempList]);
    }, [tempImage]);

    useEffect(() => {
        console.log("Uploaded images", uploadedImages);
    }, [uploadedImages]);

    useEffect(() => {
        console.log("ALl IMAGES Data", allImages);
    }, [allImages]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        console.log({
            ...formValues,
            ingredients: ingredientList,
            recipe: recipeList,
        });

        axios
            .post(`http://localhost:5001/menu/add`, {
                ...formValues,
                ingredients: ingredientList,
                recipe: recipeList,
                images: allImages.map((file) => file.cacheFile),
            })
            .then((response) => {
                console.log("Add menu item response:", response.data);
                return enqueueSnackbar("Menu item added successfully!", {
                    variant: "success",
                });
            })
            .catch((err) => {
                console.log("Error in adding menu item:", err?.response?.data);
                return enqueueSnackbar(
                    err?.response?.data?.message ??
                        "Please try again in a while!",
                    { variant: "error" }
                );
            });
    };

    const handleImageDelete = (idx) => {
        let tempImages = allImages;
        tempImages.splice(idx, 1);
        setAllImages([...tempImages]);
    };

    return (
        <Grid container>
            <Grid item xs={12} md={12} sm={12} my={1} sx={{ px: 2 }}>
                <Typography
                    variant="h4"
                    fontFamily="Bebas Neue"
                    textAlign="center"
                >
                    Add a Menu Item
                </Typography>
                <Divider sx={{ my: 1 }}>
                    <Chip label="Item Details" />
                </Divider>
            </Grid>
            <form method="POST" onSubmit={handleFormSubmit}>
                {/* Main Form */}
                <Grid container>
                    <Grid item xs={2} md={2} sm={2}></Grid>
                    <Grid item xs={8} md={8} sm={8} my={2} sx={{ px: 2 }}>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <TextInput
                                placeholder="Item Name"
                                label="Item Name"
                                name="name"
                                value={formValues.name}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <TextInput
                                placeholder="Description"
                                label="Description"
                                name="description"
                                value={formValues.description}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl sx={{ minWidth: 200, my: 1 }}>
                            <InputLabel id="demo-simple-select-label">
                                Course Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Course Type"
                                defaultValue={""}
                                required
                                name="category"
                                onChange={handleInputChange}
                            >
                                {categoryList.map((category) => (
                                    <MenuItem
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <TextInput
                                placeholder="Price (₹)"
                                label="Price (₹)"
                                name="price"
                                type="number"
                                value={formValues.price}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <TextInput
                                placeholder="Preparation Time (In minutes)"
                                label="Preparation Time (In minutes)"
                                name="preparationTime"
                                type="number"
                                value={formValues.preparationTime}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <Divider sx={{ my: 1 }} />

                        {/* Food Types Section */}
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formValues.available} />
                                }
                                name="available"
                                label="Available"
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
                                    label="Veg"
                                    name="is_veg"
                                />
                                <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="Non-veg"
                                    name="is_veg"
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formValues.is_jain} />
                                }
                                label="Jain"
                                name="is_jain"
                                onChange={handleCheckboxChange}
                            />
                        </FormGroup>
                        <Divider sx={{ my: 1 }} />

                        {/* Ingredients section */}
                        <Grid container my={2}>
                            <Grid item xs={4} sm={6} md={2} textAlign="start">
                                <Typography variant="h6">
                                    Ingredients
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
                                    Add an Ingredient
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
                                            Ingredient
                                        </Typography>
                                        <FormControl sx={{ mx: 1 }}>
                                            <TextInput
                                                size="small"
                                                placeholder="Ingredient Name"
                                                label="Ingredient Name"
                                                name="name"
                                                onChange={
                                                    handleIngredientInputChange
                                                }
                                                value={ingredientForm.name}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ mx: 1 }}>
                                            <TextInput
                                                size="small"
                                                placeholder="Amount / quantity"
                                                label="Amount / quantity"
                                                name="value"
                                                value={ingredientForm.value}
                                                onChange={
                                                    handleIngredientInputChange
                                                }
                                            />
                                        </FormControl>
                                        <br />
                                        <FormControl sx={{ display: "inline" }}>
                                            <Button
                                                variant="contained"
                                                sx={{ m: 1 }}
                                                onClick={handleAddIngredient}
                                            >
                                                Add
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
                                                Cancel
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
                                        <Card elevation={2} sx={{ p: 1, m: 1 }}>
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
                        <Typography variant="h6">Recipe</Typography>

                        <Grid container my={2}>
                            {[...Array(recipeListCount).keys()].map((count) => (
                                <React.Fragment key={count}>
                                    <Grid
                                        item
                                        xs={2}
                                        md={2}
                                        sm={2}
                                        sx={{ my: 1 }}
                                    >
                                        <Button variant="contained">
                                            Step - {count + 1}
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
                                                handleRecipeRemove(count)
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
                                        <FormControl fullWidth sx={{ my: 1 }}>
                                            <TextInput
                                                placeholder={`Recipe Step - ${
                                                    count + 1
                                                }`}
                                                label={`Recipe Step - ${
                                                    count + 1
                                                }`}
                                                name={`recipe${count}`}
                                                onChange={handleRecipeChange}
                                                value={recipeList[count] ?? ""}
                                            />
                                        </FormControl>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>

                        <Divider sx={{ my: 1 }} />

                        {/* Images section */}
                        <Typography variant="h6" my={1}>
                            Images
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
                        {/* <Grid container>
                    {imageURL.map((imgSrc, idx) => (
                        <Card className="container" key={idx} elevation={3} sx={{m: 2}}>
                            <img
                                src={imgSrc}
                                key={idx}
                                className='uploadedImage'
                                style={{height: '200px', width: '200px'}}
                            />
                            <div className="overlay">
                                <Button className="text" size="large" sx={{fontSize: '30px'}} onClick={handleImageDelete}>❌</Button>
                            </div>
                    </Card>
                    ))}
                </Grid> */}
                        <Grid container>
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
                                                handleImageDelete(idx)
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
                        >
                            Add
                        </Button>
                        <Button variant="contained" sx={{ mx: 2 }} size="large">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
};

export default MenuForm;
