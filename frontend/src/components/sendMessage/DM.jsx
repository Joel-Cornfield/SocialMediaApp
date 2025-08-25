import { useEffect, useRef, useState } from "react";
import BackNav from "../backNav/BackNav";
import "./DM.scss";
import { Form, useLocation, useParams } from "react-router-dom";
import { IconSend } from "@tabler/icons-react";
import { useFetch } from "../../hooks/useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import TextBubble from "./TextBubble";
import TextareaAutosize from "react-textarea-autosize";
import { useAuthContext } from "../../hooks/useAuthContext";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Loader from "../loaders/Loader";
import BadRequest from "../../pages/error/BadRequest";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DM = () => {
  const { user } = useAuthContext();
  const currUserId = user.id;
  const { chatId } = useParams();
  const myFetch = useFetch();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const bottomChatRef = useRef(null);
  const inputRef = useRef(null);
  const pfp_url = useLocation().state.url;

  // Fetch initial message with useQuery
  const { data, isPending, isError } = useQuery({
    queryFn: () => myFetch(`/chats/${chatId}`),
    queryKey: ["DM", chatId],
  });

  useEffect(() => {
    if (bottomChatRef.current)
      bottomChatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  useEffect(() => {
    // Connect to socket server and allow receiving of messages
    socketRef.current = io(VITE_SERVER_URL, {
      auth: {
        token: user.token, // pass JWT token here
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current.emit("join_DM", chatId);

    socketRef.current.on("receive message", (msg) => {
      queryClient.setQueryData(["DM", chatId], (old) => {
        if (!old) return { messages: [{ ...msg, fromUser: msg.senderId === currUserId }] };

        const messageExists = old.messages.some((m) => m.id === msg.id);

        return {
          ...old,
          messages: messageExists
            ? old.messages
            : [...old.messages, { ...msg, fromUser: msg.senderId === currUserId }],
        };
      });
    });

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive message");
        socketRef.current.disconnect();
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [user.token]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (input) => {
      socketRef.current.emit("send message", {
        chatId,
        input,
        senderId: currUserId,
      });
    },
    onSuccess: () => {
      setInput("");
    },
    onError: (error, variables, context) => {
      console.log("Error sending message: ", error);
      toast.warn("Error sending message. Please try again later.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current.value.trim()) {
      sendMessageMutation.mutate(inputRef.current.value);
    }
  };

  return (
    <div className="content DM">
      <div>
        {data && data.otherUser.username ? (
          <BackNav
            label={data.otherUser.username || ""}
            customNav="/p/message"
            labelLink={`/p/users/${data.otherUser.id}`}
            image={pfp_url}
          />
        ) : (
          <BackNav label={""} customNav="/p/message" />
        )}

        {isPending ? (
          <div className="chat-messages">
            <Loader loading={isPending} />
          </div>
        ) : isError ? (
          <BadRequest />
        ) : (
          <div className="chat-messages">
            {data.messages.map((msg, i) => (
              <div key={msg.id || msg.createdAt}>
                {i > 1 &&
                  data.messages[i].createdAt.substring(0, 10) !==
                    data.messages[i - 1].createdAt.substring(0, 10) && (
                    <p className="msg-date" key={`date-${msg.createdAt}`}>
                      {format(new Date(data.messages[i].createdAt), "EEE, do MMM yyyy")}
                    </p>
                  )}
                <TextBubble key={msg.id || msg.createdAt} message={msg} />
              </div>
            ))}
            <div id="bottomChatRef" ref={bottomChatRef}></div>
          </div>
        )}
        <div className="chat-input">
          <Form onSubmit={handleSubmit}>
            <TextareaAutosize
              ref={inputRef}
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a message..."
            />
            <button type="submit">
              <IconSend size={16} />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DM;
