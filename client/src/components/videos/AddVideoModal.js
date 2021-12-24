import { useContext, useState } from "react";
//------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//------------------------------------------
import { PostContext } from "../../contexts/PostContext";
import { VideoContext } from "../../contexts/VideoContext";
import { BiVideoPlus } from "react-icons/bi";
import { isVideo } from "../../utils/CheckExtension";
import { convertBase64 } from "../../utils/convertBase64";

const AddVideoModal = () => {
  // Contexts
  const {
    postState: { post },
  } = useContext(PostContext);

  const { showAddVideoModal, setShowAddVideoModal, addVideo, setShowToastV } =
    useContext(VideoContext);

  // State
  const [newVideo, setNewVideo] = useState({
    title: "",
    video: "",
    postid: post._id,
    base64: "",
  });

  const { title, video, base64 } = newVideo;

  const onChangeNewVideoForm = (event) =>
    setNewVideo({ ...newVideo, [event.target.name]: event.target.value });

  const onChangeNewVideoFormForVideo = (event) => {
    var tempid = youtube_parser(event.target.value);
    setNewVideo({
      ...newVideo,
      video:
        tempid !== false
          ? "https://www.youtube-nocookie.com/embed/" + tempid
          : event.target.value,
    });
  };

  const closeDialog = () => {
    setTimeout(resetAddPostData, 0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await addVideo(newVideo);
    setTimeout(resetAddPostData(), 0);
    setShowToastV({
      showV: true,
      messageV: message,
      typeV: success ? "success" : "danger",
    });
  };

  const resetAddPostData = () => {
    setNewVideo({
      title: "",
      video: "",
      postid: post._id,
      base64: "",
    });
    setShowAddVideoModal(false);
  };

  //get id ytb
  const youtube_parser = (url) => {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isVideo(file)) {
        const base64 = await convertBase64(file);
        setNewVideo({ ...newVideo, video: "base64", base64 });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận video");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  return (
    <Modal show={showAddVideoModal} onHide={closeDialog} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>[Thêm video] {post.title}</Modal.Title>
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
              onChange={onChangeNewVideoForm}
            />
            <Form.Text id="title-help" muted>
              Bắt buộc
            </Form.Text>
          </Form.Group>

          <div style={{ marginTop: "5px" }}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Đường dẫn video"
                name="video"
                required
                aria-describedby="title-help"
                value={video}
                onChange={onChangeNewVideoFormForVideo}
              />
              <Form.Text id="title-help" muted>
                Bắt buộc
              </Form.Text>
            </Form.Group>
          </div>
          <Button
            style={{
              background: "#603ce4",
              border: 0,
              with: "100%",
            }}
            onClick={() => hanlderClickUpload()}
          >
            Vui lòng chọn video <BiVideoPlus />
            <input
              id="upload"
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                uploadFile(e);
              }}
            />
          </Button>
          {video !== "base64" ? (
            <iframe
              src={video}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="video"
              style={{ width: "100%", height: "250px", marginTop: "10px" }}
            />
          ) : (
            <video
              src={base64}
              style={{ width: "100%", height: "250px", marginTop: "10px" }}
              controls
            />
          )}
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

export default AddVideoModal;
