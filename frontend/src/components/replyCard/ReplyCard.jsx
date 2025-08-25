import { formatDistanceToNowStrict } from "date-fns";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import useCommentMutation from "../../hooks/useCommentMutation";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;
import "./replyCard.scss";

const ReplyCard = ({ comment, refetch, postId }) => {
    const time = formatDistanceToNowStrict(new Date(comment.createdAt));
    const { likeComment, unlikeComment } = useCommentMutation(comment, postId, refetch);

    return (
        <div className="reply-card">
            <div className="reply-header">
                {comment.user.profile ? (
                    <img src={comment.user.profile.profilePicture} alt="" />
                ) : (
                    <img src={VITE_DEFAULT_PFP} alt="" />
                )}

                <span>{comment.user.username}</span>
                <span>•</span>
                <span>{time} ago</span>
            </div>
            <p className="reply-body">{comment.body}</p>
            <div className="reply-buttons">
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {comment.likes.length > 0 ? (
                        <>
                            <IconHeartFilled
                                className="red-heart"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    unlikeComment.mutate();
                                }}
                            />
                            {comment._count.likes}
                        </>
                    ) : (
                        <>
                            <IconHeart
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    likeComment.mutate();
                                }}
                            />
                            {comment._count.likes}
                        </>
                    )}
                </span>
            </div>
        </div>
    );
};

export default ReplyCard;