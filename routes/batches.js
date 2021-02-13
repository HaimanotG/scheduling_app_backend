const router = require("express").Router();
const {
    getBatches,
    getBatch,
    addBatch,
    updateBatch,
    deleteBatch,
    setLabRoomToBatch,
    setClassRoomToBatch,
    setStudentGroupsToBatch,
    getSemesters
  } = require("../controllers/BatchController");
  
router.get("/", getBatches);
router.get("/:id", getBatch);
router.post("/", addBatch);
router.delete("/:id", deleteBatch);
router.patch("/:id", updateBatch);

router.get("/:batchId/semesters", getSemesters);

router.patch("/:id/set-class-room", setClassRoomToBatch);
router.patch("/:id/set-lab-room", setLabRoomToBatch);
router.patch("/:id/set-student-groups", setStudentGroupsToBatch);

module.exports = router;