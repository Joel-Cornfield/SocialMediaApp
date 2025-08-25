const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const { SELECT_USER_BASIC,INCLUDE_FEED_POST,INCLUDE_SINGLE_POST } = require("./querySnippets");


 async function all_posts(currUserId){
    const posts = await prisma.post.findMany({ 
        include:INCLUDE_FEED_POST(currUserId)
        ,
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts;
}

 async function user_posts(id,currUserId){
    const posts = await prisma.post.findMany({ 
        include:INCLUDE_FEED_POST(currUserId),
        where:{
            userId:id
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts;
}


 async function get_post(id,currUserId){ 
    const post = await prisma.post.findUnique({
        where:{
            id
        },
        include: {
            comments: {
                where: { parentCommentId: null }, 
                include: {
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    likes: true,
                    childComment: true,
                    _count: {
                        select: { likes: true }
                    }
                }
            },
            author: {
                include: {
                    profile: true // <-- added this so author.profile.profilePicture is available
                }
            },
            tags: true,
            likes: true,
            _count: {
                select: { comments: true, likes: true }
            }
        }
    })
    return post;
}

 async function get_following_posts(currUserId){
    
    const posts = await prisma.post.findMany({
        //the author of the post is being followed by x user Id
        where:{ //find a post
            author:{ //where the POSTER of the post
                followers:{
                    some:{
                        followerId:currUserId
                    }
                }
            }
        },
        include:INCLUDE_FEED_POST(currUserId),
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts
}

async function get_liked_posts(currUserId){
    return await prisma.post.findMany({
        where:{
            likes:{
                some:{
                    userId:currUserId
                }
            }
        },
        include: INCLUDE_FEED_POST(currUserId),
        orderBy:{
            createdAt:'desc'
        }
    })
}


async function create_post(reqData){
    return await prisma.post.create({
        data:reqData,
        include:{
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            },            
            author:{
                select:SELECT_USER_BASIC
            }

        }
    })
}

 async function delete_post(id){
    const post = await prisma.post.delete({
        where:{id},
        include:INCLUDE_FEED_POST
    })
    return post;
}



async function update_post(postId,postData,currUserId){
    return await prisma.$transaction(async(tx)=>{

        const post = await tx.post.update({
            where:{id:postId},
            data:{
                ...postData,
            },
            include:INCLUDE_FEED_POST(currUserId)
        })

        return post;
    })
}



module.exports = {
    all_posts,
    user_posts,
    get_post,
    get_following_posts,
    create_post,
    delete_post,
    update_post,
    get_liked_posts
};
  


module.exports = {
    all_posts,
    user_posts,
    get_post,
    get_following_posts,
    create_post,
    delete_post,
    update_post,
    get_liked_posts
};
