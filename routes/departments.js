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

router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.post("/", addDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

router.get("/received-requests", receivedRequests);
router.get("/sent-requests", sentRequests);
router.patch("/respond-to-request", respondToRequest);

module.exports = router;
