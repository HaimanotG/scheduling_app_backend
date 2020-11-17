import request from './';
import getAuthHeader from "../services/getAuthHeader";

export default {
    getTeachers: () => new Promise(async resolve => {
        const header = await getAuthHeader();
        request.get('/departments/teachers',header.authorization)
            .then(r => {
                const {error, body} = r;
                if (error || body.error) {
                    let reason = {success: false};
                    if (!body.success && body.error){
                        reason = {...reason, error: body.error.message}
                    }
                    resolve(reason);
                }
                resolve({
                    success: body.success || true,
                    data: {
                        teachers: body
                    }
                })
            }).catch(e => {
            resolve({success: false,error:e.message});
        });
    }),
};