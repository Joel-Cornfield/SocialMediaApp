const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const userRoutes = require("./userRoutes");
const commentRoutes = require("./commentRoutes");
const tagRoutes = require("./tagRoutes");
const initRoutes = require("./initRoutes");
const chatRoutes = require("./chatRoutes");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/comments", commentRoutes);
router.use("/tags", tagRoutes);
router.use("/init", initRoutes);
router.use("/chats", chatRoutes);

module.exports = router;
