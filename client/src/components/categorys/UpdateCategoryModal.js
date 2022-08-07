import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";

const UpdateCategoryModal = () => {
  // Contexts
  const {
    categoryState: { category },
    showUpdateCategoryModal,
    setShowUpdateCategoryModal,
    updateCategory,
    setShowToast,
  } = useContext(CategoryContext);

  // State
  const [updatedCategory, setUpdatedCategory] = useState(category);

  useEffect(() => setUpdatedCategory(category), [category]);

  const { name } = updatedCategory;

  const onChangeUpdatedCategoryForm = (event) =>
    setUpdatedCategory({
      ...updatedCategory,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    setUpdatedCategory(category);
    setShowUpdateCategoryModal(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await updateCategory(updatedCategory);
    setShowUpdateCategoryModal(false);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  return (
    <Modal
      show={showUpdateCategoryModal}
      onHide={closeDialog}
      style={{ height: "fit-content" }}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.15rem" }}>
          Chỉnh sửa thể loại
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.Control
              type="text"
              placeholder="Thể loại"
              name="name"
              required
              aria-describedby="title-help"
              value={name}
              onChange={onChangeUpdatedCategoryForm}
            ></Form.Control>
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

export default UpdateCategoryModal;
