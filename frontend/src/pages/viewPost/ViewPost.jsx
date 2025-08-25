import { useNavigate, useParams } from "react-router-dom";
import "./viewPost.scss";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../../hooks/useFetch";
import PostCard from "../../components/postCard/PostCard";
import CommentCard from "../../components/commentCard/CommentCard";
import BackNav from "../../components/backNav/BackNav";
import CreateComment from "../../components/createComment/CreateComment";
import Loader from "../../components/loaders/Loader";
import BadRequest from "../error/BadRequest";

const ViewPost = () => {
  const { postId } = useParams();
  const getPost = useFetch();
  const navigate = useNavigate();
  const postQuery = useQuery({
      queryKey: ["post", postId],
      queryFn: () => getPost(`/posts/single/${postId}`),
  });

  const { post } = postQuery?.data || {};
  if (post === null) navigate("/p/home");
  return (
    <div className="content view-post">
      <div>
        <BackNav label="Post" />
        {postQuery.isLoading ? (
          <Loader loading={postQuery.isLoading} />
        ) : postQuery.isError ? (
          <BadRequest />
        ) : (
          <>
            <PostCard post={post} pageQueryKey={["post", postId]} showDelete={true} />
            <CreateComment postId={post?.id} />

            <p>View comments ({post?._count?.comments ?? 0})</p>
            <div className="comment-section">
              {post?.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <CommentCard
                    comment={comment}
                    postId={post.id}
                    key={comment.id}
                  />
                ))
              ) : (
                <p style={{textAlign: "center", color: "#888"}}>No comments yet.</p>
              )}
            </div>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default ViewPost;
