import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import Layout from "./Layout";
import Home from "../home/Home";
import AuthPage from "../auth/Layout";
import Login from "../auth/Login";
import Signup from "../auth/SignUp";
import SetUsername from "../auth/SetUsername";
import CreatePost from "../createPost/CreatePost";
import ViewPost from "../viewPost/ViewPost";
import UserProfile from "../userProfile/UserProfile";
import EditProfile from "../editProfile/EditProfile";
import SearchUsers from "../searchUsers/SearchUsers";
import LikeFeed from "../likeFeed/LikeFeed";
import Chats from "../chats/Chats";
import DM from "../../components/sendMessage/DM";
import NotFound from "../error/NotFound";
import Settings from "../settings/Settings";

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: (
          <AuthPage>
            <Login />
          </AuthPage>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthPage>
            <Signup />
          </AuthPage>
        ),
      },
      {
        element: (
          <AuthPage>
            <SetUsername />
          </AuthPage>
        ),
        path: "oauth/setusername",
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      /**
       * ============== UNPROTECTED ROUTES ===============
       */
      {
        path: "",
        element: <Navigate to="/p/home" />, // Create the UI for the feed page
      },
      /**
       * =============== PROTECTED ROUTES =================
       */
      {
        element: <ProtectedRoute />,
        path: "p", // Protected
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "posts/:postId",
            element: <ViewPost />,
          },
          {
            path: "search",
            element: <SearchUsers />,
          },
          {
            path: "users/:userId",
            element: <UserProfile />,
          },
          {
            path: "view-profile",
            element: <EditProfile />,
          },
          {
            path: "likes",
            element: <LikeFeed />,
          },
          {
            path: "create",
            element: <CreatePost />,
          },
          {
            path: "message",
            element: <Chats />,
          },
          {
            path: "message/:chatId",
            element: <DM />,
          },
          {
            path: "/p/settings",
            element: <Settings />,
          },
        ],
      },
    ],
    errorElement: <Layout />,
  },
]);

export default router;