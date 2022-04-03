import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    Button,
    FormControl,
    TextField,
} from "@mui/material";
import HelperText from "../shared/HelperText";
import TextInput from "../shared/TextInput";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { GoogleLogin } from 'react-google-login';

const initialFormValues = {
    email: "",
    password: "",
};

const emailRegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const clientId = '189924922807-4lgk1n6ne4njqh238f20s87m8ugjq7uk.apps.googleusercontent.com';

const Login = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const validateInput = (name, value) => {
        if (name === "email" && !emailRegExp.test(value)) {
            return `Invalid ${name}`;
        }

        if (name === "password" && value.length < 8) {
            return `${name} must be longer than 8 characters`;
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
            [name]: validateInput(name, value),
        });
    };

    useEffect(() => {
        setHasErrors(
            Object.keys(formErrors).some((key) => {
                return !!formErrors[key];
            })
        );
    }, [formErrors]);

    const handleRegularLogin = (e) => {
        e.preventDefault();

        axios
            .post(`http://localhost:5001/user/auth/login`, {
                ...formValues,
            })
            .then((response) => {
                console.log("Login response", response.data);
                let bearer = {login_type: 'normal', token: response.data.token}
                window.localStorage.setItem("bearer", JSON.stringify(bearer));
                return enqueueSnackbar("Login Successful!", {
                    variant: "success",
                });
            })
            .catch((err) => {
                console.log("Error while Logging in", err?.response.data);
                return enqueueSnackbar(
                    err?.response?.data?.message ?? "Please try again!",
                    { variant: "error" }
                );
            });
    };

    const onGoogleAuthSuccess = (res) => {
        console.log("Google Login:", res);
        console.log("Google Login Success", res.profileObj);
        let bearer = {login_type: 'google', token: res.tokenId};
        let {email, name: username, imageUrl: profile_url} = res.profileObj;

        axios
            .post(`http://localhost:5001/user/auth/google/signin`, {
                email,
                username,
                profile_url
            })
            .then((response) => {
                window.localStorage.setItem('bearer', JSON.stringify(bearer));
                
                enqueueSnackbar("Google Sign In Successful!", {
                    variant: "success",
                });
                return navigate('/home');
            })
            .catch((err) => {
                return enqueueSnackbar(
                    err?.response?.data?.message ?? "Please try again!",
                    { variant: "error" }
                );
            });
        
    }

    const onGoogleAuthFailure = (res) => {
        console.log("Google login failed:", res);
    }

    return (
        <Grid container>
            <Grid item xs={0} md={7} sm={7}>
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
                    width="100%"
                    style={{ height: "100vh" }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={5}
                sm={5}
                sx={{
                    p: 2,
                    display: "grid",
                    minHeight: "100vh",
                    alignContent: "center",
                }}
            >
                <form method="POST" onSubmit={handleRegularLogin}>
                    <Typography variant="h4" textAlign="center" my={2}>
                        Log In
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
                                error={!!formErrors.email}
                            />
                        </FormControl>
                        <HelperText
                            text={formErrors.email}
                            style={{ width: "80%" }}
                        />

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <TextInput
                                name="password"
                                placeholder="Password"
                                type="password"
                                label="Password"
                                value={formValues.password}
                                onChange={handleInputChange}
                                error={!!formErrors.password}
                            />
                        </FormControl>
                        <HelperText
                            text={formErrors.password}
                            style={{ width: "80%" }}
                        />

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Typography textAlign="end">
                                <Link to="/">Forgot Password?</Link>
                            </Typography>
                        </FormControl>

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ backgroundColor: "#DD7230", mt: 2 }}
                                type="submit"
                                disabled={hasErrors}
                            >
                                Log In
                            </Button>
                        </FormControl>

                        <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                            <GoogleLogin
                                clientId={clientId}
                                buttonText="Sign in with Google"
                                onSuccess={onGoogleAuthSuccess}
                                onFailure={onGoogleAuthFailure}
                                cookiePolicy={'single_host_origin'}
                            />
                            {/* <Button variant="contained">Google</Button> */}
                        </FormControl>

                        <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                            <Button variant="contained">Facebook</Button>
                        </FormControl>

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Typography variant="body1">
                                Don't have an account?{" "}
                                <Link to="/signup">Sign Up here</Link>
                            </Typography>
                        </FormControl>
                    </center>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;
