import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { ContactContext } from "../../contexts/ContactContext";
import { optionselectcontact } from "../../utils/optionselectcontact";

const ViewContactModal = () => {
  // Contexts
  const {
    contactState: { contact },
    showContactModal,
    setShowContactModal,
  } = useContext(ContactContext);

  // State
  const [showContact, setshowContact] = useState(contact);

  useEffect(() => setshowContact(contact), [contact]);

  const { name, email, subject, message, status } = showContact;

  const closeDialog = () => {
    setShowContactModal(false);
  };

  return (
    <Modal
      show={showContactModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            width: "100%",
            fontSize: "1.2rem",
          }}
        >
          {subject}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "black", textAlign: "justify" }}>
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
        <Form.Group style={{ marginBottom: 10 }}>
          <Form.Control
            as="textarea"
            style={{
              maxHeight: "50vh",
              minHeight: "45vh",
              width: "100%",
              resize: "none",
              marginBottom: "10px",
            }}
            disabled={true}
            value={message}
          />
          <Form.Control
            as="select"
            value={status}
            disabled={true}
            className="select"
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
        <Button onClick={closeDialog}>Hủy</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewContactModal;
