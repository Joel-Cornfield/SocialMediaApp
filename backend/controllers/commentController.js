const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const myError = require("../lib/myError");
const { create_comment, get_child_comments } = require("../prisma/queries/commentQuery");
const { validationHandle } = require("../middleware/validationHandle");
const prisma = new PrismaClient();

exports.getChildComment = asyncHandler(async (req, res, next) => {
    const id = req.comment.id;

    // Fetch all child comments at once
    const replies = await get_child_comments(id, req.user.id);

    return res.status(200).json({
        replies
    });
});


exports.deleteComment = asyncHandler(async(req,res,next)=>{
    //User delete many to now throw error, we handle the error ourselves

    const comment = await prisma.comment.delete({
        where:{
            id:req.params.commentId
        },
        select:{
            id:true //return id so frontend can clear it off
        }
    })
    // console.log("deleted comment result: ",result)
    res.status(200).json({comment})

    
})


exports.postComment = [
    body("body")
        .trim()
        .isLength({min:1,max:400}),
    body("postId")
        .trim()
        .isString(),
    body("parentComment") //Optional
        .optional()
        .trim(),
    validationHandle,

    asyncHandler(async(req, res, next) =>{
        //only one layer of parenting allowed
        let {postId,body} = req.body;
        postId = (postId);
        const data = {}
        
        if (req.body.parentComment && req.body.parentComment !== "") {
            const parentId = String(req.body.parentComment); 
            const exist = await prisma.comment.findUnique({where:{id:parentId }});
            if (!exist) throw new myError(`Parent comment ${parentId} does not exist`,400);
            if (exist.parentCommentId) throw new myError(`Illegal comment: Parent comment is already a child`,400);
            if (exist.postId!=postId) throw new myError(`Illegal comment, parent in different post`,400);
            data.parentCommentId=exist.id;
        }

        data.body = body;
        data.postId = postId;
        data.userId=req.user.id;

        const comment = await create_comment(data);

        res.status(200).json({comment});
    })
]

exports.postCommentLike = asyncHandler(async(req,res,next)=>{
    const commentId = req.comment.id;
    const result = await prisma.commentLike.upsert({
        where:{
            userId_commentId:{
                userId:req.user.id,
                commentId
            }
        },
        update:{},
        create:{
            userId:req.user.id,
            commentId
        }
    })
    res.status(200).json({result})
})

exports.postCommentUnlike = asyncHandler(async(req,res,next)=>{
    const commentId = req.comment.id;
    const result = await prisma.commentLike.deleteMany({
        where:{
            userId:req.user.id,
            commentId
        },
    })
    // console.log("deleted:",result)
    res.status(200).json({result})
})

