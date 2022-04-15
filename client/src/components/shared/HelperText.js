import { FormHelperText } from '@mui/material';
import React from 'react';

const Helpertext = (props) => {
    return (
        <FormHelperText sx={{color: 'red', my: 0.5}} style={props.style}>
            {props.text}
        </FormHelperText>
    );
}

export default Helpertext;
