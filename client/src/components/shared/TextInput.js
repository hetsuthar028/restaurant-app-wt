import { TextField } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    "& .MuiTextField-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
        {
            borderColor: "white",
        },
    labelColor: {
        color: "white",
    },
    borderColor: {
        borderColor: "white",
    },
}));

const TextInput = (props) => {
    const classes = useStyles();
    const {
        type = "text",
        placeholder,
        label,
        name,
        value,
        onChange,
        required = true,
        error = false,
        size = "medium",
        mode = "light",
    } = props;

    return (
        <TextField
            type={type}
            placeholder={placeholder}
            label={label}
            onChange={onChange}
            value={value}
            required={required}
            name={name}
            sx={{
                my: 0.5,
                ...(mode === "dark" && {
                    "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input, .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                            border: "2px solid white",
                            borderRadius: 1,
                            color: "#DD7230",
                        },
                    "& .css-qdcng8-MuiFormLabel-root-MuiInputLabel-root": {
                        color: "white",
                    },
                    "& .Mui-focused": {
                        color: "white",
                    },
                }),
            }}
            error={error}
            size={size}
            InputLabelProps={
                mode === "dark"
                    ? { className: classes.labelColor }
                    : { className: "" }
            }
        />
    );
};

export default TextInput;
