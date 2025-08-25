const router = require("express").Router();
const chatController = require("../controllers/chatController");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, chatController.getChats);

router.get("/:chatId", requireAuth, chatController.getDM);

router.put("/user/:userId", requireAuth, chatController.putChat);



module.exports = router;