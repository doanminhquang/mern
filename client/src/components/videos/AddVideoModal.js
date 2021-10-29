import { useContext, useState } from "react";
//------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//------------------------------------------
import { PostContext } from "../../contexts/PostContext";
import { VideoContext } from "../../contexts/VideoContext";

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
  });

  const { title, video } = newVideo;

  const onChangeNewVideoForm = (event) =>
    setNewVideo({ ...newVideo, [event.target.name]: event.target.value });

  const onChangeNewVideoFormForVideo = (event) =>
    setNewVideo({
      ...newVideo,
      video:
        "https://www.youtube-nocookie.com/embed/" +
        youtube_parser(event.target.value),
    });

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
          <iframe
            src={video}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
            style={{ width: "100%", height: "250px", marginTop: "10px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
          <Button
            id="btn_add"
            style={{ background: "#1261A0", border: "none" }}
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
