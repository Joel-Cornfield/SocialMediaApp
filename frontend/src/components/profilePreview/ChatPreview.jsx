import { useNavigate } from "react-router-dom";
import "./profilePreview.scss";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;

const ChatPreview = ({ chat, hover=false }) => {
    const user = chat.otherUser;
    const navigate = useNavigate();

    const image_url = user.profile && user.profile?.profilePicture ? user.profile.profilePicture : VITE_DEFAULT_PFP;
    
    const handleClick = () => {
        navigate(`${chat.id}`, {state:{url:image_url}});
    };

    return (
        <div onClick={handleClick} className="profile-preview-card chat-preview">
            <img src={image_url} alt="profile picture" />
            <div>
                <p 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/p/users/${user.id}`);
                    }}
                >
                    {user.username}
                </p>
                <p>{chat.lastMessage || "(New Chat)"}</p>
            </div>
        </div>
    );
};

export default ChatPreview;