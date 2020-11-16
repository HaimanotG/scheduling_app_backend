import request from "./";
import getAuthHeader from "../utils/getAuthHeader";
import constructResolve from "./constructResolve";

export default {
    register: (username, email, password) =>
        new Promise(async resolve => {
            const header = await getAuthHeader();
            request
                .post(
                    "/users/register", {
                        username,
                        email,
                        password
                    },
                    header.authorization
                )
                .then(r => {
                    const {
                        body
                    } = r;
                    resolve({
                        success: body.success || true,
                        body,
                        error: body.error && body.error.message
                    });
                })
                .catch(e => {
                    resolve({
                        success: false,
                        error: e.message
                    });
                });
        }),
    getUsers: ({role}) => () =>
        new Promise(async resolve => {
            const header = await getAuthHeader();
            request
                .get(role ? `/users?role=${role}` : '/users', header.authorization)
                .then(r => {
                    const {
                        body,
                        error
                    } = r;
                    resolve(constructResolve(body, error));
                })
                .catch(e => {
                    resolve({
                        success: false,
                        error: e.message
                    });
                });
        }),
    getUser: id =>
        new Promise(async resolve => {
            const header = await getAuthHeader();
            request
                .get(`/users/${id}`, header.authorization)
                .then(r => {
                    const {
                        body,
                        error
                    } = r;
                    resolve(constructResolve(body, error, "user"));
                })
                .catch(e => {
                    resolve({
                        success: false,
                        error: e.message
                    });
                });
        }),
    updateUser: (username, email, userId) =>
        new Promise(async resolve => {
            const header = await getAuthHeader();
            request
                .patch(
                    `/users/${userId}`, {
                        username,
                        email
                    },
                    header.authorization
                )
                .then(r => {
                    const {
                        body
                    } = r;
                    resolve({
                        success: body.success || true,
                        body,
                        error: body.error && body.error.message
                    });
                })
                .catch(e => {
                    resolve({
                        success: false,
                        error: e.message
                    });
                });
        }),
    deleteUser: userId =>
        new Promise(async resolve => {
            const header = await getAuthHeader();
            request
                .delete(`/users/${userId}`, header.authorization)
                .then(r => {
                    const {
                        body
                    } = r;
                    resolve({
                        success: body.success || true,
                        body,
                        error: body.error && body.error.message
                    });
                })
                .catch(e => {
                    resolve({
                        success: false,
                        error: e.message
                    });
                });
        })
};