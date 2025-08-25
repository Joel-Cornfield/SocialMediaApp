const router = require("express").Router();
const initController = require("../controllers/initController");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, initController.initGet);
 
module.exports = router;