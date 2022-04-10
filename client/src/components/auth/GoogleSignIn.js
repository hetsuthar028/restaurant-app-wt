import React from "react";
import { GoogleLogin } from "react-google-login";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const clientId = process.env.REACT_APP_GOOGLE_CLIENTID;

const GoogleSignIn = () => {

    const { t } = useTranslation(["auth"]);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const onGoogleAuthSuccess = (res) => {
        let bearer = { login_type: "google", token: res.tokenId };
        let { email, name: username, imageUrl: profile_url } = res.profileObj;

        axios
            .post(`http://localhost:5001/user/auth/google/signin`, {
                email,
                username,
                profile_url,
                authToken: res.tokenId,
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
        console.error("Google login failed:", res);
    };

    return (
        <GoogleLogin
            clientId={clientId}
            buttonText={t("signInWithGoogle")}
            onSuccess={onGoogleAuthSuccess}
            onFailure={onGoogleAuthFailure}
            cookiePolicy={"single_host_origin"}
        />
    );
};

export default GoogleSignIn;
