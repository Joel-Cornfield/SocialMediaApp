const Logo = import.meta.env.VITE_ICON;
import "./auth.scss";

const AuthPage = ({ children }) => {
    return (
        <div className="auth-page">
            <div className="form-side">
                {children}
            </div>
            <div className="logo-side">
                <p>Bloom</p>
                <p>Grow. <span>Connect.</span> Thrive.</p>
                {Logo && <img src={Logo} alt="Bloom Logo" />}
            </div>
        </div>
    );
};

export default AuthPage;