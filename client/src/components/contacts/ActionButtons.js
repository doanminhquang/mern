import Button from "react-bootstrap/Button";
import { ContactContext } from "../../contexts/ContactContext";
import { useContext } from "react";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const ActionButtons = ({ _id }) => {
  const {
    deleteContact,
    findContact,
    setShowUpdateContactModal,
    setShowContactModal,
    setShowToast,
  } = useContext(ContactContext);

  const chooseContact = (contactId) => {
    findContact(contactId);
    setShowContactModal(true);
  };

  const showContact = (contactId) => {
    findContact(contactId);
    setShowUpdateContactModal(true);
  };

  const DeleteContact = async (contactId) => {
    const { success, message } = await deleteContact(contactId);
    setShowToast({
      show: true,
      message: message ? message : "Xóa thành công",
      type: success ? "success" : "danger",
    });
  };

  return (
    <>
      <Button className="post-button" onClick={chooseContact.bind(this, _id)}>
        <FaEye color="black" size="24" />
      </Button>
      <Button className="post-button" onClick={showContact.bind(this, _id)}>
        <FaEdit color="green" size="24" />
      </Button>
      <Button className="post-button" onClick={DeleteContact.bind(this, _id)}>
        <FaTimes color="red" size="24" />
      </Button>
    </>
  );
};

export default ActionButtons;
