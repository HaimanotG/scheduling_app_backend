import request from "request";
const baseURL = "http://localhost:5000/api/v1";

export default {
    post: (url, body, authorization = "") =>
        new Promise((resolve, reject) => {
            const options = {
                method: "POST",
                url: baseURL + url,
                headers: {
                    "cache-control": "no-cache",
                    "Content-Type": "application/json",
                    authorization: authorization
                },
                body,
                json: true
            };

            request(options, function (error, response, body) {
                if (error) reject(error);
                resolve({
                    response,
                    body
                });
            });
        }),
    get: (url, authorization = "") =>
        new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                url: baseURL + url,
                headers: {
                    "cache-control": "no-cache",
                    "Content-Type": "application/json",
                    authorization: authorization
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) reject(error);
                resolve({
                    response,
                    body
                });
            });
        }),
    patch: (url, body, authorization = "") =>
        new Promise((resolve, reject) => {
            const options = {
                method: "PATCH",
                url: baseURL + url,
                headers: {
                    "cache-control": "no-cache",
                    "Content-Type": "application/json",
                    authorization: authorization
                },
                body,
                json: true
            };
            request(options, function (error, response, body) {
                if (error) reject(error);
                resolve({
                    response,
                    body
                });
            });
        }),
        delete: (url, authorization = "") =>
            new Promise((resolve, reject) => {
                const options = {
                    method: "DELETE",
                    url: baseURL + url,
                    headers: {
                        "cache-control": "no-cache",
                        "Content-Type": "application/json",
                        authorization: authorization
                    },
                    json: true
                };
                request(options, function (error, response, body) {
                    if (error) reject(error);
                    resolve({
                        response,
                        body
                    });
                });
        }), 
};