const router = require("express").Router();
const commentController = require("../controllers/commentController");
const commentExist = require("../middleware/commentExist");
const ownCommentAuth = require("../middleware/ownCommentAuth");
const requireAuth = require("../middleware/requireAuth");

router.get("/:commentId", requireAuth, commentExist, commentController.getChildComment);

router.post("/", requireAuth, commentController.postComment);

router.post("/:commentId/like", requireAuth, commentExist, commentController.postCommentLike);

router.post("/:commentId/unlike", requireAuth, commentExist, commentController.postCommentUnlike);

router.delete("/:commentId", requireAuth, commentExist, ownCommentAuth, commentController.deleteComment);

module.exports = router;