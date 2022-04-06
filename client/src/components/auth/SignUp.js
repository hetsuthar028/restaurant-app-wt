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
import { GoogleLogin } from "react-google-login";
import FacebookLogin from 'react-facebook-login';

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
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState('');
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

    const handleShowOtpForm = (e) => {
        e.preventDefault();

        // Check if the user already exists before sending OTP
        axios.get(`http://localhost:5001/user/auth/exists/${formValues.email}`)
            .then((response) => {
                return enqueueSnackbar('User already exists', { variant: 'warning' });
            })
            .catch((existsErr) => {

                if(existsErr?.response?.data?.message === 'User does not exists'){
                    enqueueSnackbar('Sending email with OTP...', { variant: 'success' });
                    setShowOtpForm(true);
                    axios.post(`http://localhost:5001/otp/send`, {
                        to: formValues.email,
                    })
                    .then((response) => {
                        if(response.data.success === true){
                            return enqueueSnackbar('Email sent! ✔️', { variant: 'success' });        
                        }
                    })
                    .catch((error) => {
                        console.log("Error occured in sending OTP:", error?.response?.data);
                        return enqueueSnackbar(error?.response?.data?.message ?? 'Please refresh the page and try again!', { variant: 'warning' });
                    })
                    
                } else {
                    return enqueueSnackbar('Some error occured, Please try again in a while', { variant: 'error' });
                }
            })
    }

    const handleOtpVerification = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5001/otp/verify`, {
            email: formValues.email,
            otp: otp
        }).then((response) => {
            console.log("OTP Verification response:", response.data);
            enqueueSnackbar('OTP verified ✔️', {variant: 'success'});
            handleRegularSignUp();
        })
        .catch((error) => {
            console.log("Error in verifying otp");
            enqueueSnackbar('Invalid OTP', {variant: 'error'});
        })
    }

    const handleRegularSignUp = () => {
        // e.preventDefault();

        axios
            .post(`http://localhost:5001/user/auth/signup`, {
                ...formValues,
            })
            .then((response) => {
                enqueueSnackbar("Account created successfully!", {
                    variant: "success",
                });
                return navigate("/login");
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
        let bearer = { login_type: "google", token: res.tokenId };
        let { email, name: username, imageUrl: profile_url } = res.profileObj;

        axios
            .post(`http://localhost:5001/user/auth/google/signin`, {
                email,
                username,
                profile_url,
            })
            .then((response) => {
                window.localStorage.setItem("bearer", JSON.stringify(bearer));
                enqueueSnackbar("Google Sign In Successful!", {
                    variant: "success",
                });
                return navigate("/home");
            })
            .catch((err) => {
                return enqueueSnackbar(
                    err?.response?.data?.message ?? "Please try again!",
                    { variant: "error" }
                );
            });
    };

    const onGoogleAuthFailure = (res) => {
        console.log("Google login failed:", res);
    };

    const onFacebookAuthSuccess = (response) => {
        console.log('Facebook auth response:', response);
        let {name, picture, email, accessToken, id} = response;
        let bearer = {login_type: 'facebook', token: accessToken};
        
        axios.post(`http://localhost:5001/user/auth/facebook/signin`, {
            email,
            name,
            picture: picture.data.url,
            id,
            accessToken
        }).then((response) => {
            window.localStorage.setItem('bearer', JSON.stringify(bearer));
            enqueueSnackbar("Facebook Sign In Successful!", {
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
                <Typography
                    variant="h3"
                    textAlign="center"
                    my={2}
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ color: "#DD7230" }}
                >
                    Sign Up
                </Typography>
                {showOtpForm ? (
                    <form method="POST" onSubmit={handleOtpVerification}>
                        <center>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                                <TextInput
                                    name="otp"
                                    placeholder="OTP"
                                    type="number"
                                    label="OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{ backgroundColor: "#DD7230", mt: 2 }}
                                    type="submit"
                                    disabled={hasErrors}
                                >
                                    Verify
                                </Button>
                            </FormControl>
                        </center>
                    </form>
                ) : (
                    <form onSubmit={handleShowOtpForm}>
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
                                <Grid container sx={{ width: "80%", my: 0.5 }}>
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
                        </center>
                    </form>
                )}
                <center>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in with Google"
                            onSuccess={onGoogleAuthSuccess}
                            onFailure={onGoogleAuthFailure}
                            cookiePolicy={"single_host_origin"}
                        />
                        {/* <Button variant="contained">Google</Button> */}
                    </FormControl>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_ID}
                            fields="name,email,picture"
                            callback={onFacebookAuthSuccess}
                            size="small"
                            />
                        {/* <Button variant="contained">Facebook</Button> */}
                    </FormControl>

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <Typography variant="body1">
                            Already have an account?{" "}
                            <Link to="/login">Login here</Link>
                        </Typography>
                    </FormControl>
                </center>
            </Grid>
        </Grid>
    );
};

export default SignUp;
