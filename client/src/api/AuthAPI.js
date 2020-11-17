import request from "./";
import getAuthHeader from "../services/getAuthHeader";

export default {
  login: (email, password) =>
    new Promise(resolve => {
      request
        .post("/users/login", { email, password })
        .then(r => {
          const { error, body, response } = r;
          if (error || body.error) {
            let reason = { success: false };
            if (!body.success && body.error) {
              reason = { ...reason, error: body.error.message };
            }
            resolve(reason);
          }
          resolve({
            success: body.success || true,
            data: {
              sessionToken: response.headers.authorization,
              username: body.username,
              role: body.role
            }
          });
        })
        .catch(e => {
          resolve({ success: false, error: e.message });
        });
    }),
  loginMocked: (email, password) =>
    new Promise(resolve => {
      setInterval(() => {
        resolve({
          success: true,
          data: {
            sessionToken: "gibrishtoken",
            username: "Haimanot Getu",
            role: "admin"
          }
        });
      }, 1000);
    }),
  loginMockedError: (email, password) =>
    new Promise(resolve => {
      setInterval(() => {
        resolve({ success: false, error: "Something gone wrong!!" });
      }, 500);
    }),
  checkSessionTokenMocked: () =>
    new Promise(resolve => {
      resolve({ success: true });
    }),
  checkSessionToken: () =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request.get("/users/checkSessionToken", header.authorization).then(r => {
        console.log(r);
        const { error, body } = r;
        if (error || body.error) {
          let reason = { success: false };
          if (!body.success && body.error) {
            reason = { ...reason, error: body.error.message };
          }
          resolve(reason);
        }
        resolve({ success: true });
      });
    }),
  register: (username, email, password) =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .post(
          "/users/register",
          { username, email, password },
          header.authorization
        )
        .then(r => {
          const { body } = r;
          resolve({
            success: body.success || true,
            body,
            error: body.error && body.error.message
          });
        })
        .catch(e => {
          resolve({ success: false, error: e.message });
        });
    }),
  deleteUser: userId =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .delete(`/users/${userId}`, header.authorization)
        .then(r => {
          const { body } = r;
          resolve({
            success: body.success || true,
            body,
            error: body.error && body.error.message
          });
        })
        .catch(e => {
          resolve({ success: false, error: e.message });
        });
    })
};
