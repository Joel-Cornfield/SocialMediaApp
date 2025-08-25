import useFollowMutation from "../../hooks/useFollowMutation";
import { useNavigate } from "react-router-dom";
import "./profilePreview.scss";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;

const ProfilePreview = ({ user, showFollow = true, clickable = false }) => {
  const navigate = useNavigate();

  const { follow, unfollow } = useFollowMutation(user, ["feed", "post"]);
  return (
    <div
      onClick={() => {
        clickable && navigate(`/p/users/${user.id}`);
      }}
      className="profile-preview-card"
    >
      {user.profile && user.profile?.profilePicture ? (
        <img src={user.profile.profilePicture} alt="" />
      ) : (
        <img
          src={VITE_DEFAULT_PFP}
          alt=""
        />
      )}

      <div>
        <p onClick={() => navigate(`/p/users/${user.id}`)}>{user.username}</p>
        <p>{user.displayName}</p>
      </div>
      {showFollow ? (
        user.followers.length == 0 ? (
          <button className="filled" onClick={() => follow.mutate()}>
            Follow
          </button>
        ) : (
          <button onClick={() => unfollow.mutate()}>Unfollow</button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfilePreview;