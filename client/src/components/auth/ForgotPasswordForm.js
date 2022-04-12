import React, { useState, useEffect } from "react";
import { Typography, FormControl, Button } from "@mui/material";
import TextInput from "../shared/TextInput";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import passwordValidator from "../../utils/passwordValidator";
import PasswordHelper from "./PasswordHelper";

const initialForgotPasswordValues = {
    email: "",
    password: "",
    otp: "",
};

const ForgotPasswordForm = (props) => {
    const { setShowLoginForm } = props;

    const [formValues, setFormValues] = useState(initialForgotPasswordValues);
    const [showPasswordHelper, setShowPasswordHelper] = useState(false);
    const [showForgotForm, setShowForgotForm] = useState(true);
    const [showOTPForm, setShowOTPForm] = useState(false);
    const [showResetPwdForm, setShowResetPwdForm] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);

    const { t } = useTranslation(["auth"]);
    const { enqueueSnackbar } = useSnackbar();

    const handleForgotFormInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === "password") {
            let pwdErrors = passwordValidator(e.target.value);

            setShowPasswordHelper(
                !Object.values(pwdErrors).every((test) => test === false)
            );

            setPasswordErrors({
                ...passwordErrors,
                [e.target.name]: pwdErrors,
            });
        }
    };

    const handleSendOTP = (e) => {
        e.preventDefault();

        // Verify whether user exists or not
        axios
            .get(`http://localhost:5001/user/auth/exists/${formValues.email}`)
            .then((response) => {
                // User exists
                if (response.data.user.auth_type != "normal") {
                    return enqueueSnackbar(
                        "Invalid password change request for this account",
                        { variant: "warning" }
                    );
                }

                enqueueSnackbar("Sending OTP via Email", {
                    variant: "success",
                });

                axios
                    .post(`http://localhost:5001/otp/send`, {
                        to: formValues.email,
                    })
                    .then((otpResp) => {
                        setShowForgotForm(false);
                        setShowOTPForm(true);
                        return enqueueSnackbar("OTP Sent", {
                            variant: "success",
                        });
                    })
                    .catch((otpErr) => {
                        console.error("OTP Error in Login:", otpErr?.response);
                        return enqueueSnackbar(
                            otpErr?.response?.data?.message ??
                                "Error occured while sending OTP",
                            { variant: "warning" }
                        );
                    });
            })
            .catch((err) => {
                console.error(
                    "Error in checking user existance in Login:",
                    err.response
                );
                return enqueueSnackbar(
                    err.response?.data?.message ?? "Invalid email",
                    { variant: "warning" }
                );
            });
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();

        // Verify OTP
        axios
            .post(`http://localhost:5001/otp/verify`, {
                email: formValues.email,
                otp: formValues.otp,
            })
            .then((verifyResp) => {
                setShowOTPForm(false);
                setShowResetPwdForm(true);
                return enqueueSnackbar("OTP Verified", { variant: "success" });
            })
            .catch((verifyErr) => {
                console.error(
                    "OTP Verify Error in Login:",
                    verifyErr?.response
                );
                return enqueueSnackbar(
                    verifyErr?.response?.data?.message ??
                        "Some error occured, Please try again!",
                    { variant: "error" }
                );
            });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        // Handle password change request
        axios
            .put(`http://localhost:5001/user/auth/password`, {
                email: formValues.email,
                password: formValues.password,
            })
            .then((passwordResp) => {
                setShowResetPwdForm(false);
                setShowLoginForm(true);
                return enqueueSnackbar(
                    passwordResp.data?.message ??
                        "Password changed successfully",
                    { variant: "success" }
                );
            })
            .catch((passwordErr) => {
                console.error(
                    "Error in Password change in Login:",
                    passwordErr
                );
            });
    };

    useEffect(() => {
        return setHasErrors(
            !Object.values(passwordErrors["password"] ?? {}).every(
                (a) => a === false
            )
        );
    }, [passwordErrors]);

    return (
        <>
            <Typography variant="h4" textAlign="center" my={2}>
                {t("forgotPassword")}
            </Typography>
            {showForgotForm && (
                <form method="POST" onSubmit={handleSendOTP}>
                    <center>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <TextInput
                                name="email"
                                placeholder={t("emailAddress")}
                                type="email"
                                label={t("emailAddress")}
                                value={formValues?.email}
                                onChange={handleForgotFormInputChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: "#DD7230",
                                    mt: 2,
                                }}
                                type="submit"
                            >
                                {t("getOTP")}
                            </Button>
                        </FormControl>
                    </center>
                </form>
            )}

            {/* Forgot Password ON - OTP Form */}
            {showOTPForm && (
                <form method="POST" onSubmit={handleVerifyOTP}>
                    <center>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <TextInput
                                name="otp"
                                placeholder="OTP"
                                type="number"
                                label="OTP"
                                value={formValues.otp}
                                onChange={handleForgotFormInputChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: "#DD7230",
                                    mt: 2,
                                }}
                                type="submit"
                            >
                                {t("verifyOTP")}
                            </Button>
                        </FormControl>
                    </center>
                </form>
            )}

            {/* Forgot Password ON - Change Password Form */}
            {showResetPwdForm && (
                <form method="POST" onSubmit={handlePasswordChange}>
                    <center>
                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <TextInput
                                name="password"
                                placeholder={t("newPassword")}
                                type="password"
                                label={t("newPassword")}
                                value={formValues.password}
                                onChange={handleForgotFormInputChange}
                            />
                        </FormControl>
                        {showPasswordHelper && (
                            <PasswordHelper formErrors={passwordErrors} />
                        )}

                        <FormControl fullWidth sx={{ width: "80%" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: "#DD7230",
                                    mt: 2,
                                }}
                                type="submit"
                                disabled={hasErrors}
                            >
                                {t("changePassword")}
                            </Button>
                        </FormControl>
                    </center>
                </form>
            )}
        </>
    );
};

export default ForgotPasswordForm;
