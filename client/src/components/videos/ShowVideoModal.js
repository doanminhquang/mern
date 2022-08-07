import Modal from "react-bootstrap/Modal";
//-----------------------------------------
import { useContext, useState, useEffect } from "react";
//-----------------------------------------
import { VideoContext } from "../../contexts/VideoContext";

const ShowVideoModal = (props) => {
  // Contexts
  const {
    videoState: { video },
    showVideoModal,
    setShowVideoModal,
  } = useContext(VideoContext);

  // State
  const [showVideo, setshowVideo] = useState(video);

  useEffect(() => setshowVideo(video), [video]);

  const closeDialog = () => {
    setShowVideoModal(false);
  };

  const checkurl = (val) => {
    var tempstr = val;
    return !tempstr.includes(".mp4");
  };

  const renderurl = (val) => {
    return process.env.REACT_APP_DOMAIN + val.substring(1);
  };

  return (
    <Modal show={showVideoModal} onHide={closeDialog} size="xl">
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            width: "100%",
            fontSize: "1.2rem",
          }}
        >
          {showVideo.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <center>
          <div className="fluidMedia" style={{ width: "80%" }}>
            {checkurl(showVideo.video) ? (
              <iframe
                frameborder="0"
                title={showVideo.title}
                src={showVideo.video}
              ></iframe>
            ) : (
              <video
                src={renderurl(showVideo.video)}
                style={{ width: "100%", marginTop: "10px" }}
                controls
              />
            )}
          </div>
        </center>
      </Modal.Body>
    </Modal>
  );
};

export default ShowVideoModal;
