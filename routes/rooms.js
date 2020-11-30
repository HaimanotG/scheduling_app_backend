const router = require("express").Router();
const {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/RoomController");

router.get("/", getRooms);
router.post("/", addRoom);
router.delete("/:id", deleteRoom);
router.patch("/:id", updateRoom);

module.exports = router;
