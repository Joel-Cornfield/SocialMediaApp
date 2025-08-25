const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// JWT token validation
function validateToken(token) {
    if (!token) return null; // Prevent jwt.verify from throwing on empty token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // assumes payload contains user id as 'id'
    } catch (err) {
        return null;
    }
}

module.exports = (io) => {
    // Attach authentication middleware to socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        // validate token and extract user ID
        const userId = validateToken(token);
        if (!userId) return next(new Error("Authentication error"));
        socket.user = { id: userId };
        next();
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.user.id, "Socket ID:", socket.id);

        // Join a chat room
        socket.on("join_DM", (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.user.id} joined chat ${chatId}`);
        });

        // Handle sending message
        socket.on("send message", async ({ chatId, input }) => {
            if (!input) return;

            try {
                const message = await prisma.message.create({
                    data: {
                        content: input,
                        senderId: socket.user.id,
                        chatId: chatId.toString(),
                    },
                });

                await prisma.chat.update({
                    where: { id: chatId.toString() },
                    data: {
                        lastMessageAt: new Date(),
                        lastMessage: input,
                    },
                });

                // Emit to all participants including sender
                io.to(chatId).emit("receive message", { 
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    fromUser: message.senderId === socket.user.id, // boolean
                    senderId: message.senderId // optional: add senderId for frontend
                });

                console.log("Message sent & chat updated:", message.id);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.user.id);
        });
    });
};
