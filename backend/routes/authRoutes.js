const router = require("express").Router();
const authController = require("../controllers/authController");
const hasAccount = require("../middleware/hasAccount");


router.patch("/oauth/username", 
    hasAccount,
    authController.setUsername
)

router.post('/local/login', authController.loginPost);
router.post('/local/signup', authController.signupPost);

module.exports = router;
