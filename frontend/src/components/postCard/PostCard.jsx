import { formatDistanceToNowStrict } from "date-fns";
import {
  IconBrandGithub,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import usePostMutation from "../../hooks/usePostMutation";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import "./postCard.scss";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;

const PostCard = ({
    post,
    pageQueryKey,
    showDelete = false
}) => {
    const time = formatDistanceToNowStrict(new Date(post.createdAt));
    const queryKey = pageQueryKey || ["feed"];
    const { likePost, unlikePost, deletePost } = usePostMutation(post, queryKey);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const currUserId = user ? (user.id) : null;
    const [type, setType] = useState(null);

    useEffect(() => {
        if (post.attachment){
            const ext = post.attachment.split(".").pop().toLowerCase();
            const imgExt =  ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
            const vidExt =  ['mp4', 'webm', 'ogg', 'mkv'];
            if (imgExt.includes(ext)) setType("img")
            else if (vidExt.includes(ext)) setType("video")
        }
    }, [post])

    if (!post) return null;
    
    if (post.gitLink) {
        post.gitLink = "www.github.com";
        if (post.gitLink.startsWith("www")) post.gitLink = `https://${post.gitLink}`;
    }


    return (
        <div onClick={() => navigate(`/p/posts/${post.id}`)} className="postcard">
            <div className="post-header">
                {post.author.profile ? (
                    <img src={post.author.profile.profilePicture} alt="" />
                ) : (
                    <img src={VITE_DEFAULT_PFP} alt="" />
                )} 

                <span 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/p/users/${post.author.id}`);
                    }}
                >
                    {post.author.username}
                </span>
                <span>•</span>
                <span className="written-time">{time} ago</span>
                {post.user?.id === currUserId && showDelete && (
                    <IconTrash 
                        onClick={(e) => {
                            e.stopPropagation();
                            deletePost.mutate();
                        }}
                    />
                )}
            </div>
            <div className="post-body">
                <p>{post.body}</p>
                <p className="post-tags">
                    {post.tags && post.tags.map((tag, key) => <span key={key}>#{tag.name}</span>)}
                </p>
                {post.attachment && type==="img" && <img src={post.attachment} alt="Post Media" />}
                {post.attachment && type==="video" && 
                    <>
                    <video  poster={post.attachment} controls >
                    <source src={post.attachment} type="video/mp4"/>
                    </video>
            
                    </>
                }

            </div>
            <div className="post-buttons">
                <div className="button-container">
                    {post.likes.length > 0 ? (
                        <IconHeartFilled
                        className="red-heart"
                        onClick={(e) => {
                            e.stopPropagation();
                            unlikePost.mutate();
                        }}
                        />
                    ) : (
                        <IconHeart
                        onClick={(e) => {
                            e.stopPropagation();
                            likePost.mutate();
                        }}
                        />
                    )}
                    <span>{post._count.likes}</span>
                </div>
                <div className="button-container">
                    <IconMessageCircle />
                    <span>{post._count.comments}</span>
                </div>

                {post.gitLink && (
                    <IconBrandGithub
                        onClick={() => {
                            window.open(`${post.gitLink}`, "_blank", "noopener,noreferrer");
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PostCard;
