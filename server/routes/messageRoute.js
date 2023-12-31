const { getMessages, createMessage } = require("../controllers/messageController");

const router = require("express").Router();

router.post("/",createMessage);
router.get("/:chatId" ,getMessages);

module.exports = router;