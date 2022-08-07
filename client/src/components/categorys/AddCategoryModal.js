import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";

const AddCategoryModal = () => {
  // Contexts
  const {
    showAddCategoryModal,
    setShowAddCategoryModal,
    addCategory,
    setShowToast,
  } = useContext(CategoryContext);

  // State
  const [newCategory, setNewCategory] = useState({
    name: "",
  });

  const { name } = newCategory;

  const onChangeNewCategoryForm = (event) =>
    setNewCategory({ ...newCategory, [event.target.name]: event.target.value });

  const closeDialog = () => {
    setTimeout(resetAddCategoryData, 0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await addCategory(newCategory);
    setTimeout(resetAddCategoryData(), 0);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  const resetAddCategoryData = () => {
    setNewCategory({
      name: "",
    });
    setShowAddCategoryModal(false);
  };

  return (
    <Modal show={showAddCategoryModal} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thể loại</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Thể loại"
              name="name"
              required
              aria-describedby="title-help"
              value={name}
              onChange={onChangeNewCategoryForm}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
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
  );
};

export default AddCategoryModal;
