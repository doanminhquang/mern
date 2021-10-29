import React, { useEffect, useState, useContext } from "react";
import { PostContext } from "../contexts/PostContext";
import { ContactContext } from "../contexts/ContactContext";
import { VideoContext } from "../contexts/VideoContext";
import { StudentContext } from "../contexts/StudentContext";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Preload from "../components/layout/PreLoad";
import Banner from "../assets/banner.jpg";
import author from "../assets/home/author.png";
import { Markup } from "interweave";
import { formatDate } from "../utils/FormatDate";
import { getTextDisplay } from "../utils/GettextDisplay";
import { IoLanguageOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Button } from "react-bootstrap";
import ItemCourse from "../components/posts/ItemCourse";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import { FaEye } from "react-icons/fa";
import ShowVideoModal from "../components/videos/ShowVideoModal";
import { FaArrowRight } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
//---- add modal
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
//--------------
import { apiUrl } from "../contexts/constants";
import axios from "axios";

const Coursedetail = (props) => {
  // State
  const [data, setData] = useState(null);
  let thistitle = "";
  const [textSreach, setTextSreach] = useState(null);
  const [reg, setreg] = useState(true);

  // State modal
  const [newContact, setNewContact] = useState({
    namecontact: "",
    email: "",
    subject: "",
    messagecontact: "",
    status: "Wait",
  });

  // context
  const {
    authState: { user, isAuthenticated },
  } = useContext(AuthContext);

  const {
    postState: { post, more, postsLoading },
    getPost,
  } = useContext(PostContext);

  const {
    showAddContactModal,
    setShowAddContactModal,
    showToast: { show, message, type },
    addContact,
    setShowToast,
  } = useContext(ContactContext);

  const {
    videoState: { video, videos, videosLoading },
    getVideos,
    showVideoModal,
    findVideo,
    setShowVideoModal,
  } = useContext(VideoContext);

  const {
    showToastS: { showS, messageS, typeS },
    setShowToastS,
  } = useContext(StudentContext);

  var url = window.location.href;
  var id = url.substring(url.lastIndexOf("?id=") + 4);

  useEffect(() => {
    if (props.location.state) {
      setData(props.location.state);
    } else {
      getPost(id);
    }
  });

  const { namecontact, email, subject, messagecontact } = newContact;

  // Start: Get all video by id
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getVideos(id);
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, [url]);

  const check = async () => {
    if (!isAuthenticated) {
      setreg(true);
    } else {
      try {
        const response = await axios.get(`${apiUrl}/students/check/${id}`);
        if (response.data.success && response.data.students.length !== 0) {
          setreg(false);
        } else {
          setreg(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Start: check reg
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        if (videos.length !== 0) check();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, [url, videos]);

  useEffect(() => {
    setNewContact({
      ...newContact,
      subject: "[Đăng ký khóa học] " + thistitle + " - " + id,
      messagecontact: "[Đăng ký khóa học] " + thistitle + " - " + id,
      namecontact: isAuthenticated ? user.name : "",
      email: isAuthenticated ? user.email : "",
    });
  }, [isAuthenticated]);

  const checkavatar = (str) => {
    str = str ? str : author;
    return str;
  };

  const renderItem = (post, posts) => {
    return (
      <>
        <ItemCourse key={post._id} post={post} user={post.user} Posts={posts} />
        {incCount()}
      </>
    );
  };

  let count = 0;

  const incCount = () => {
    count++;
  };

  //
  const regp = async (newStudent) => {
    try {
      const response = await axios.post(`${apiUrl}/students/`, newStudent);
      if (response.data.success) {
        setreg(false);
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  const regpost = async (event) => {
    event.preventDefault();
    const { success, message } = await regp({
      postid: id,
    });
    setShowToastS({
      showS: true,
      messageS: message,
      typeS: success ? "success" : "danger",
    });
  };

  //

  const unregi = async (studentId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/students/unreg/${studentId}`
      );
      if (response.data.success) {
        setreg(true);
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unregpost = async (event) => {
    event.preventDefault();
    const { success, message } = await unregi(user._id);
    setShowToastS({
      showS: true,
      messageS: message,
      typeS: success ? "success" : "danger",
    });
  };

  const renderMain = (post) => {
    thistitle = post.title;
    return (
      <div className="row" key={post._id}>
        <div className="col-lg-9">
          <div className="single-course-area">
            <div className="course-top">
              <h4>{post.title}</h4>
              <div className="course-meta">
                <div className="author">
                  <img
                    style={{ top: "5px" }}
                    src={checkavatar(post.user.avatar)}
                    alt=""
                  />
                  <span>Người đăng tải</span>
                  <p>{post.user.name}</p>
                </div>
                <div className="categories">
                  <span>Chủ để:</span>
                  <p>{getTextDisplay(post.coursetype)}</p>
                </div>
                <div
                  className="categories"
                  style={{ border: 0, margin: 0, padding: 0 }}
                >
                  <span>Ngày đăng:</span>
                  <p>{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="course-tab-wrapper">
              <div className="overview-content" style={{ padding: 20 }}>
                <Markup content={post.description} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="course-sidebar">
            <aside className="widget">
              <div className="info-course">
                <ul>
                  <li>
                    <FaChalkboardTeacher />
                    <span> Người hưỡng dẫn:</span>
                    <br />
                    {post.user.name}
                  </li>
                  <li>
                    <IoLanguageOutline />
                    <span>Ngôn ngữ: </span> Việt Nam
                  </li>
                </ul>
                {videos.length === 0 ? (
                  <Button
                    style={{ background: "#5838fc", border: 0 }}
                    onClick={setShowAddContactModal.bind(this, true)}
                  >
                    Đăng ký
                  </Button>
                ) : (
                  <>
                    {reg ? (
                      <form onSubmit={regpost}>
                        <Button
                          style={{ background: "#5838fc", border: 0 }}
                          disabled={!isAuthenticated}
                          type="submit"
                        >
                          Đăng ký khóa học
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={unregpost}>
                        <Button
                          style={{ background: "#5838fc", border: 0 }}
                          disabled={!isAuthenticated}
                          type="submit"
                        >
                          Hủy đăng ký
                        </Button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  };

  let body = null;
  if (data) {
    body = <>{data.map((post) => (post._id === id ? renderMain(post) : ""))}</>;
  } else if (postsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (post) {
    body = (
      <div className="row" key={post._id}>
        <div className="col-lg-9">
          <div className="single-course-area">
            <div className="course-top">
              <h4>{post.title}</h4>
              <div className="course-meta">
                <div className="author">
                  <img
                    style={{ top: "5px" }}
                    src={checkavatar(post.user.avatar)}
                    alt=""
                  />
                  <span>Người đăng tải</span>
                  <p>{post.user.name}</p>
                </div>
                <div className="categories">
                  <span>Chủ để:</span>
                  <p>{getTextDisplay(post.coursetype)}</p>
                </div>
                <div
                  className="categories"
                  style={{ border: 0, margin: 0, padding: 0 }}
                >
                  <span>Ngày đăng:</span>
                  <p>{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="course-tab-wrapper">
              <div className="overview-content" style={{ padding: 20 }}>
                <Markup content={post.description} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="course-sidebar">
            <aside className="widget">
              <div className="info-course">
                <ul>
                  <li>
                    <FaChalkboardTeacher />
                    <span> Người hưỡng dẫn:</span>
                    <br />
                    {post.user.name}
                  </li>
                  <li>
                    <IoLanguageOutline />
                    <span>Ngôn ngữ: </span> Việt Nam
                  </li>
                </ul>
                <Button
                  style={{ background: "#5838fc", border: 0 }}
                  onClick={setShowAddContactModal.bind(this, true)}
                >
                  Đăng ký
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const showVideo = (videoId) => {
    findVideo(videoId);
    setShowVideoModal(videoId);
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
          {reg ? (
            <FaLock size="24" />
          ) : (
            <Button
              title={"Xem " + item.title}
              style={{ background: "transparent", border: 0 }}
              onClick={showVideo.bind(this, item._id)}
            >
              <FaEye size="24" color="black" />
            </Button>
          )}
        </div>
      </li>
    );
  };

  let countv = 0;

  const incCountv = () => {
    countv++;
  };

  let jsxvideo = videos
    ? videos.map((item, i) => {
        return !textSreach
          ? render(item, i)
          : item.title.toLowerCase().search(textSreach.toLowerCase()) !== -1
          ? render(item, i)
          : incCountv();
      })
    : "";

  if (countv === videos.length) {
    var str = "Không có bài học '<b>" + textSreach + "</b>' mà bạn tìm kiếm";
    jsxvideo = <Markup content={str} />;
  }

  const onChangeSreach = (event) => setTextSreach(event.target.value);

  let morepost = null;

  if (data) {
    morepost = (
      <>
        {data
          ? data.map((post) =>
              post._id !== id && count < 3 ? renderItem(post, data) : ""
            )
          : ""}
      </>
    );
  } else if (postsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (post) {
    morepost = (
      <>
        {more
          ? more.map((items) =>
              items._id !== post.id && count < 3 ? renderItem(items, more) : ""
            )
          : ""}
      </>
    );
  }

  /// add modal

  const onChangeNewContactForm = (event) =>
    setNewContact({ ...newContact, [event.target.name]: event.target.value });

  const closeDialog = () => {
    setTimeout(resetAddPostData, 0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await addContact(newContact);
    setTimeout(resetAddPostData(), 0);
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  const resetAddPostData = () => {
    setNewContact({
      namecontact: isAuthenticated ? user.name : "",
      email: isAuthenticated ? user.email : "",
      subject: "[Đăng ký khóa học] " + thistitle + " - " + id,
      messagecontact: "[Đăng ký khóa học] " + thistitle + " - " + id,
      status: "Wait",
    });
    setShowAddContactModal(false);
  };

  return (
    <>
      {/* add modal */}
      <Modal
        show={showAddContactModal}
        onHide={closeDialog}
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Để lại thông tin liên hệ</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Tiêu đề"
                name="subject"
                required
                aria-describedby="title-help"
                value={subject}
                onChange={onChangeNewContactForm}
                disabled={true}
              />
              <Form.Text id="title-help" muted>
                Bắt buộc
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Tên"
                name="namecontact"
                required
                aria-describedby="title-help"
                value={namecontact}
                onChange={onChangeNewContactForm}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Địa chỉ mail"
                name="email"
                required
                aria-describedby="title-help"
                value={email}
                onChange={onChangeNewContactForm}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                as="textarea"
                placeholder="Nội dung"
                name="messagecontact"
                required
                aria-describedby="title-help"
                value={messagecontact}
                style={{ height: "40vh", resize: "none" }}
                onChange={onChangeNewContactForm}
                disabled={true}
              />
            </Form.Group>
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
      {/* add modal */}
      <Preload />
      <Navbar />
      <section
        className="page-banner"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="banner-title">Chi tiết khóa học</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="course-details-section">
        <div className="container">
          {body}
          {videos.length !== 0 ? (
            <div style={{ height: "fit-content" }} id="listvideo">
              <p style={{ marginTop: "10px" }}>
                <b>Danh sách bài học ({videos.length} bài):</b>
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
              </p>
              <div
                style={{
                  height: "fit-content",
                  display: "block",
                  position: "relative",
                  maxHeight: "200px",
                  overflow: "scroll",
                  marginTop: "10px",
                  padding: "20px",
                }}
              >
                <ul style={{ listStyle: "decimal-leading-zero" }}>
                  {jsxvideo}
                </ul>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="related-course">
            <h3>
              Gợi ý khóa học khác
              <Link
                style={{ float: "right", marginRight: "87px" }}
                className="read-more"
                to={{
                  pathname: "/courses",
                }}
              >
                Xem thêm&#160;
                <FaArrowRight />
              </Link>
            </h3>
            <div className="related-course-slider owl-carousel">{morepost}</div>
          </div>
        </div>
      </section>
      <Footer />
      {video !== null && showVideoModal && <ShowVideoModal />}
      {/* After contact is added, show toast */}
      <Toast
        show={show ? show : showS}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${show ? type : typeS} text-white`}
        onClose={
          show
            ? setShowToast.bind(this, {
                show: false,
                message: "",
                type: null,
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
          <strong>{show ? message : messageS}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Coursedetail;
