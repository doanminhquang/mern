import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { PostContext } from "../../contexts/PostContext";
import { CategoryContext } from "../../contexts/CategoryContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { editorConfiguration } from "../../utils/configCkeditor";
import { BiImageAdd } from "react-icons/bi";
import { convertBase64 } from "../../utils/convertBase64";
import { isImage } from "../../utils/CheckExtension";

const UpdatePostModal = () => {
  // Contexts
  const {
    postState: { post },
    showUpdatePostModal,
    setShowUpdatePostModal,
    updatePost,
    setShowToast,
  } = useContext(PostContext);

  const {
    categoryState: { categorys },
  } = useContext(CategoryContext);

  // State
  const [updatedPost, setUpdatedPost] = useState(post);

  useEffect(() => setUpdatedPost(post), [post]);

  const { title, description, coursetype, thumbnail, price } = updatedPost;

  const onChangeUpdatedPostForm = (event) =>
    setUpdatedPost({ ...updatedPost, [event.target.name]: event.target.value });

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isImage(file)) {
        const base64 = await convertBase64(file);
        setUpdatedPost({ ...updatedPost, thumbnail: base64 });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận ảnh");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  const closeDialog = () => {
    setUpdatedPost(post);
    setShowUpdatePostModal(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await updatePost(updatedPost);
    setShowUpdatePostModal(false);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  return (
    <Modal
      show={showUpdatePostModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Sửa khóa học</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Title"
              name="title"
              required
              aria-describedby="title-help"
              value={title}
              onChange={onChangeUpdatedPostForm}
            />
            <Form.Text id="title-help" muted>
              Bắt buộc
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="number"
              placeholder="Giá tiền"
              name="price"
              required
              value={price}
              onChange={onChangeUpdatedPostForm}
            />
          </Form.Group>
          <div style={{ marginBottom: "1rem" }}>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={description}
              onReady={(editor) => {
                editor.setData(description);
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "37vh",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setUpdatedPost({ ...updatedPost, description: data });
              }}
            />
          </div>
          <Form.Group style={{ marginBottom: 0 }}>
            <Form.Control
              as="select"
              value={coursetype}
              name="coursetype"
              onChange={onChangeUpdatedPostForm}
            >
              <option value={null}>Trống</option>
              {categorys.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div style={{ marginTop: "5px" }}>
            <Button
              style={{
                background: "#603ce4",
                border: 0,
                with: "100%",
              }}
              onClick={hanlderClickUpload}
              title="Nhập tệp csv hoặc excel"
            >
              Vui lòng chọn ảnh <BiImageAdd />
              <input
                id="upload"
                name="thumbnail"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  uploadFile(e);
                }}
              />
            </Button>
          </div>
          <img
            src={thumbnail}
            alt=""
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
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

export default UpdatePostModal;
