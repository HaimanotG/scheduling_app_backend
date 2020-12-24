const router = require("express").Router();
const {
  getTeachers,
  getTeacher,
  addTeacher,
  deleteTeacher,
  updateTeacher
} = require("../controllers/TeacherController");

router.get("/", getTeachers);
router.get("/:id", getTeacher);
router.post("/", addTeacher);
router.delete("/:id", deleteTeacher);
router.patch("/:id", updateTeacher);

module.exports = router;
