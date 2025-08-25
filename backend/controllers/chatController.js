const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const myError = require("../lib/myError");
const { get_user_chats, get_chat_messages } = require("../prisma/queries/chatQueries");

exports.getChats = asyncHandler(async (req, res) => {
    const userChats = await get_user_chats(req.user.id);

    const chats = userChats.map(chat => ({
        id: chat.id,
        otherUser: chat.userAId === req.user.id ? chat.userB : chat.userA,
        lastMessageAt: chat.lastMessageAt,
        lastMessage: chat.lastMessage
    }));

    res.status(200).json({ chats });
});

exports.getDM = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;

    const exist = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!exist) return res.status(404).json({ error: "No such chat" });

    if (exist.userAId !== req.user.id && exist.userBId !== req.user.id) {
        return res.status(400).json({ error: `User is not a member of chat ${chatId}` });
    }

    const otherUserId = req.user.id === exist.userAId ? exist.userBId : exist.userAId;

    const [chatHistory, otherUser] = await Promise.all([
        get_chat_messages(chatId),
        prisma.user.findUnique({
            where: { id: otherUserId },
            select: { username: true, id: true },
        }),
    ]);

    const messages = chatHistory.map(msg => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        fromUser: msg.senderId === req.user.id
    }));

    res.status(200).json({ messages, otherUser });
});

exports.putChat = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const currUserId = req.user.id;

    if (userId === currUserId) throw new myError("Cannot create chat with self", 400);

    const existUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new myError("User does not exist", 400);

    const [smaller, bigger] = userId < currUserId ? [userId, currUserId] : [currUserId, userId];

    const chat = await prisma.chat.upsert({
        where: { userAId_userBId: { userAId: smaller, userBId: bigger } },
        update: {},
        create: { userAId: smaller, userBId: bigger }
    });

    res.status(200).json({ chat });
});
