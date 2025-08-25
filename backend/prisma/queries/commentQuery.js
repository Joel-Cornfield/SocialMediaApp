const {PrismaClient} = require("@prisma/client");
const { SELECT_USER_BASIC } = require("./querySnippets");
const prisma = new PrismaClient();

async function get_child_comments(id, currUserId) {
    return await prisma.comment.findMany({
        where: {
            parentCommentId: id,
        },
        select: {
            id: true,
            body: true,
            createdAt: true,
            parentCommentId: true,
            _count: {
                select: { likes: true }
            },
            user: {
                select: SELECT_USER_BASIC
            },
            likes: {
                where: { userId: currUserId }
            },
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}



 async function create_comment(commentData){

    return await prisma.comment.create({
        data: {
            ...commentData,
            parentCommentId: commentData.parentCommentId || null, // Ensure parentCommentId is set to null if not provided
        },
        select:{
            id:true,
            body:true,
            createdAt:true,
            parentCommentId:true,
            user:{
                select:{
                    id:true,
                    username:true,
                    profile:{
                        select:{
                            profilePicture:true
                        }
                    }
                }
            },
            _count:{
                select:{
                    likes:true
                }
            },
        }
    })

}

module.exports = {
    create_comment,
    get_child_comments,
}
