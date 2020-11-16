import request from "./";
import getAuthHeader from "../utils/getAuthHeader";
import constructResolve from "./constructResolve";
import colleges from "./mocks/admin/colleges";

export default {
  getColleges: () =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .get("/admin/colleges", header.authorization)
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  getCollege: id =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .get(`/admin/colleges/${id}`, header.authorization)
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  getCollegesMocked: () =>
    new Promise(resolve => {
      resolve({
        data: {
          colleges
        },
        success: true
      });
    }),
  addCollege: (name, dean) =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .post(
          "/admin/colleges",
          {
            name,
            dean
          },
          header.authorization
        )
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  updateCollege: (name, dean, id) =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .patch(`/admin/colleges/${id}`, { name, dean }, header.authorization)
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  deleteCollege: collegeId =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .delete(`/admin/colleges/${collegeId}`, header.authorization)
        .then(r => {
          console.log(r);
          const { body } = r;
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
  addCollegeMocked: () =>
    new Promise(resolve => {
      resolve({
        success: true,
        data: undefined,
        error: ""
      });
    }),
  getDeans: () =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .get("/users", header.authorization)
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error, "deans"));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  getDean: id =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .get(`/users/${id}`, header.authorization)
        .then(r => {
          const { body, error } = r;
          resolve(constructResolve(body, error, "dean"));
        })
        .catch(e => {
          resolve({
            success: false,
            error: e.message
          });
        });
    }),
  updateDean: (username, email, deanId) =>
    new Promise(async resolve => {
      const header = await getAuthHeader();
      request
        .patch(
          `/users/${deanId}`,
          {
            username,
            email
          },
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
          resolve({
            success: false,
            error: e.message
          });
        });
    })
};
