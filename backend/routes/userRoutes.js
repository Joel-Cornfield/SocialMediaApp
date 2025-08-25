const router = require("express").Router();
const userController = require("../controllers/userController");
const ownAccountAuth = require("../middleware/ownAccountAuth");
const notAccountOwnerAuth = require("../middleware/notOwnerAccountAuth");
const requireAuth = require("../middleware/requireAuth");

// Get all users
router.get("/", requireAuth, userController.getAllUsers);

// Get user information
router.get("/:userId", requireAuth, userController.getUserDetails);

router.get("/self/:userId", ownAccountAuth, userController.getUserDetails);

// Get follower of user 
router.get("/:userId/followers", userController.getFollowers);

// Get user's following 
router.get("/:userId/following", userController.getFollowing);

// Update user profile
router.patch("/:userId/profile", ownAccountAuth, userController.patchProfile);

// Update user settings 
router.patch("/:userId/settings", ownAccountAuth, userController.patchSettings);

// Delete account
router.delete("/:userId", ownAccountAuth, userController.deleteAccount);

// Follow user 
router.post("/:userId/follow", notAccountOwnerAuth, userController.followUser);

// Unfollow user
router.post("/:userId/unfollow", notAccountOwnerAuth, userController.unfollowUser);

module.exports = router;
