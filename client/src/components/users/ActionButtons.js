import { useContext } from "react";
//--------------------------------
import { UserContext } from "../../contexts/UserContext";
//--------------------------------
import Button from "react-bootstrap/Button";
//--------------------------------
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const ActionButtons = ({ _id }) => {
  const { deleteUser, findUser, setShowUpdateUserModal, setShowToast } =
    useContext(UserContext);

  const showUser = (userId) => {
    findUser(userId);
    setShowUpdateUserModal(true);
  };

  const DeleteUser = async (userId) => {
    const { success, message } = await deleteUser(userId);
    setShowToast({
      show: true,
      message: message ? message : "Xóa thành công",
      type: success ? "success" : "danger",
    });
  };

  return (
    <>
      <Button className="post-button" onClick={showUser.bind(this, _id)}>
        <FaEdit color="green" size="24" />
      </Button>
      <Button className="post-button" onClick={DeleteUser.bind(this, _id)}>
        <FaTimes color="red" size="24" />
      </Button>
    </>
  );
};

export default ActionButtons;
