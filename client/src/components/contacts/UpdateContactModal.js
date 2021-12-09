import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { ContactContext } from "../../contexts/ContactContext";
import { optionselectcontact } from "../../utils/optionselectcontact";

const UpdateContactModal = () => {
  // Contexts
  const {
    contactState: { contact },
    showUpdateContactModal,
    setShowUpdateContactModal,
    updateContact,
    setShowToast,
  } = useContext(ContactContext);

  // State
  const [updatedContact, setUpdatedContact] = useState(contact);

  useEffect(() => setUpdatedContact(contact), [contact]);

  const { name, email, subject, message, status } = updatedContact;

  const onChangeUpdatedContactForm = (event) =>
    setUpdatedContact({
      ...updatedContact,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    setUpdatedContact(contact);
    setShowUpdateContactModal(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await updateContact(updatedContact);
    setShowUpdateContactModal(false);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  return (
    <Modal
      show={showUpdateContactModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Sửa Trạng Thái Liên Hệ</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              name="subject"
              value={subject}
              disabled={true}
              className="select"
            >
              <option key={subject} value={subject}>
                {subject}
              </option>
            </Form.Control>
          </Form.Group>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              as="select"
              name="name"
              value={name}
              disabled={true}
              className="select"
            >
              <option key={name} value={name}>
                Người gửi: {name}
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
            >
              <option key={email} value={email}>
                Địa chỉ gửi: {email}
              </option>
            </Form.Control>
          </Form.Group>
          <Form.Control
            as="textarea"
            style={{
              maxHeight: "40vh",
              minHeight: "40vh",
              width: "100%",
              resize: "none",
              marginBottom: "10px",
            }}
            disabled={true}
            value={message}
          />
          <Form.Group style={{ marginBottom: 0 }}>
            <Form.Control
              as="select"
              value={status}
              name="status"
              onChange={onChangeUpdatedContactForm}
            >
              {optionselectcontact.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.showtext}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
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

export default UpdateContactModal;
