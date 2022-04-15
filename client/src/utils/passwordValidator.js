const passwordValidator = (value) => {
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

    return { ...passwordTest };
}

export default passwordValidator;