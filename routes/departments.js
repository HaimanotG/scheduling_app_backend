import permit from "../middlewares/permit";
import { SU, ADMIN, HEAD } from "../enums/roles";

const router = require("express").Router();

const {
  getDepartments,
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/DepartmentController");

const {
  respondToRequest,
  receivedRequests,
  sentRequests
} = require("../controllers/RequestController");

router.get("/", permit([SU, ADMIN]), getDepartments);
router.get("/:id", permit([SU, ADMIN, HEAD]), getDepartment);
router.post("/", permit([SU, ADMIN]), addDepartment);
router.patch("/:id", permit([SU, ADMIN]), updateDepartment);
router.delete("/:id", permit([SU, ADMIN]), deleteDepartment);

router.get("/received-requests", receivedRequests);
router.get("/sent-requests", sentRequests);
router.patch("/respond-to-request", respondToRequest);

module.exports = router;
