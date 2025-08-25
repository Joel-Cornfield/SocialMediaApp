const router = require("express").Router();
const postController = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");
const ownPostAuth = require("../middleware/ownPostAuth");

router.get("/", requireAuth, postController.getManyPosts);

router.get("/single/:postId", requireAuth, postController.getPost);

router.get("/following", requireAuth, postController.getFollowingPosts);

router.get("/likes", requireAuth, postController.getLikedPosts);

router.post("/", requireAuth, postController.createPost);

router.delete("/:postId", ownPostAuth, postController.deletePost);

router.patch("/:postId/link", ownPostAuth, postController.patchPostLink);

router.patch("/:postId", ownPostAuth, postController.updatePost);

router.post("/:postId/like", requireAuth, postController.likePost);

router.post("/:postId/unlike", requireAuth, postController.unlikePost);

module.exports = router;