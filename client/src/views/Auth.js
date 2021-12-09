import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Logo from "../assets/logo.svg";

const Auth = ({ authRoute }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  let body;

  if (authLoading)
    body = (
      <div className="d-flex justify-content-center mt-2">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  else if (isAuthenticated) return <Redirect to="/dashboard" />;
  else
    body = (
      <>
        {authRoute === "login" && <LoginForm />}
        {authRoute === "register" && <RegisterForm />}
      </>
    );

  return (
    <div className="landing">
      <div className="landing-inner">
        <div
          style={{
            height: "fit-content",
            width: "fit-content",
            borderRadius: "20px",
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <img src={Logo} width="60px" height="60px" alt="" />
          {body}
        </div>
      </div>
    </div>
  );
};

export default Auth;
