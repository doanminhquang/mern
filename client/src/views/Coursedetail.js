import React, { useEffect, useState, useContext } from "react";
//-------------------------------------------------------------
import { PostContext } from "../contexts/PostContext";
import { ContactContext } from "../contexts/ContactContext";
import { VideoContext } from "../contexts/VideoContext";
import { StudentContext } from "../contexts/StudentContext";
import { CommentContext } from "../contexts/CommentContext";
import { AuthContext } from "../contexts/AuthContext";
import { apiUrl } from "../contexts/constants";
//-------------------------------------------------------------
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Preload from "../components/layout/PreLoad";
import ItemCourse from "../components/posts/ItemCourse";
import ShowVideoModal from "../components/videos/ShowVideoModal";
import Star from "../components/layout/Star";
//-------------------------------------------------------------
import Banner from "../assets/banner.jpg";
import author from "../assets/home/author.png";
import { Markup } from "interweave";
import { formatDate } from "../utils/FormatDate";
import { getTextDisplay } from "../utils/GettextDisplay";
//-------------------------------------------------------------
import { IoLanguageOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { BsJournalBookmark } from "react-icons/bs";
import { BsBookHalf } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { CgMenuBoxed } from "react-icons/cg";
//-------------------------------------------------------------
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
//-------------------------------------------------------------
import { Link } from "react-router-dom";
//---- add modal
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
//-------------------------------------------------------------
import axios from "axios";
//-------------------------------------------------------------
import { useLocation } from "react-router";

const Coursedetail = (props) => {
  // State
  let thistitle = "";
  const [data, setData] = useState(null);
  const [textSreach, setTextSreach] = useState(null);
  const [reg, setreg] = useState(true);
  const [index, setindex] = useState(-1);
  const [idxclick, setidxclick] = useState(0);
  const [id_std, setid_std] = useState(0);
  const [tab, settab] = useState(0);
  const [showvideo, setshowvideo] = useState(false);
  const [listcmt, setListcmt] = useState([]);
  const [listcmtdetail, setListcmtdetail] = useState([]);
  const location = useLocation();

  var url = window.location.href;
  var id = url.substring(url.lastIndexOf("?id=") + 4);

  // State modal
  const [newContact, setNewContact] = useState({
    namecontact: "",
    email: "",
    subject: "",
    messagecontact: "",
    status: "Wait",
  });

  // State modal
  const [newComment, setNewComment] = useState({
    post: id,
    cmt: "",
    rating: 0,
  });

  // context
  const {
    authState: { user, isAuthenticated },
  } = useContext(AuthContext);

  const {
    postState: { post, more, postsLoading },
    getPost,
    getPosts,
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

  const {
    showToastC: { showC, messageC, typeC },
    setShowToastC,
    addComment,
  } = useContext(CommentContext);

  const RessetData = () => {
    setData(null);
    setTextSreach(null);
    setreg(true);
    setindex(-1);
    settab(0);
    setid_std(0);
    setidxclick(0);
    setshowvideo(false);
    setListcmt([]);
    setListcmtdetail([]);
  };

  useEffect(() => {
    RessetData();
    if (props.location.state) {
      setData(props.location.state);
    } else {
      getPost(id);
    }
  }, [location]);

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
  }, [location]);

  const getContactsById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/comments/${id}`);
      if (response.data.success) {
        setListcmt(response.data.comments);
        setListcmtdetail(response.data.ratingdetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Start: Get all cmt by id
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        // Get contacts by id
        getContactsById(id);
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, [location]);

  const check = async () => {
    if (!isAuthenticated) {
      setreg(true);
      setindex(-1);
      setid_std(0);
    } else {
      try {
        const response = await axios.get(`${apiUrl}/students/check/${id}`);
        if (response.data.success)
          if (response.data.students.length !== 0) {
            setreg(false);
            console.log(response.data.students);
            setindex(response.data.students[0].index);
            setid_std(response.data.students[0]._id);
          } else {
            setreg(true);
            setindex(-1);
            setid_std(0);
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
        check();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        setNewContact({
          ...newContact,
          subject: "[Đăng ký khóa học] " + thistitle + " - " + id,
          messagecontact: "[Đăng ký khóa học] " + thistitle + " - " + id,
          namecontact: isAuthenticated ? user.name : "",
          email: isAuthenticated ? user.email : "",
        });
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, [isAuthenticated, location]);

  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        setNewComment({
          post: id,
          cmt: "",
          rating: 0,
        });
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, [location]);

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
        setindex(response.data.student.index);
        setid_std(response.data.student._id);
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
    if (message === "Bạn đã đăng ký từ trước vui lòng thử lại") check();
    else
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
        setindex(-1);
        setid_std(0);
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

  const createsreach = (id) => {
    return "?id=" + id;
  };

  const changervideo = () => {
    setshowvideo(!showvideo);
  };

  const updateidx = async (idx) => {
    try {
      idx = idx + 1;
      if (idx > index) {
        const response = await axios.put(`${apiUrl}/students/${id_std}`, {
          index: idx,
        });
        if (response.data.success) {
          if (response.data.message === "Đã cập nhật tiến độ!") check();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showVideo = (videoId, i) => {
    findVideo(videoId);
    setShowVideoModal(true);
    updateidx(i);
    setidxclick(i);
  };

  const render = (item, i) => {
    if (videosLoading) {
      <div className="spinner-container">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>;
    } else {
      return (
        <>
          <div className="ci-item with-bg" key={i}>
            <h5>
              <CgMenuBoxed />
              <a>{item.title}</a>
            </h5>
            <div className="ci-tools">
              {reg ? (
                <a className="lock">
                  <FaLock />
                </a>
              ) : i <= index ? (
                <a className="lock">
                  <Button
                    title={"Xem " + item.title}
                    style={{ background: "transparent", border: 0, padding: 0 }}
                    onClick={showVideo.bind(this, item._id, i)}
                  >
                    {i < index ? (
                      <FaEye size="24" color="green" />
                    ) : (
                      <FaEye size="24" color="black" />
                    )}
                  </Button>
                </a>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      );
    }
  };

  let countv = 0;

  const incCountv = () => {
    countv++;
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

  const resetAddCMTData = () => {
    setNewComment({
      post: id,
      cmt: "",
      rating: 0,
    });
  };

  const onSubmitComment = async (event) => {
    event.preventDefault();
    const { success, message } = await addComment(newComment);
    //if (success) {
    setTimeout(resetAddCMTData(), 0);
    //}
    if (success) {
      setTimeout(getPosts(), 0);
      setTimeout(getContactsById(id), 0);
    }
    setShowToastC({
      showC: true,
      messageC: message,
      typeC: success ? "success" : "danger",
    });
  };

  const onChangeNewComment = (event) =>
    setNewComment({ ...newComment, [event.target.name]: event.target.value });

  const onChangeSreach = (event) => setTextSreach(event.target.value);

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

  const calcavg = (list) => {
    let sum = 0;
    let n = list.length;
    for (let i = 0; i < n; i++) {
      sum += list[i].rating;
    }
    return n === 0 ? 0 : parseFloat(sum / n).toFixed(2);
  };

  const calc_percent = (list, find) => {
    let count = 0;
    let countfind = 0;
    let n = list.length;
    for (let i = 0; i < n; i++) {
      if (parseFloat(list[i]._id) === parseFloat(find)) {
        countfind = list[i].count;
      }
      count += list[i].count;
    }
    return Math.round((countfind / count) * 100);
  };

  const renderMain = (post) => {
    thistitle = post.title;
    return (
      <div className="row" key={post._id}>
        <div className="col-lg-9">
          <div className="single-course-area">
            <div className="course-top">
              <h4>
                <b>{post.title}</b>
              </h4>
              <div className="course-meta">
                <div className="author">
                  <img
                    style={{ top: "5px" }}
                    src={checkavatar(post.user.avatar)}
                    alt=""
                  />
                  <span>Người đăng tải</span>
                  <Link
                    to={{
                      pathname: "/profile/",
                      search: createsreach(post.user._id),
                    }}
                    style={{ color: "black" }}
                  >
                    <p>{post.user.name}</p>
                  </Link>
                </div>
                <div className="categories">
                  <span>Chủ để:</span>
                  <p>{getTextDisplay(post.coursetype)}</p>
                </div>
                <div className="ratings">
                  <span style={{ paddingBottom: 6 }}>
                    {listcmt ? calcavg(listcmt) : post.avgrating} (
                    {listcmt ? listcmt.length : post.countrating} đánh giá)
                  </span>
                  <Star rating={listcmt ? calcavg(listcmt) : post.avgrating} />
                </div>
                <div
                  className="categories"
                  style={{ marginRight: 0, paddingRight: 0, borderRight: 0 }}
                >
                  <span>Ngày đăng:</span>
                  <p>{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="course-tab-wrapper">
              <ul className="course-tab-btn nav nav-tabs">
                <li onClick={() => settab(0)}>
                  {tab === 0 ? (
                    <a data-toggle="tab" className="active">
                      <BsJournalBookmark />
                      Mô tả khóa học
                    </a>
                  ) : (
                    <a data-toggle="tab">
                      <BsJournalBookmark />
                      Mô tả khóa học
                    </a>
                  )}
                </li>
                {tab === 1 ? (
                  <li onClick={() => settab(1)}>
                    <a data-toggle="tab" className="active">
                      <BsBookHalf />
                      Bài học
                    </a>
                  </li>
                ) : (
                  <li onClick={() => settab(1)}>
                    <a data-toggle="tab">
                      <BsBookHalf />
                      Bài học
                    </a>
                  </li>
                )}
                {tab === 2 ? (
                  <li onClick={() => settab(2)}>
                    <a data-toggle="tab" className="active">
                      <AiFillStar />
                      Đánh giá
                    </a>
                  </li>
                ) : (
                  <li onClick={() => settab(2)}>
                    <a data-toggle="tab">
                      <AiFillStar />
                      Đánh giá
                    </a>
                  </li>
                )}
              </ul>
              <div className="tab-content">
                {tab === 0 ? (
                  <div id="overview" role="tabpanel" style={{ paddingTop: 25 }}>
                    <div className="overview-content">
                      <h4>Mô tả khóa học</h4>
                      <p>
                        <Markup content={post.description} />
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {tab === 1 ? (
                  <div
                    id="curriculum"
                    role="tabpanel"
                    style={{ paddingTop: 25 }}
                  >
                    <div className="curriculum-item" id="id_1">
                      <div
                        className="card-header"
                        id="cc_1"
                        onClick={() => changervideo()}
                      >
                        <h5
                          className="mb-0"
                          style={{
                            display: "flex",
                          }}
                        >
                          <button
                            className="btn btn-link"
                            data-toggle="collapse"
                            data-target="#acc_1"
                            aria-expanded="true"
                            aria-controls="acc_1"
                            style={{ textDecoration: "none" }}
                          >
                            <b> Bài học ({videos.length} bài) </b>
                          </button>
                          {showvideo ? (
                            <MdKeyboardArrowDown />
                          ) : (
                            <MdKeyboardArrowUp />
                          )}
                        </h5>
                      </div>
                      {showvideo ? (
                        <>
                          <div
                            className="ci-item with-bg"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Form.Group
                              style={{
                                width: "30%",
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
                            id="acc_1"
                            className="collapse show"
                            aria-labelledby="cc_1"
                            data-parent="#id_1"
                          >
                            <div className="card-body">{jsxvideo}</div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {tab === 2 ? (
                  <div id="reviews" role="tabpanel" style={{ paddingTop: 25 }}>
                    <div className="reviw-area">
                      <h4>Đánh giá</h4>
                      <div className="reating-details">
                        <div className="average-rate">
                          <p>Trung bình đánh giá</p>
                          <div className="rate-box">
                            <h2 style={{ fontSize: "2rem" }}>
                              {listcmt ? calcavg(listcmt) : post.avgrating}
                            </h2>
                            <div
                              className="ratings"
                              style={{ marginLeft: "10px" }}
                            >
                              <Star
                                rating={
                                  listcmt ? calcavg(listcmt) : post.avgrating
                                }
                              />
                            </div>
                            <br />
                            <br />
                            <span>
                              {listcmt
                                ? `${listcmt.length} Đánh
                              giá`
                                : `${post.countrating} Đánh
                                giá`}
                            </span>
                          </div>
                        </div>
                        <div className="details-rate">
                          <p>Đánh giá chi tiết</p>
                          <div className="detail-rate-box">
                            <div className="rate-item">
                              <p>5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 5)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>4.5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 4.5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 4.5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 4.5)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>4</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 4)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 4)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 4)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>3.5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 3.5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 3.5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 3.5)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>3</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 3)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 3)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 3)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>2.5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 2.5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 2.5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 2.5)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>2</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 2)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 2)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 2)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>1.5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 1.5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 1.5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 1.5)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>1</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 1)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 1)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 1)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="rate-item">
                              <p>0.5</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: listcmtdetail
                                      ? `${calc_percent(listcmtdetail, 0.5)}%`
                                      : 0,
                                  }}
                                  aria-valuenow={
                                    listcmtdetail
                                      ? calc_percent(listcmtdetail, 0.5)
                                      : 0
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span>
                                {listcmtdetail
                                  ? calc_percent(listcmtdetail, 0.5)
                                  : 0}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        <h5>Bình luận ( {listcmt ? listcmt.length : 0} )</h5>
                        <ol>
                          {listcmt
                            ? listcmt.map((cmt, index) => (
                                <li key={index}>
                                  <div className="single-comment">
                                    <img src={checkavatar(cmt.user.avatar)} />
                                    <h5>
                                      <Link
                                        to={{
                                          pathname: "/profile/",
                                          search: createsreach(cmt.user._id),
                                        }}
                                        style={{ color: "black" }}
                                      >
                                        <b>{cmt.user.name}</b>
                                      </Link>
                                    </h5>
                                    <span>{formatDate(cmt.createdAt)}</span>
                                    <div className="comment">
                                      <p>{cmt.cmt}</p>
                                    </div>
                                    <div className="ratings">
                                      <Star
                                        rating={cmt.rating}
                                        index={cmt._id}
                                      />
                                    </div>
                                    <div className="c-border" />
                                  </div>
                                </li>
                              ))
                            : ""}
                        </ol>
                      </div>
                      <div className="review-form-area">
                        <h5>Để lại bình luận</h5>
                        <div className="comment-form">
                          <form className="row" onSubmit={onSubmitComment}>
                            <div className="col-md-12">
                              <div className="comment-form-rating">
                                <label>Đánh giá:</label>
                                <div id="rating">
                                  <input
                                    type="radio"
                                    id="star5"
                                    name="rating"
                                    value="5"
                                    checked={newComment.rating === 5}
                                  />
                                  <label
                                    className="full"
                                    for="star5"
                                    title="Tuyệt vời - 5 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 5,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star4half"
                                    name="rating"
                                    value="4.5"
                                    checked={newComment.rating === 4.5}
                                  />
                                  <label
                                    className="half"
                                    for="star4half"
                                    title="Khá tốt - 4.5 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 4.5,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star4"
                                    name="rating"
                                    value="4"
                                    checked={newComment.rating === 4}
                                  />
                                  <label
                                    className="full"
                                    for="star4"
                                    title="Khá tốt - 4 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 4,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star3half"
                                    name="rating"
                                    value="3.5"
                                    checked={newComment.rating === 3.5}
                                  />
                                  <label
                                    className="half"
                                    for="star3half"
                                    title="Cố gắng lên - 3.5 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 3.5,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star3"
                                    name="rating"
                                    value="3"
                                    checked={newComment.rating === 3}
                                  />
                                  <label
                                    className="full"
                                    for="star3"
                                    title="Cố gắng lên - 3 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 3,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star2half"
                                    name="rating"
                                    value="2.5"
                                    checked={newComment.rating === 2.5}
                                  />
                                  <label
                                    className="half"
                                    for="star2half"
                                    title="Khá là kém - 2.5 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 2.5,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star2"
                                    name="rating"
                                    value="2"
                                    checked={newComment.rating === 2}
                                  />
                                  <label
                                    className="full"
                                    for="star2"
                                    title="Khá là kém - 2 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 2,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star1half"
                                    name="rating"
                                    value="1.5"
                                    checked={newComment.rating === 1.5}
                                  />
                                  <label
                                    className="half"
                                    for="star1half"
                                    title="Buồn thật - 1.5 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 1.5,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="star1"
                                    name="rating"
                                    value="1"
                                    checked={newComment.rating === 1}
                                  />
                                  <label
                                    className="full"
                                    for="star1"
                                    title="Rất tệ hại - 1 sao"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 1,
                                      })
                                    }
                                  ></label>

                                  <input
                                    type="radio"
                                    id="starhalf"
                                    name="rating"
                                    value="0.5"
                                    checked={newComment.rating === 0.5}
                                  />
                                  <label
                                    className="half"
                                    for="starhalf"
                                    title="Rất tệ hại - 0.5 stars"
                                    onClick={() =>
                                      setNewComment({
                                        ...newComment,
                                        rating: 0.5,
                                      })
                                    }
                                  ></label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <textarea
                                placeholder="Bình luận"
                                name="cmt"
                                value={newComment.cmt}
                                onChange={onChangeNewComment}
                                required
                              />
                            </div>
                            <div className="col-md-12">
                              {isAuthenticated ? (
                                !reg ? (
                                  <button type="submit">Gửi</button>
                                ) : (
                                  <button
                                    title="Vui lòng đăng ký khóa học để bình luận"
                                    disabled
                                  >
                                    Không thể gửi
                                  </button>
                                )
                              ) : (
                                <Link
                                  to={{
                                    pathname: "/login",
                                  }}
                                >
                                  Vui lòng đăng nhập để dùng đủ tính năng
                                </Link>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
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
                    <span>Ngôn ngữ: </span> Tiếng Việt
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
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  } else if (post) {
    body = <>{renderMain(post)}</>;
  }

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
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  } else if (post) {
    morepost = (
      <>
        {more
          ? more.map((items) =>
              items._id !== post._id && count < 3 ? renderItem(items, more) : ""
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

  const NextorPrevVideo = (index) => {
    findVideo(videos[index]._id);
    setidxclick(index);
    updateidx(index);
  };

  return (
    <>
      {/* btn next and prev */}
      {video !== null && showVideoModal && idxclick > 0 && (
        <div
          style={{
            position: "fixed",
            zIndex: "9999",
            left: 0,
            top: "50%",
            MsTransform: "translateY(-50%)",
            transform: "translateY(-50%)",
            marginLeft: 20,
            left: 0,
          }}
        >
          <Button onClick={() => NextorPrevVideo(idxclick - 1)}>{"<"}</Button>
        </div>
      )}
      {video !== null && showVideoModal && idxclick < videos.length - 1 && (
        <div
          style={{
            position: "fixed",
            zIndex: "9999",
            top: "50%",
            MsTransform: "translateY(-50%)",
            transform: "translateY(-50%)",
            marginRight: 20,
            right: 0,
          }}
        >
          <Button onClick={() => NextorPrevVideo(idxclick + 1)}>{">"}</Button>
        </div>
      )}
      {/* add modal */}
      {videos.length === 0 ? (
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
      ) : (
        ""
      )}
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
          {!postsLoading ? (
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
              <div
                className="related-course-slider owl-carousel"
                style={{ display: "flex" }}
              >
                {morepost}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
      <Footer />
      {video !== null && showVideoModal && <ShowVideoModal />}
      {/* After contact is added, show toast */}
      <Toast
        show={show ? show : showS ? showS : showC}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${show ? type : showS ? typeS : typeC} text-white`}
        onClose={
          show
            ? setShowToast.bind(this, {
                show: false,
                message: "",
                type: null,
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
          <strong>{show ? message : showS ? messageS : messageC}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Coursedetail;
