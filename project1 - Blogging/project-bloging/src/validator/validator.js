
const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") { return true }
    else {
        return false
    }
}

const isValidArray = (value) => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {


            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}

const isValidEmail = (value) => {
    if (typeof value === "undefined" || value === null) return false
    const re= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(value)
}

const isValidPassword = (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    return re.test(value)
}



module.exports.isValid = isValid
module.exports.isValidArray = isValidArray
module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword = isValidPassword
