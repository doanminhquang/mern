import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotForm from "../components/auth/ForgotForm";
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
  else if (isAuthenticated) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.NEXT;
    if (value === null) {
      return <Redirect to="/dashboard" />;
    } else {
      return <Redirect to={value} />;
    }
  } else
    body = (
      <>
        {authRoute === "login" && <LoginForm />}
        {authRoute === "register" && <RegisterForm />}
        {authRoute === "forgot" && <ForgotForm />}
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
