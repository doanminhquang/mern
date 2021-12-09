import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { optionselectaccount } from "../../utils/optionselectaccount";
import { FaClipboard } from "react-icons/fa";

const UpdateUserModal = () => {
  // Contexts
  const {
    userState: { user },
    showUpdateUserModal,
    setShowUpdateUserModal,
    updateUser,
    setShowToast,
  } = useContext(UserContext);

  // State
  const [updatedUser, setUpdatedUser] = useState(user);
  const [GenPass, setGenPass] = useState(false);

  useEffect(() => setUpdatedUser(user), [user]);

  const { username, email, type, name, password } = updatedUser;

  // Gen pass

  var Password = {
    _pattern: /[a-zA-Z0-9_\-\+\.]/,

    _getRandomByte: function () {
      var result = "";
      if (window.crypto && window.crypto.getRandomValues) {
        result = new Uint8Array(1);
        window.crypto.getRandomValues(result);
        return result[0];
      } else if (window.msCrypto && window.msCrypto.getRandomValues) {
        result = new Uint8Array(1);
        window.msCrypto.getRandomValues(result);
        return result[0];
      } else {
        return Math.floor(Math.random() * 256);
      }
    },

    generate: function (length) {
      return Array.apply(null, { length: length })
        .map(function () {
          var result;
          while (true) {
            result = String.fromCharCode(this._getRandomByte());
            if (this._pattern.test(result)) {
              return result;
            }
          }
        }, this)
        .join("");
    },
  };

  //

  let newpass = Password.generate(16);

  const GenNewPass = () => {
    setGenPass(true);
    setUpdatedUser({
      ...updatedUser,
      flag: "newpass",
      password: newpass,
    });
  };

  const copyToClip = () => {
    navigator.clipboard.writeText(password);
    let message = "Đã copy mật khẩu mới: " + password;
    setShowToast({ show: true, message, type: "success" });
  };

  const onChangeUpdatedUserForm = (event) =>
    setUpdatedUser({
      ...updatedUser,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    setUpdatedUser(user);
    setShowUpdateUserModal(false);
    setGenPass(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await updateUser(updatedUser);
    setShowUpdateUserModal(false);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  return (
    <Modal
      show={showUpdateUserModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
      style={{ height: "fit-content" }}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.15rem" }}>
          Cấp lại mật khẩu | điều chỉnh quyền tài khoản
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              name="name"
              value={name}
              disabled={true}
              className="select"
              onChange={onChangeUpdatedUserForm}
            >
              <option key={name} value={name}>
                Tên người dùng: {name}
              </option>
            </Form.Control>
          </Form.Group>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              name="username"
              value={username}
              disabled={true}
              className="select"
              onChange={onChangeUpdatedUserForm}
            >
              <option key={username} value={username}>
                Tên tài khoản: {username}
              </option>
            </Form.Control>
          </Form.Group>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              name="email"
              value={email}
              disabled={true}
              className="select"
              onChange={onChangeUpdatedUserForm}
            >
              <option key={email} value={email}>
                Địa chỉ mail: {email}
              </option>
            </Form.Control>
          </Form.Group>
          {GenPass ? (
            <Form.Group style={{ marginBottom: 10 }}>
              <Form.Control
                as="select"
                id="genpass"
                name="password"
                value={password}
                disabled={true}
                className="select"
                onChange={onChangeUpdatedUserForm}
              >
                <option key={password} value={password}>
                  Mật khẩu được tạo: {password}
                </option>
              </Form.Control>
            </Form.Group>
          ) : (
            ""
          )}
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              value={type}
              name="type"
              onChange={onChangeUpdatedUserForm}
            >
              {optionselectaccount.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.showtext}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            style={{ background: "#603ce4", border: "none" }}
            onClick={GenNewPass}
          >
            Cấp mới mật khẩu
          </Button>
          {GenPass ? (
            <Button
              style={{
                background: "#603ce4",
                border: "none",
                float: "right",
                marginRight: "4px",
              }}
              onClick={copyToClip}
            >
              <FaClipboard />
            </Button>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
          <Button
            style={{ background: "#603ce4", border: "none" }}
            type="submit"
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
