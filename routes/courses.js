const router = require("express").Router();
const {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  assignTeacherToCourses,
  removeTeacherFromCourse,
  changeTeacherForCourse
} = require("../controllers/CourseController");

router.get("/", getCourses);
router.post("/", addCourse);
router.delete("/:id", deleteCourse);
router.patch("/:id", updateCourse);

router.post("/assign-teachers", assignTeacherToCourses);
router.patch("/:id/change-teacher", changeTeacherForCourse);
router.delete("/:id/remove-teacher", removeTeacherFromCourse);

module.exports = router;
