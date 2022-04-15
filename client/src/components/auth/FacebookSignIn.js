import React from "react";
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const FacebookSignIn = () => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const onFacebookAuthSuccess = (response) => {
        let { name, picture, email, accessToken, id } = response;
        let bearer = { login_type: "facebook", token: accessToken };

        axios
            .post(`http://localhost:5001/user/auth/facebook/signin`, {
                email,
                name,
                picture: picture.data.url,
                id,
                accessToken,
            })
            .then((response) => {
                window.localStorage.setItem("bearer", JSON.stringify(bearer));
                enqueueSnackbar("Facebook Sign In Successful!", {
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

    return (
        <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_ID}
            fields="name,email,picture"
            callback={onFacebookAuthSuccess}
            size="small"
        />
    );
};

export default FacebookSignIn;
