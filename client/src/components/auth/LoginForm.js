import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const LoginForm = () => {
  // Context
  const { loginUser } = useContext(AuthContext);

  // Local state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);

  const { username, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const login = async (event) => {
    event.preventDefault();

    try {
      const loginData = await loginUser(loginForm);
      if (!loginData.success) {
        setAlert({ type: "danger", message: loginData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="auth-form-light text-left p-5">
        <form className="pt-3" onSubmit={login}>
          <div className="form-group">
            <input
              style={{
                fontSize: "0.95rem",
              }}
              type="text"
              className="form-control form-control-lg"
              placeholder="Tài Khoản"
              name="username"
              required
              value={username}
              onChange={onChangeLoginForm}
            />
          </div>
          <div className="form-group">
            <input
              style={{
                fontSize: "0.95rem",
              }}
              type="password"
              className="form-control form-control-lg"
              placeholder="Mật Khẩu"
              name="password"
              required
              value={password}
              onChange={onChangeLoginForm}
            />
          </div>
          <div className="mt-3">
            <button
              className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
              type="submit"
              style={{
                fontFamily: "-webkit-body",
                fontWidth: "bold",
                fontWeight: "bold",
                fontSize: "1rem",
                backgroundColor: "#603ce4",
              }}
            >
              Đăng nhập
            </button>
          </div>
          <div
            className="text-center mt-4 font-weight-light"
            style={{ fontFamily: "-webkit-body", fontWidth: "bold" }}
          >
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" style={{ color: "#603ce4" }}>
              Đăng ký tài khoản
            </Link>
          </div>
        </form>
      </div>
      <AlertMessage info={alert} />
    </>
  );
};

export default LoginForm;
