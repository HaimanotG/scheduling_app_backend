/**
 * @param status
 * @param message
 * @returns {Error}
 */
module.exports = (status, message) => {
    if (typeof status === "string") {
        message = status;
        status = 500;
    }
    const error = new Error(message);
    error.status = status;
    return error;
};
