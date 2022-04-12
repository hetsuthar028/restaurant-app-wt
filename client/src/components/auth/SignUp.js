import React, { useState, useEffect } from "react";
import { Grid, Typography, FormControl, Button } from "@mui/material";
import Helpertext from "../shared/HelperText";
import TextInput from "../shared/TextInput";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleSignIn from "./GoogleSignIn";
import FacebookSignIn from "./FacebookSignIn";
import PasswordHelper from "./PasswordHelper";
import passwordValidator from "../../utils/passwordValidator";

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
    const [hasErrors, setHasErrors] = useState(true);
    const [showPasswordHelper, setShowPasswordHelper] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation(["auth"]);

    const validateInput = (name, value) => {
        if (name === "email" && !emailRegExp.test(value)) {
            return `Invalid ${name}`;
        }

        if (name === "username" && value.length < 3) {
            return `Invalid ${name}`;
        }

        if (name === "password") {
            let passwordTest = passwordValidator(value);

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
        axios
            .get(`http://localhost:5001/user/auth/exists/${formValues.email}`)
            .then((response) => {
                return enqueueSnackbar("User already exists", {
                    variant: "warning",
                });
            })
            .catch((existsErr) => {
                if (
                    existsErr?.response?.data?.message ===
                    "User does not exists"
                ) {
                    enqueueSnackbar("Sending email with OTP...", {
                        variant: "success",
                    });
                    setShowOtpForm(true);
                    axios
                        .post(`http://localhost:5001/otp/send`, {
                            to: formValues.email,
                        })
                        .then((response) => {
                            if (response.data.success === true) {
                                return enqueueSnackbar("Email sent! ✔️", {
                                    variant: "success",
                                });
                            }
                        })
                        .catch((error) => {
                            console.error(
                                "Error occured in sending OTP:",
                                error?.response?.data
                            );
                            return enqueueSnackbar(
                                error?.response?.data?.message ??
                                    "Please refresh the page and try again!",
                                { variant: "warning" }
                            );
                        });
                } else {
                    return enqueueSnackbar(
                        "Some error occured, Please try again in a while",
                        { variant: "error" }
                    );
                }
            });
    };

    const handleOtpVerification = (e) => {
        e.preventDefault();
        axios
            .post(`http://localhost:5001/otp/verify`, {
                email: formValues.email,
                otp: otp,
            })
            .then((response) => {
                enqueueSnackbar("OTP verified ✔️", { variant: "success" });
                handleRegularSignUp();
            })
            .catch((error) => {
                console.error("Error in verifying otp", error);
                enqueueSnackbar("Invalid OTP", { variant: "error" });
            });
    };

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
                    {t("signup")}
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
                                    onChange={(e) =>
                                        setOtp(parseInt(e.target.value))
                                    }
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
                                    placeholder={t("emailAddress")}
                                    type="email"
                                    label={t("emailAddress")}
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
                                    placeholder={t("username")}
                                    label={t("username")}
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
                                    placeholder={t("password")}
                                    label={t("password")}
                                    value={formValues.password}
                                    onChange={handleInputChange}
                                    error={showPasswordHelper}
                                />
                            </FormControl>
                            {showPasswordHelper && (
                                <PasswordHelper formErrors={formErrors} />
                            )}

                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <TextInput
                                    name="confirmPassword"
                                    type="password"
                                    placeholder={t("confirmPassword")}
                                    label={t("confirmPassword")}
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
                                    {t("signup")}
                                </Button>
                            </FormControl>
                        </center>
                    </form>
                )}
                <center>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <GoogleSignIn />
                    </FormControl>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <FacebookSignIn />
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
