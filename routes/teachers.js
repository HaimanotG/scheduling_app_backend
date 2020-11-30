const router = require("express").Router();
const {
    getTeachers,
    addTeacher,
    deleteTeacher,
    updateTeacher
} = require('../controllers/TeacherController');

router.get("/", getTeachers);
router.post("/", addTeacher);
router.delete("/:id", deleteTeacher);
router.patch("/:id", updateTeacher);

module.exports = router;