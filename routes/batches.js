const router = require("express").Router();
const {
    getBatches,
    addBatch,
    updateBatch,
    deleteBatch,
    setLabClassRoomToBatch,
    setClassRoomToBatch,
    setStudentGroupsToBatch
  } = require("../controllers/BatchController");
  
router.get("/", getBatches);
router.post("/", addBatch);
router.delete("/:id", deleteBatch);
router.patch("/:id", updateBatch);

router.patch("/:id/set-class-room", setClassRoomToBatch);
router.patch("/:id/set-lab-class-room", setLabClassRoomToBatch);
router.patch("/:id/set-student-groups", setStudentGroupsToBatch);

module.exports = router;