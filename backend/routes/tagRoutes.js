const router = require("express").Router();
const tagController = require("../controllers/tagController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth)
router.get("/:tagId/posts", tagController.getTagPosts);

module.exports = router;