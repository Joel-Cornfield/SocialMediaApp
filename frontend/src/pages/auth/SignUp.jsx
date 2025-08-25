import "./auth.scss";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
const Logo = import.meta.env.VITE_ICON;
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetch } from "../../hooks/useFetch";
import { IconAlertOctagon, IconEye, IconEyeOff } from "@tabler/icons-react";
import Loader from "../../components/loaders/Loader";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { dispatch } = useAuthContext();
  const handleFetch = useFetch(); // Use custom fetch hook
  const [disabled, setDisabled] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const passChange = (e) => setPass(e.target.value);
  const confirmChange = (e) => setConfirm(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { displayName, password, confirm_password } = e.target;
    if (password.value !== confirm_password.value) {
      return;
    }

    setDisabled(true);
    try {
      const data = await handleFetch("/auth/local/signup", {
        method: "POST",
        body: JSON.stringify({
          username: e.target.username.value,
          displayName: displayName.value,
          password: password.value,
          confirm_password: confirm_password.value,
        }),
      });

      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/p/home");
    } catch (err) {
      console.log(err);
      setError(err.message);
      setDisabled(false);
    }
  };

  return (
    <>
      <img src={Logo} alt="" />
      <p>Join us Today!</p>
      <p>Please fill in your details below</p>
      <Form className="form-general login" onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          minLength="2"
          maxLength="35"
          autoComplete="new-password"
          pattern="^[a-zA-Z0-9_.]*$"
          title="Username must be alphanumeric, and may contain periods, underscores, and hyphens"
        />
        <input
          name="displayName"
          type="text"
          placeholder="Display Name"
          required
          minLength="2"
          maxLength="35"
        />
        <div className="input-container">
          <input
            value={pass}
            onChange={passChange}
            name="password"
            type={passVisible ? "text" : "password"}
            placeholder="Password"
            minLength="3"
            required
            autoComplete="new-password"
          />
          {passVisible ? (
            <IconEye className="input-icon" onClick={() => setPassVisible(false)} />
          ) : (
            <IconEyeOff className="input-icon" onClick={() => setPassVisible(true)} />
          )}
        </div>
        <div className="input-container">
          <input
            value={confirm}
            className={pass !== confirm ? "mismatch" : ""}
            onChange={confirmChange}
            name="confirm_password"
            type={confirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            minLength="3"
            required
            autoComplete="new-password"
          />
          {confirmVisible ? (
            <IconEye className="input-icon" onClick={() => setConfirmVisible(false)} />
          ) : (
            <IconEyeOff className="input-icon" onClick={() => setConfirmVisible(true)} />
          )}
        </div>
        <button disabled={disabled} type="submit">Sign up</button>
      </Form>
      <p className="signup">
        Already have an account? <span onClick={() => navigate("../login")}>Login</span>
        {disabled && <Loader color="grey" loading={true} />}
      </p>
      <p className="error-box">
        {error && (
          <>
            <IconAlertOctagon size="18px" />
            {error}
          </>
        )}
        {pass !== confirm && (
          <>
            <IconAlertOctagon size="18px" />
            <span>Passwords do not match</span>
          </>
        )}
      </p>
    </>
  );
};

export default Signup;
