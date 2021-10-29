import { useContext, useState, useEffect } from "react";
//---------------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
//---------------------------------------------------
import { PostContext } from "../../contexts/PostContext";
import { VideoContext } from "../../contexts/VideoContext";
import { StudentContext } from "../../contexts/StudentContext";
//---------------------------------------------------
import { FaPhotoVideo } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
//---------------------------------------------------
import AddVideoModal from "../videos/AddVideoModal";
import UpdateVideoModal from "../videos/UpdateVideoModal";
import ShowVideoModal from "../videos/ShowVideoModal";
//---------------------------------------------------
import { Markup } from "interweave";
import { optionselect } from "../../utils/optionselect";
//---------------------------------------------------

const ViewPostModal = () => {
  // Contexts
  const {
    postState: { post },
    showPostModal,
    setShowPostModal,
    findPost,
  } = useContext(PostContext);

  const {
    videoState: { video, allvideo },
    showToastV: { showV, messageV, typeV },
    setShowToastV,
    showVideoModal,
    setShowVideoModal,
    showAddVideoModal,
    setShowAddVideoModal,
    showUpdateVideoModal,
    setShowUpdateVideoModal,
    findVideoInAll,
    deleteVideo,
  } = useContext(VideoContext);

  const {
    studentState: { students },
    showToastS: { showS, messageS, typeS },
    setShowToastS,
    deleteStudent,
  } = useContext(StudentContext);

  // State
  const [showPost, setshowPost] = useState(post);
  const [textSreach, setTextSreach] = useState(null);
  const [textSreachS, setTextSreachS] = useState(null);

  useEffect(() => setshowPost(post), [post]);

  const { title, description, coursetype, thumbnail } = showPost;

  const closeDialog = () => {
    setShowPostModal(false);
  };

  // video

  const showVideo = (videoId) => {
    findVideoInAll(videoId);
    setShowVideoModal(videoId);
  };

  const showAddVideo = (postId) => {
    findPost(postId);
    setShowAddVideoModal(true);
  };

  const choosePost = (videoId) => {
    findVideoInAll(videoId);
    setShowUpdateVideoModal(true);
  };

  const DeleteVideo = async (videoId) => {
    const { success, message } = await deleteVideo(videoId);
    setShowToastV({
      showV: true,
      messageV: message ? message : "Xóa thành công",
      typeV: success ? "success" : "danger",
    });
  };

  const render = (item, i) => {
    return (
      <li
        key={i}
        style={{
          height: "39px",
        }}
      >
        <div
          style={{
            width: "fit-content",
            display: "inline",
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            width: "fit-content",
            display: "inline",
            float: "right",
            marginRight: "10px",
          }}
        >
          <Button
            title={"Xem " + item.title}
            style={{ background: "transparent", border: 0 }}
            onClick={showVideo.bind(this, item._id)}
          >
            <FaEye size="24" color="black" />
          </Button>
          <Button
            title={"Sửa " + item.title}
            style={{ background: "transparent", border: 0 }}
            onClick={choosePost.bind(this, item._id)}
          >
            <FaEdit color="green" size="24" />
          </Button>
          <Button
            title={"Xóa video " + item.title}
            style={{ background: "transparent", border: 0 }}
            onClick={DeleteVideo.bind(this, item._id)}
          >
            <FaTimes color="red" size="24" />
          </Button>
        </div>
      </li>
    );
  };

  let count = 0;
  let countvideo = 0;

  const incCount = () => {
    count++;
  };

  const incCountVideo = () => {
    countvideo++;
  };

  let jsxvideo = allvideo
    ? allvideo.map((item, i) => {
        if (item.post === post._id) {
          incCountVideo();
          return !textSreach
            ? render(item, i)
            : item.title.toLowerCase().search(textSreach.toLowerCase()) !== -1
            ? render(item, i)
            : incCount();
        }
      })
    : "";

  if (count === countvideo && countvideo !== 0) {
    var str = "Không có bài học '<b>" + textSreach + "</b>' mà bạn tìm kiếm";
    jsxvideo = <Markup content={str} />;
  }

  const onChangeSreach = (event) => setTextSreach(event.target.value);

  ////////////////////////////////////

  const DeleteStudent = async (studentId) => {
    const { success, message } = await deleteStudent(studentId);
    setShowToastS({
      showS: true,
      messageS: message ? message : "Xóa thành công",
      typeS: success ? "success" : "danger",
    });
  };

  const renderS = (item, i) => {
    return (
      <li
        key={i}
        style={{
          height: "39px",
        }}
      >
        <div
          style={{
            width: "fit-content",
            display: "inline",
          }}
        >
          {item.user.name}
        </div>
        <div
          style={{
            width: "fit-content",
            display: "inline",
            float: "right",
            marginRight: "10px",
          }}
        >
          <Button
            title={"Xóa học viên " + item.user.name}
            style={{ background: "transparent", border: 0 }}
            onClick={DeleteStudent.bind(this, item._id)}
          >
            <FaTimes color="red" size="24" />
          </Button>
        </div>
      </li>
    );
  };

  let countS = 0;
  let countstudent = 0;

  const incCountS = () => {
    countS++;
  };

  const incCountStudent = () => {
    countstudent++;
  };

  let jsxstudent = students
    ? students.map((item, i) => {
        if (item.post === post._id) {
          incCountStudent();
          return !textSreachS
            ? renderS(item, i)
            : item.user.name.toLowerCase().search(textSreachS.toLowerCase()) !==
              -1
            ? renderS(item, i)
            : incCountS();
        }
      })
    : "";

  if (countS === countstudent && countstudent !== 0) {
    var strS = "Không học viên '<b>" + textSreachS + "</b>' mà bạn tìm kiếm";
    jsxstudent = <Markup content={strS} />;
  }

  const onChangeSreachS = (event) => setTextSreachS(event.target.value);

  ////////////////////////////////////

  return (
    <>
      <Modal show={showPostModal} onHide={closeDialog} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              width: "100%",
            }}
          >
            {title}
            <br />
            <small style={{ float: "right", right: 0 }}>
              Đăng tải bởi{" "}
              <p style={{ color: "#1261A0", display: "inline" }}>
                {post.user.name}
              </p>
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black", textAlign: "justify" }}>
          <div style={{ height: "89%", overflow: "scroll" }}>
            <center>
              <img
                src={thumbnail}
                alt=""
                style={{ maxWidth: "100%", marginBottom: "10px" }}
              />
            </center>
            <Markup content={description} />
            <div
              style={{
                paddingRight: "10px",
              }}
            >
              <Button
                title="Thêm video bài học"
                className="post-button"
                onClick={showAddVideo.bind(this, post._id)}
                style={{ marginLeft: "10px" }}
              >
                <FaPhotoVideo color="green" size="24" />
              </Button>
              <b>Danh sách bài học ({countvideo} bài):</b>
              <Form.Group
                style={{
                  width: "30%",
                  display: "inline",
                  float: "right",
                  margin: 0,
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Nhập tên bài học..."
                  name="s"
                  value={textSreach}
                  onChange={onChangeSreach}
                />
              </Form.Group>
            </div>
            <div
              style={{
                height: "fit-content",
                display: "block",
                position: "relative",
                maxHeight: "200px",
                overflow: "scroll",
                marginTop: "10px",
              }}
            >
              <ul style={{ listStyle: "decimal-leading-zero" }}>{jsxvideo}</ul>
            </div>
            <div
              style={{
                height: "40px",
                marginTop: "10px",
                paddingRight: "10px",
              }}
            >
              {countstudent !== 0 ? (
                <>
                  <b>Danh học viên ({countstudent} người):</b>
                  <Form.Group
                    style={{
                      width: "30%",
                      display: "inline",
                      float: "right",
                      margin: 0,
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên học viên..."
                      name="s"
                      value={textSreachS}
                      onChange={onChangeSreachS}
                    />
                  </Form.Group>
                </>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                height: "fit-content",
                display: "block",
                position: "relative",
                maxHeight: "200px",
                overflow: "scroll",
                marginTop: "10px",
              }}
            >
              <ul style={{ listStyle: "decimal-leading-zero" }}>
                {jsxstudent}
              </ul>
            </div>
          </div>
          <Form.Group>
            <Form.Control
              as="select"
              value={coursetype}
              disabled={true}
              className="select"
            >
              {optionselect.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.showtext}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
      {showAddVideoModal && <AddVideoModal />}
      {video !== null && showUpdateVideoModal && <UpdateVideoModal />}
      {video !== null && showVideoModal && <ShowVideoModal />}
      {/* After video is added, show toast */}
      <Toast
        show={showV ? showV : showS}
        style={{
          position: "fixed",
          top: "20%",
          right: "10px",
          zIndex: "9999999999999999999",
        }}
        className={`bg-${showV ? typeV : typeS} text-white`}
        onClose={
          showV
            ? setShowToastV.bind(this, {
                showV: false,
                messageV: "",
                typeV: null,
              })
            : setShowToastS.bind(this, {
                showS: false,
                messageS: "",
                typeS: null,
              })
        }
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{showV ? messageV : messageS}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default ViewPostModal;
