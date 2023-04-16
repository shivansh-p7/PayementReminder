const isValidEmail = function (value) {
    return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(value));
}

const isValidpassword = function (value) {
    return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(value));
}

const isValidMobileNumber = function (value) {
    return ((/^((\+91)?|91)?[6789][0-9]{9}$/g).test(value));
}

const isValidImage = function (value) {
    return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/).test(value)
}

module.exports={isValidEmail,isValidImage,isValidMobileNumber,isValidpassword}