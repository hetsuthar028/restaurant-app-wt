import { TextField } from "@mui/material";
import React from "react";

const TextInput = (props) => {
    const {
        type = "text",
        placeholder,
        label,
        name,
        value,
        onChange,
        required = true,
        error = false,
        size = "medium"
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
            sx={{ my: 0.5 }}
            error={error}
            size={size}
        />
    );
};

export default TextInput;
