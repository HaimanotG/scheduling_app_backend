export default (body, error, name) => {
    if (error || body.error) {
        let reason = {success: false};
        if (!body.success && body.error){
            reason = {...reason, error: body.error.message}
        }
        return reason;
    }
    return({
        success: body.success || true,
        data: body
    })
}