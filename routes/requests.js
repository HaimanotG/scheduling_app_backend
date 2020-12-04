const router = require("express").Router();

const {
    respondToRequest,
    receivedRequests,
    sentRequests
} = require("../controllers/RequestController");

router.get("/received-requests", receivedRequests);
router.get("/sent-requests", sentRequests);
router.patch("/respond-to-request", respondToRequest);

module.exports = router;
