exports.isValid = (value) => {
    if (typeof value == "undefined" || typeof value == null) return false;    //"",null,undefinded
    if (typeof value === "string" && value.trim().length === 0) return false; //""
    return true;
}

exports.parseJSONSafely=(str)=> {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null
    }
}

exports.validString=(value)=>{
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}