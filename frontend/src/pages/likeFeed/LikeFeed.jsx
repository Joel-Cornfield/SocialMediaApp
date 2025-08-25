import { useFetch } from "../../hooks/useFetch";
import PostCard from "../../components/postCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import BackNav from "../../components/backNav/BackNav";
import Loader from "../../components/loaders/Loader";
import BadRequest from "../error/BadRequest";
import MultiplePostCardSkeleton from "../../components/skeleton/PostCardSkeleton/MultiplePostCardSkeleton";
import "./likeFeed.scss";

const LikeFeed = () => {
    const myFetch = useFetch();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["like-feed"],
        queryFn: () => myFetch("/posts/likes"),
    });

    return (
        <>
            <div className="content like-feed">
                <div className="like-feed">
                    <BackNav label="Liked Posts" />
                    {isLoading ? (
                        <MultiplePostCardSkeleton />
                    ) : isError ? (
                        <BadRequest />
                    ) : data.posts.length > 0 ? (
                        data.posts.map((post) => (
                            <PostCard 
                                key={post.id}
                                post={post}
                                pageQueryKey={["like-feed"]}
                            />
                        ))
                    ) : (
                        <p className="no-results">No liked posts</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LikeFeed;
