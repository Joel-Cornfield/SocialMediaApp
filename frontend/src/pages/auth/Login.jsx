import "./auth.scss";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
const Logo = import.meta.env.VITE_ICON;
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { IconAlertOctagon } from "@tabler/icons-react";
import Loader from "../../components/loaders/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);
  const { dispatch } = useAuthContext();
  const [searchParams] = useSearchParams();
  const handleFetch = useFetch(); // Get fetch function from custom hook

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const userParam = searchParams.get("username");
    const idParam = searchParams.get("id");
    const profilePictureParam = searchParams.get("profilePicture");
    if (tokenParam && userParam && idParam && profilePictureParam) {
      const payload = { token: tokenParam, username: userParam, id: idParam, profilePicture: profilePictureParam };
      dispatch({ type: "LOGIN", payload });
      localStorage.setItem("user", JSON.stringify(payload));
      navigate("/p/home");
    }
  }, []);

  const handleSubmit = async (e, inputUser, inputPass) => {
    setDisabled(true);
    if (e) e.preventDefault();
    try {
      const username = inputUser ? inputUser : e?.target.username.value;
      const password = inputPass ? inputPass : e?.target.password.value;
      const data = await handleFetch("/auth/local/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/p/home");
    } catch (err) {
      console.log(err);
      setDisabled(false);
      setError(err.message);
    }
  };

  return (
    <>
      <img src={Logo} alt="" />
      <p>Welcome back!</p>
      <p>Please fill in your login details</p>
      <Form onSubmit={handleSubmit} className="form-general login">
        <input
          name="username"
          type="text"
          placeholder="Username"
          minLength="2"
          maxLength="35"
          pattern="^[a-zA-Z0-9_.]*$"
          autoComplete="new-password"
          required
        />
        <input type="password" name="password" autoComplete="new-password" placeholder="Password" minLength="2" required />
        <button disabled={disabled} type="submit">Login</button>
      </Form>
      <button onClick={() => handleSubmit(null, "GuestUser", "123123")} id="guest-login">Guest User</button>
      <p className="signup">
        Don't have an account? <span onClick={() => navigate("../signup")}>Sign up</span>
        {disabled && <Loader color="grey" loading={true} />}
      </p>
      <p className="error-box">
        {error && (
          <>
            <IconAlertOctagon size="18px" />
            {error}
          </>
        )}
      </p>
    </>
  );
};

export default Login;
