import { Outlet, useRouteError } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Sidebar from "../../components/sideBar/Sidebar";
import "./layout.scss";
import NotFound from "../error/NotFound";
import BadRequest from "../error/BadRequest";

const Layout = ({ children }) => {
  const error = useRouteError();
  const status = error?.status;

  return (
    <>
      <div id="main">
        <Header />
        <div id="page">
          <Sidebar />
          {error ? (
            <div className="content">
              {status === 404 ? <NotFound /> : <BadRequest />}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
};

export default Layout;