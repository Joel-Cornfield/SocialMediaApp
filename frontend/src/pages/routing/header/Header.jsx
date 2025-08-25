import { IconBell } from "@tabler/icons-react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./header.scss";
const VITE_DEFAULT_PFP = import.meta.env.VITE_DEFAULT_PFP;
const Logo = import.meta.env.VITE_ICON;

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div id="header">
      <img className="logo" src={Logo} alt="" />
      <p
        onClick={() => {
          navigate("/p/home");
        }}
        className="brand"
      >
        Bloom
      </p>

      <div className="notif"></div>
      {user && user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt=""
          onClick={() => navigate(`/p/users/${user.id}`)}
        />
      ) : (
        <img
          src={VITE_DEFAULT_PFP}
          alt=""
          onClick={() => navigate(`/p/users/${user.id}`)}
        />
      )}
    </div>
  );
};

export default Header;