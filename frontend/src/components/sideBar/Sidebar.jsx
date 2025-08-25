import { sidebarData } from './sidebarData';
import { useLocation, useNavigate } from 'react-router-dom';
import "./sidebar.scss";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.substring(2) === path;

    return (
        <div className="sidebar">
            <ul className="sidebar-ul">
                {sidebarData.map((item, key) => (
                    <li 
                        className={isActive(item.link) ? "sidebar-element hovered" : "sidebar-element"}
                        key={key}
                        onClick={() => {
                            navigate(`/p${item.link}`);
                        }}
                    >
                        {<item.icon/>}
                        <p className="nav-name">{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;