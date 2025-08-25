import { formatDistanceToNowStrict } from "date-fns";
import "./commentCard.scss";
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconMessages,
} from "@tabler/icons-react";
import { useState, Fragment } from "react";
import { useFetch } from "../../hooks/useFetch";
import {
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import ReplyCard from "../replyCard/ReplyCard";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;
import { Form, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import useCommentMutation from "../../hooks/useCommentMutation";
import Loader from "../loaders/Loader";

const CommentCard = ({ comment, postId }) => {
  const written_time = formatDistanceToNowStrict(new Date(comment.createdAt));
  const [showReplies, setShowReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const myFetch = useFetch();
  const fetchReplies = async () => {
    return await myFetch(`/comments/${comment.id}`);
  };
  const fetchPostReply = async () => {
    return await myFetch("/comments", {
      method: "POST",
      body: JSON.stringify({
        parentComment: comment.id,
        body: input,
        postId,
      }),
    });
  };

  const createReplyMutation = useMutation({
    mutationFn: fetchPostReply,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(["post", postId]);
      setShowInput(false);
      setInput("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmitReply = (e) => {
    e.preventDefault();
    createReplyMutation.mutate();
  };

  const {
    data,
    error,
    isFetching,
    status,
    refetch,
  } = useQuery({
    queryKey: ["replies", comment.id],
    queryFn: fetchReplies,
    enabled: showReplies,
  });
  const { likeComment, unlikeComment } = useCommentMutation(comment, postId, refetch);
  if (status == "error") return <p>{error.message}</p>;
  if (status == "loading") return <Loader loading={true} />;

  return (
    <div className="parent-comment-card">
      <div className="comment-header">
        {comment.user.profile ? (
          <img src={comment.user.profile.profilePicture} alt="" />
        ) : (
          <img src={VITE_DEFAULT_PFP} alt="" />
        )}

        <span
          className="comment-header-name"
          onClick={()=>{navigate(`/p/users/${comment.user.id}`)}}
        >{comment.user.username}</span>
        <span>•</span>
        <span>{written_time} ago</span>
      </div>
      <p className="comment-body">{comment.body}</p>
      <div className="comment-buttons">
        {comment.likes.length > 0 ? (
          <p>
            <IconHeartFilled
              className="red-heart"
              onClick={(e) => {
                e.stopPropagation();
                unlikeComment.mutate();
              }}
            />
            {comment._count.likes}
          </p>
        ) : (
          <p>
            <IconHeart
              onClick={(e) => {
                e.stopPropagation();
                likeComment.mutate();
              }}
            />
            {comment._count.likes}
          </p>
        )}

        {comment.childComment.length > 0 ? (
          showReplies ? (
            <p
              onClick={() => {
                setShowReplies(false);
              }}
            >
              <IconMessages /> Hide replies
            </p>
          ) : (
            <p
              onClick={() => {
                setShowReplies(true);
                setShowInput(false);
              }}
            >
              <IconMessages /> show replies
            </p>
          )
        ) : (
          <></>
        )}

        <p onClick={() => setShowInput((prev) => !prev)}>
          <IconMessage /> reply
        </p>
      </div>

      {showInput && ( // refactor user-profile to its own component!
        <>
          <Form onSubmit={handleSubmitReply}>
            <TextareaAutosize
              required
              className="reply-comment"
              placeholder="Add a reply..."
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
            />
            <div className="post-reply">
              <Loader loading={createReplyMutation.isPending}/>
              <button disabled={createReplyMutation.isPending} type="submit">reply</button>
            </div>
          </Form>
        </>
      )}
      {data && showReplies && (
        <div className="group-replies">
          {(Array.isArray(data.replies) ? data.replies : [])
            .reduce((acc, reply) => {
              if (!acc.some(r => r.id === reply.id)) {
                acc.push(reply);
              }
              return acc;
            }, [])
            .map((reply) => (
              <ReplyCard
                comment={reply}
                key={reply.id} // <-- ensure key is unique and set here
                refetch={refetch}
                postId={postId}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;