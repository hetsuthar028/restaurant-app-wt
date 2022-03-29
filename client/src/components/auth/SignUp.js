import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    FormControl,
    TextField,
    Button,
    FormHelperText,
    Card,
    Divider,
} from "@mui/material";
import Helpertext from "../shared/HelperText";
import TextInput from "../shared/TextInput";

const initialFormValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
};

const emailRegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const SignUp = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});

    const validateInput = (name, value) => {
        if (name === "email" && !emailRegExp.test(value)) {
            return `Invalid ${name}`;
        }

        if (name === "username" && value.length < 3) {
            return `Invalid ${name}`;
        }

        if (name === "password" && value.length < 8) {
            return `${name} must be longer than 8 characters`;
        }

        if (name === "confirmPassword" && value != formValues.password) {
            return `Passwords does not match!`;
        }
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: validateInput(name, value),
        });

        console.log("Form errors", formErrors);
    };

    return (
        <Grid container>
            <Grid item xs={0} md={7} sm={7}>
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
                    width="100%"
                    style={{ height: "100vh" }}
                />
            </Grid>
            <Grid item xs={12} md={5} sm={5} sx={{ p: 2 }}>
                <Typography variant="h4" textAlign="center" my={2}>
                    Sign Up
                </Typography>

                <center>
                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <TextInput
                            name="email"
                            placeholder="Email address"
                            type="email"
                            label="Email address"
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <Helpertext
                        text={formErrors.email}
                        style={{ width: "80%" }}
                    />

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <TextInput
                            name="username"
                            placeholder="Username"
                            label="Username"
                            value={formValues.username}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <Helpertext
                        text={formErrors.username}
                        style={{ width: "80%" }}
                    />

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <TextInput
                            name="password"
                            type="password"
                            placeholder="Password"
                            label="Password"
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <Helpertext
                        text={formErrors.password}
                        style={{ width: "80%" }}
                    />

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <TextInput
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            label="Confirm Password"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <Helpertext
                        text={formErrors.confirmPassword}
                        style={{ width: "80%" }}
                    />

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ backgroundColor: "#DD7230", mt: 2 }}
                        >
                            Sign Up
                        </Button>
                    </FormControl>

                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <Button variant="contained">Google</Button>
                    </FormControl>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <Button variant="contained">Facebook</Button>
                    </FormControl>
                </center>
            </Grid>
        </Grid>
    );
};

export default SignUp;