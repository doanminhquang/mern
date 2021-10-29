import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
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
      <Form className="my-4" onSubmit={register} autoComplete="new-password">
        <AlertMessage info={alert} />
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Nhập họ tên"
            name="name"
            required
            value={name}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Tài khoản"
            name="username"
            required
            value={username}
            onChange={onChangeRegisterForm}
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Email"
            name="email"
            required
            value={email}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            name="password"
            required
            value={password}
            onChange={onChangeRegisterForm}
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Nhập lại mật khẩu"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Đăng kí
        </Button>
      </Form>
      <p>
        Bạn đã có tài khoản?
        <Link to="/login">
          <Button
            size="sm"
            className="ml-2"
            style={{ background: "#f9e467", color: "black", border: "none" }}
          >
            Đăng nhập
          </Button>
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
