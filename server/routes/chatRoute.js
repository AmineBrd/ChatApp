const { createChat, findChat, getUserChats } = require("../controllers/chatController");

const router = require("express").Router();

router.post("/", createChat);
router.get("/:userId", getUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;