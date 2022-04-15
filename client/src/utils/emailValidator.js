const emailRegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const emailValidator = (value) => {
    if(!emailRegExp.test(value) || !emailRegExp){
        return 'Invalid email';
    }
}

module.exports = emailValidator;