import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const RegisterForm = () => {
  // Context
  const { registerUser } = useContext(AuthContext);

  // Local state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    name: "",
  });

  const [alert, setAlert] = useState(null);

  const { username, email, password, confirmPassword, name } = registerForm;

  const onChangeRegisterForm = (event) =>
    setRegisterForm({
      ...registerForm,
      [event.target.name]: event.target.value,
    });

  const register = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ type: "danger", message: "Mật khẩu không khớp" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    try {
      const registerData = await registerUser(registerForm);
      if (!registerData.success) {
        setAlert({ type: "danger", message: registerData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="auth-form-light text-left p-5">
        <form className="pt-3" onSubmit={register}>
          <div className="form-group">
            <input
              style={{
                fontSize: "0.95rem",
              }}
              type="text"
              className="form-control form-control-lg"
              placeholder="Tên"
              name="name"
              required
              value={name}
              onChange={onChangeRegisterForm}
            />
          </div>
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
              onChange={onChangeRegisterForm}
            />
          </div>
          <div className="form-group">
            <input
              style={{
                fontSize: "0.95rem",
              }}
              type="text"
              className="form-control form-control-lg"
              placeholder="Địa Chỉ email"
              name="email"
              required
              value={email}
              onChange={onChangeRegisterForm}
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
              onChange={onChangeRegisterForm}
            />
          </div>
          <div className="form-group">
            <input
              style={{
                fontSize: "0.95rem",
              }}
              type="password"
              className="form-control form-control-lg"
              placeholder="Nhập lại Mật Khẩu"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={onChangeRegisterForm}
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
              Đăng ký
            </button>
          </div>
          <div
            className="text-center mt-4 font-weight-light"
            style={{ fontFamily: "-webkit-body", fontWidth: "bold" }}
          >
            Bạn đã có tài khoản?{" "}
            <Link to="/login" style={{ color: "#603ce4" }}>
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
      <AlertMessage info={alert} />
    </>
  );
};

export default RegisterForm;
