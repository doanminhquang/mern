import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { PostContext } from "../../contexts/PostContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { editorConfiguration } from "../../utils/configCkeditor";
import { optionselect } from "../../utils/optionselect";
import { convertBase64 } from "../../utils/convertBase64";
import { BiImageAdd } from "react-icons/bi";
import { isImage } from "../../utils/CheckExtension";

const AddPostModal = () => {
  // Contexts
  const { showAddPostModal, setShowAddPostModal, addPost, setShowToast } =
    useContext(PostContext);

  // State
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    coursetype: "Other",
    thumbnail: "",
  });

  const { title, description, coursetype, thumbnail } = newPost;

  const onChangeNewPostForm = (event) =>
    setNewPost({ ...newPost, [event.target.name]: event.target.value });

  const closeDialog = () => {
    setTimeout(resetAddPostData, 0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await addPost(newPost);
    setTimeout(resetAddPostData(), 0);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  const resetAddPostData = () => {
    setNewPost({
      title: "",
      description: "",
      coursetype: "Other",
      thumbnail: "",
    });
    setShowAddPostModal(false);
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isImage(file)) {
        const base64 = await convertBase64(file);
        setNewPost({ ...newPost, thumbnail: base64 });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận ảnh");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  return (
    <Modal
      show={showAddPostModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm khóa học</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tiêu đề"
              name="title"
              required
              aria-describedby="title-help"
              value={title}
              onChange={onChangeNewPostForm}
            />
            <Form.Text id="title-help" muted>
              Bắt buộc
            </Form.Text>
          </Form.Group>
          <div style={{ marginBottom: "1rem" }}>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNewPost({ ...newPost, description: data });
              }}
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "37vh",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
            />
          </div>
          <Form.Group style={{ marginBottom: 0 }}>
            <Form.Control
              as="select"
              value={coursetype}
              name="coursetype"
              onChange={onChangeNewPostForm}
            >
              {optionselect.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.showtext}
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
              onClick={() => hanlderClickUpload()}
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

export default AddPostModal;
