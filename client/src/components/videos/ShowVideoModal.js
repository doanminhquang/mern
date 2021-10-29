import Modal from "react-bootstrap/Modal";
//-----------------------------------------
import { useContext, useState, useEffect } from "react";
//-----------------------------------------
import { VideoContext } from "../../contexts/VideoContext";

const ShowVideoModal = () => {
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
            <iframe
              frameborder="0"
              title={showVideo.title}
              src={showVideo.video}
            ></iframe>
          </div>
        </center>
      </Modal.Body>
    </Modal>
  );
};

export default ShowVideoModal;
