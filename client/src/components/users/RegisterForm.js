import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { optionselectaccount } from "../../utils/optionselectaccount";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import Modal from "react-bootstrap/Modal";

const Register = () => {
  // Context

  const { showAddUserModal, setShowAddUserModal, addUser, setShowToast } =
    useContext(UserContext);

  // Local state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    name: "",
    type: "student",
    phone: "",
  });

  const { username, email, password, confirmPassword, name, type, phone } =
    registerForm;

  const onChangeRegisterForm = (event) =>
    setRegisterForm({
      ...registerForm,
      [event.target.name]: event.target.value,
    });

  const register = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setShowToast({
        show: true,
        message: "Mật khẩu không khớp",
        type: "danger",
      });
      return;
    }

    try {
      const registerData = await addUser(registerForm);
      if (!registerData.success) {
        setShowToast({
          show: true,
          message: registerData.message,
          type: "danger",
        });
      } else {
        setShowToast({
          show: true,
          message: registerData.message,
          type: registerData.success ? "success" : "danger",
        });
        closeDialog();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetAddUserData = () => {
    setRegisterForm({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
      name: "",
      type: "student",
      phone: "",
    });
    setShowAddUserModal(false);
  };

  const closeDialog = () => {
    setTimeout(resetAddUserData, 0);
  };

  return (
    <>
      <Modal
        show={showAddUserModal}
        onHide={closeDialog}
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm tài khoản</Modal.Title>
        </Modal.Header>
        <Form className="my-4" onSubmit={register} autoComplete="new-password">
          <Modal.Body>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên"
                name="name"
                required
                value={name}
                onChange={onChangeRegisterForm}
                autoComplete="new-password"
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
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Số điện thoại"
                name="phone"
                required
                value={phone}
                onChange={onChangeRegisterForm}
                autoComplete="new-password"
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
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="select"
                value={type}
                name="type"
                onChange={onChangeRegisterForm}
              >
                {optionselectaccount.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.showtext}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ padding: "5px" }}>
            <Button
              style={{ background: "rgb(96 60 228 / 82%)", border: "none" }}
              onClick={closeDialog}
            >
              Hủy
            </Button>
            <Button
              id="btn_add"
              style={{ background: "#603ce4", border: "none" }}
              type="submit"
            >
              Thêm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Register;
