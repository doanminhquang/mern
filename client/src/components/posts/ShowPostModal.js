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
import { CommentContext } from "../../contexts/CommentContext";
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
import { Tab, Tabs } from "react-bootstrap";
import { formatDate } from "../../utils/FormatDate";

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

  const {
    commentState: { comments },
    showToastC: { showC, messageC, typeC },
    setShowToastC,
    deleteComment,
  } = useContext(CommentContext);

  // State
  const [showPost, setshowPost] = useState(post);
  const [textSreach, setTextSreach] = useState(null);
  const [textSreachS, setTextSreachS] = useState(null);
  const [textSreachC, setTextSreachC] = useState(null);
  const [key, setKey] = useState("Description");

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
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              paddingRight: 10,
            }}
            onClick={showVideo.bind(this, item._id)}
          >
            <FaEye size="24" color="black" />
          </Button>
          <Button
            title={"Sửa " + item.title}
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              paddingRight: 10,
            }}
            onClick={choosePost.bind(this, item._id)}
          >
            <FaEdit color="green" size="24" />
          </Button>
          <Button
            title={"Xóa video " + item.title}
            style={{ background: "transparent", border: 0, padding: 0 }}
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

  const percent = (value) => {
    return value !== 0 ? Math.round((value / countvideo) * 100) : 0;
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
          {formatDate(item.createdAt)} : {item.user.name} -{" "}
          {percent(item.index)}%
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
            style={{ background: "transparent", border: 0, padding: 0 }}
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

  const DeleteComment = async (commentId) => {
    const { success, message } = await deleteComment(commentId);
    setShowToastC({
      showC: true,
      messageC: message ? message : "Xóa thành công",
      typeC: success ? "success" : "danger",
    });
  };

  const renderC = (item, i) => {
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
          {item.user.name} : {item.cmt} : ({item.rating})
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
            title={"Xóa bình luận " + item.cmt}
            style={{ background: "transparent", border: 0, padding: 0 }}
            onClick={DeleteComment.bind(this, item._id)}
          >
            <FaTimes color="red" size="24" />
          </Button>
        </div>
      </li>
    );
  };

  let countC = 0;
  let countcomment = 0;

  const incCountC = () => {
    countC++;
  };

  const incCountComment = () => {
    countcomment++;
  };

  let jsxcomment = comments
    ? comments.map((item, i) => {
        if (item.post === post._id) {
          incCountComment();
          return !textSreachC
            ? renderC(item, i)
            : item.user.name.toLowerCase().search(textSreachC.toLowerCase()) !==
                -1 ||
              item.cmt.toLowerCase().search(textSreachC.toLowerCase()) !== -1
            ? renderC(item, i)
            : incCountC();
        }
      })
    : "";

  if (countC === countcomment && countcomment !== 0) {
    var strS =
      "Không bình luận, hoặc người bình luận phù hợp '<b>" +
      textSreachC +
      "</b>' mà bạn tìm kiếm";
    jsxcomment = <Markup content={strS} />;
  }

  const onChangeSreachC = (event) => setTextSreachC(event.target.value);

  const jsxtab1 = (
    <>
      <center>
        <img
          src={thumbnail}
          alt="thumbnail"
          style={{ maxWidth: "100%", marginBottom: "10px" }}
        />
      </center>
      <Markup content={description} />
    </>
  );

  const jsxtab2 = (
    <>
      <div
        style={{
          paddingRight: "10px",
          height: "44px",
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
          minHeight: "200px",
          maxHeight: "200px",
          overflow: "scroll",
          marginTop: "10px",
        }}
      >
        <ul style={{ listStyle: "decimal-leading-zero" }}>{jsxvideo}</ul>
      </div>
    </>
  );

  const jsxtab3 = (
    <>
      <div
        style={{
          height: "44px",
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
      {countstudent !== 0 ? (
        <>
          <div
            style={{
              height: "fit-content",
              display: "block",
              position: "relative",
              minHeight: "200px",
              maxHeight: "200px",
              overflow: "scroll",
              marginTop: "10px",
            }}
          >
            <ul style={{ listStyle: "decimal-leading-zero" }}>{jsxstudent}</ul>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );

  const jsxtab4 = (
    <>
      <div
        style={{
          height: "44px",
          marginTop: "10px",
          paddingRight: "10px",
        }}
      >
        {countcomment !== 0 ? (
          <>
            <b>Danh bình luận ({countcomment} bình luận):</b>
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
                placeholder="Nhập bình luận hoặc tên người bình luận.."
                name="c"
                value={textSreachC}
                onChange={onChangeSreachC}
              />
            </Form.Group>
          </>
        ) : (
          ""
        )}
      </div>
      {countcomment !== 0 ? (
        <>
          <div
            style={{
              height: "fit-content",
              display: "block",
              position: "relative",
              minHeight: "200px",
              maxHeight: "200px",
              overflow: "scroll",
              marginTop: "10px",
            }}
          >
            <ul style={{ listStyle: "decimal-leading-zero" }}>{jsxcomment}</ul>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );

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
              <p style={{ color: "#603ce4", display: "inline" }}>
                {post.user.name}
              </p>
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black", textAlign: "justify" }}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="Description" title="Mô tả bài viết">
              {jsxtab1}
            </Tab>
            <Tab eventKey="Video" title="Bài học">
              {jsxtab2}
            </Tab>
            {countstudent === 0 ? (
              <Tab eventKey="Student" title="Học viên đăng ký" disabled></Tab>
            ) : (
              <Tab eventKey="Student" title="Học viên đăng ký">
                {jsxtab3}
              </Tab>
            )}
            {countcomment === 0 ? (
              <Tab eventKey="Cmt" title="Bình Luận" disabled></Tab>
            ) : (
              <Tab eventKey="Cmt" title="Bình Luận">
                {jsxtab4}
              </Tab>
            )}
          </Tabs>
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
        show={showV ? showV : showS ? showS : showC}
        style={{
          position: "fixed",
          top: "20%",
          right: "10px",
          zIndex: "9999999999999999999",
        }}
        className={`bg-${showV ? typeV : showS ? typeS : typeC} text-white`}
        onClose={
          showV
            ? setShowToastV.bind(this, {
                showV: false,
                messageV: "",
                typeV: null,
              })
            : showS
            ? setShowToastS.bind(this, {
                showS: false,
                messageS: "",
                typeS: null,
              })
            : setShowToastC.bind(this, {
                showC: false,
                messageC: "",
                typeC: null,
              })
        }
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{showV ? messageV : showS ? messageS : messageC}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default ViewPostModal;
