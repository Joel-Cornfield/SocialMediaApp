import { useState } from "react";
import "./home.scss";
import PostCard from "../../components/postCard/PostCard";
import ProfilePreview from "../../components/profilePreview/ProfilePreview";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loaders/Loader";
import BadRequest from "../error/BadRequest";
import { useFetch } from "../../hooks/useFetch";
import MultiplePostCardSkeleton from "../../components/skeleton/PostCardSkeleton/MultiplePostCardSkeleton";
import MultipleProfilePreviewSkeleton from "../../components/skeleton/ProfilePreview/MultipleProfilePreviewSkeleton";

const Home = () => {
  const myFetch = useFetch();
  const navigate = useNavigate();
  const [feedSort, setFeedSort] = useState("recent"); //or following

  function handleClick(postId) {
    navigate(`/p/posts/${postId}`);
  }

  const feedQuery = useQuery({
    queryKey: ["feed", "post"],
    queryFn: () => myFetch("/init"),
  });

  const {
    new_post = [],
    new_follower_posts = [],
    new_users = [],
    top_users = [],
  } = feedQuery.data || {};


  return (
    <div className="content" id="home-page">
      <div className="content-main">
        <div className="feed-options">
          <span
            onClick={() => setFeedSort("recent")}
            className={feedSort == "recent" ? "selected" : ""}
          >
            Recent
          </span>
          <span
            onClick={() => setFeedSort("following")}
            className={feedSort == "following" ? "selected" : ""}
          >
            Following
          </span>
        </div>
        {feedQuery.isLoading ? (
          <MultiplePostCardSkeleton />
          // <Loader loading={feedQuery.isLoading} />
        ) : feedQuery.isError ? (
          <BadRequest />
        ) : feedSort == "recent" ? (
          new_post.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              handleClick={() => handleClick(post.id)}
              pageQueryKey={["feed", "post"]}
            />
          ))
        ) : new_follower_posts.length === 0 ? (
          <p className="no-results">No following posts</p>
        ) : (
          new_follower_posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              handleClick={() => handleClick(post.id)}
              pageQueryKey={["feed", "post"]}
            />
          ))
        )}
      </div>
      <div className="content-side">
        {feedQuery.isLoading ? (
          <>
            <section className="side-content-box">
              <p>Latest users</p>
              <MultipleProfilePreviewSkeleton />
            </section>
            <section className="side-content-box">
              <p>Most followed</p>
              <MultipleProfilePreviewSkeleton />
            </section>
            
  
          </>

        ) : (
          <>
            <section className="side-content-box">
              <p>Latest users</p>
              {new_users.map((user) => (
                <ProfilePreview key={user.id} user={user} />
              ))}
            </section>
            <section className="side-content-box">
              <p>Most followed</p>
              {top_users.map((user) => (
                <ProfilePreview key={user.id} user={user} />
              ))}
            </section>
          </>
        )}

      </div>

    </div>
  );
};

export default Home;