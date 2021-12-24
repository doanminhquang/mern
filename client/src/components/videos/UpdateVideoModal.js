import { useContext, useState, useEffect } from "react";
//---------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//---------------------------------------------
import { VideoContext } from "../../contexts/VideoContext";
import { BiVideoPlus } from "react-icons/bi";
import { isVideo } from "../../utils/CheckExtension";
import { convertBase64 } from "../../utils/convertBase64";

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
    return match && match[7].length === 11 ? match[7] : false;
  };

  const onChangeUpdatedVideoForm = (event) =>
    setUpdatedVideo({
      ...updatedVideo,
      [event.target.name]: event.target.value,
    });

  const onChangeUpdatedVideoFormForVideo = (event) => {
    var tempid = youtube_parser(event.target.value);
    setUpdatedVideo({
      ...updatedVideo,
      video:
        tempid !== false
          ? "https://www.youtube-nocookie.com/embed/" + tempid
          : event.target.value,
    });
  };

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

  const checkurl = (val) => {
    var tempstr = val;
    return !tempstr.includes(".mp4");
  };

  const renderurl = (val) => {
    return process.env.REACT_APP_DOMAIN + val.substring(1);
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isVideo(file)) {
        const base64 = await convertBase64(file);
        setUpdatedVideo({
          ...updatedVideo,
          video: "base64",
          base64,
        });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận video");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
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
          {checkurl(updatedVideo.video) ? (
            updatedVideo.video !== "base64" ? (
              <iframe
                src={updatedVideo.video}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="video"
                style={{ width: "100%", height: "250px", marginTop: "10px" }}
              />
            ) : (
              <video
                src={updatedVideo.base64}
                style={{ width: "100%", height: "250px", marginTop: "10px" }}
                controls
              />
            )
          ) : (
            <video
              src={renderurl(updatedVideo.video)}
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

export default UpdateVideoModal;
