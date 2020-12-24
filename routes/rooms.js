const router = require("express").Router();
const {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/RoomController");

router.get("/", getRooms);
router.get("/:id", getRoom);
router.post("/", addRoom);
router.delete("/:id", deleteRoom);
router.patch("/:id", updateRoom);

module.exports = router;
