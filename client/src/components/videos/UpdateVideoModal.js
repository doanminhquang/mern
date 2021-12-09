import { useContext, useState, useEffect } from "react";
//---------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//---------------------------------------------
import { VideoContext } from "../../contexts/VideoContext";

const UpdateVideoModal = () => {
  // Contexts
  const {
    videoState: { video },
    showUpdateVideoModal,
    setShowUpdateVideoModal,
    updateVideo,
    setShowToastV,
  } = useContext(VideoContext);

  // State
  const [updatedVideo, setUpdatedVideo] = useState(video);

  useEffect(() => setUpdatedVideo(video), [video]);

  //get id ytb
  const youtube_parser = (url) => {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : url;
  };

  const onChangeUpdatedVideoForm = (event) =>
    setUpdatedVideo({
      ...updatedVideo,
      [event.target.name]: event.target.value,
    });

  const onChangeUpdatedVideoFormForVideo = (event) =>
    setUpdatedVideo({
      ...updatedVideo,
      video:
        "https://www.youtube-nocookie.com/embed/" +
        youtube_parser(event.target.value),
    });

  const closeDialog = () => {
    setUpdatedVideo(video);
    setShowUpdateVideoModal(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await updateVideo(updatedVideo);
    setShowUpdateVideoModal(false);
    setShowToastV({
      showV: true,
      messageV: message,
      typeV: success ? "success" : "danger",
    });
  };

  return (
    <Modal
      show={showUpdateVideoModal}
      onHide={closeDialog}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Sửa video bài học</Modal.Title>
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
              value={updatedVideo.title}
              onChange={onChangeUpdatedVideoForm}
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
                value={updatedVideo.video}
                onChange={onChangeUpdatedVideoFormForVideo}
              />
              <Form.Text id="title-help" muted>
                Bắt buộc
              </Form.Text>
            </Form.Group>
          </div>
          <iframe
            src={updatedVideo.video}
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
            style={{ background: "#1261A0", border: "none" }}
            type="submit"
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateVideoModal;
