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
    Box,
} from "@mui/material";
import Helpertext from "../shared/HelperText";
import TextInput from "../shared/TextInput";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { GoogleLogin } from 'react-google-login';


const initialFormValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
};

const emailRegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const clientId = process.env.REACT_APP_GOOGLE_CLIENTID;

const SignUp = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);
    const [showPasswordHelper, setShowPasswordHelper] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const validateInput = (name, value) => {
        if (name === "email" && !emailRegExp.test(value)) {
            return `Invalid ${name}`;
        }

        if (name === "username" && value.length < 3) {
            return `Invalid ${name}`;
        }

        if (name === "password") {
            let passwordTest = {
                alphabet: false,
                digit: false,
                minlength: false,
                specialChar: false,
            };

            if (value.length < 8) {
                passwordTest["minlength"] = true;
            }
            if (!/[a-zA-Z]/i.test(value)) {
                passwordTest["alphabet"] = true;
            }
            if (!/[0-9]/i.test(value)) {
                passwordTest["digit"] = true;
            }
            if (
                !/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g.test(
                    value
                )
            ) {
                passwordTest["specialChar"] = true;
            }

            setShowPasswordHelper(
                !Object.values(passwordTest).every((test) => test === false)
            );
            return { ...passwordTest };
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
    };

    useEffect(() => {
        setHasErrors(
            Object.keys(formErrors).some((key) => {
                if (key === "password") {
                    return !Object.values(formErrors["password"]).every(
                        (a) => a === false
                    );
                } else {
                    return !!formErrors[key];
                }
            })
        );
    }, [formErrors]);

    const handleRegularSignUp = (e) => {
        e.preventDefault();

        axios
            .post(`http://localhost:5001/user/auth/signup`, {
                ...formValues,
            })
            .then((response) => {
                return enqueueSnackbar("Account created successfully!", {
                    variant: "success",
                });
            })
            .catch((err) => {
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
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
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
                <form method="POST" onSubmit={handleRegularSignUp}>
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
                                error={!!formErrors.email}
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
                                error={!!formErrors.username}
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
                                error={showPasswordHelper}
                            />
                        </FormControl>
                        {showPasswordHelper && (
                            <Grid container sx={{ width: "80%" }}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    md={3}
                                    textAlign="start"
                                >
                                    {formErrors.password?.alphabet ? (
                                        <CloseRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "red",
                                                display: "inline",
                                            }}
                                        />
                                    ) : (
                                        <DoneRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "green",
                                                display: "inline",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "inline" }}
                                    >
                                        Alphabets
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    md={3}
                                    textAlign="start"
                                >
                                    {formErrors.password?.digit ? (
                                        <CloseRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "red",
                                                display: "inline",
                                            }}
                                        />
                                    ) : (
                                        <DoneRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "green",
                                                display: "inline",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "inline" }}
                                    >
                                        Digits
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    md={3}
                                    textAlign="start"
                                >
                                    {formErrors.password?.specialChar ? (
                                        <CloseRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "red",
                                                display: "inline",
                                            }}
                                        />
                                    ) : (
                                        <DoneRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "green",
                                                display: "inline",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "inline" }}
                                    >
                                        Special Characters
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    md={3}
                                    textAlign="start"
                                >
                                    {formErrors.password?.minlength ? (
                                        <CloseRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "red",
                                                display: "inline",
                                            }}
                                        />
                                    ) : (
                                        <DoneRoundedIcon
                                            sx={{
                                                height: "20px",
                                                width: "auto",
                                                color: "green",
                                                display: "inline",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "inline" }}
                                    >
                                        More than 8 characters
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <TextInput
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                label="Confirm Password"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                error={!!formErrors.confirmPassword}
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
                                type="submit"
                                disabled={hasErrors}
                            >
                                Sign Up
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
                                Already have an account?{" "}
                                <Link to="/login">Login here</Link>
                            </Typography>
                        </FormControl>
                    </center>
                </form>
            </Grid>
        </Grid>
    );
};

export default SignUp;
