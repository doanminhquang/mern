import { useContext } from "react";
//--------------------------------
import { UserContext } from "../../contexts/UserContext";
import { CategoryContext } from "../../contexts/CategoryContext";
//--------------------------------
import Button from "react-bootstrap/Button";
//--------------------------------
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const ActionButtons = ({ _id }) => {
  const {
    deleteCategory,
    findCategory,
    setShowUpdateCategoryModal,
    setShowToast,
  } = useContext(CategoryContext);

  const showCategory = (categoryId) => {
    findCategory(categoryId);
    setShowUpdateCategoryModal(true);
  };

  const DeleteCategory = async (categoryId) => {
    const { success, message } = await deleteCategory(categoryId);
    setShowToast({
      show: true,
      message: message ? message : "Xóa thành công",
      type: success ? "success" : "danger",
    });
  };

  return (
    <>
      <Button className="post-button" onClick={showCategory.bind(this, _id)}>
        <FaEdit color="green" size="24" />
      </Button>
      <Button className="post-button" onClick={DeleteCategory.bind(this, _id)}>
        <FaTimes color="red" size="24" />
      </Button>
    </>
  );
};

export default ActionButtons;
