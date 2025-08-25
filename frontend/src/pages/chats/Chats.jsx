//Chat itself is a component
// the purpose of this is to tender a list of chats
// Back Nav "chats"
// Search bar for existing list + "plus button (redirect)"
// show list as such

//okay but how do i redirect to a chat itself through?
//this chats page should accept a params
//the chatId should
import "./chats.scss";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../../hooks/useFetch";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import ChatPreview from "../../components/profilePreview/ChatPreview";
import BackNav from "../../components/backNav/BackNav";
import Loader from "../../components/loaders/Loader";
import BadRequest from "../error/BadRequest";
import MultipleProfilePreviewSkeleton from "../../components/skeleton/ProfilePreview/MultipleProfilePreviewSkeleton";

const Chats = () => {
  //README phase out
  const myFetch = useFetch();
  const navigate = useNavigate();


  const { data, isPending, isError } = useQuery({
    queryFn: () => myFetch("/chats"),
    queryKey: ["chats"],
  });

  return (
    <div className="content chats">
      <div>
        <BackNav label="Messages" />
        {isPending ? (
          // <Loader loading={isPending} />
          <MultipleProfilePreviewSkeleton 
            count={7}
            classes={"chat-preview"}
            />
        ) : isError ? (
          <BadRequest />
        ) : data.chats.length > 0 ? (
          <div className="chat-list">
            {data.chats.map((chat) => (
                <ChatPreview key={chat.id} chat={chat} />
            ))}
          </div>
        ) : (
          <p className="grey">
            No Chats. Send a message to other{" "}
            <a
              className="redirect"
              onClick={() => {
                navigate("/p/search");
              }}
            >
              users
            </a>{" "}
            to create a chat.
          </p>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Chats;