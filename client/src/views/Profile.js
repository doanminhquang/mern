import React, { useEffect, useContext, useState } from "react";
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Preload from "../components/layout/PreLoad";
import Banner from "../assets/banner3.jpg";
import author from "../assets/home/author.png";
//-----------------------------------------------------
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import ItemMyCourse from "../components/posts/ItemMyCourse";
import { formatDate } from "../utils/FormatDate";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { VscEdit } from "react-icons/vsc";
import Button from "react-bootstrap/Button";
import { convertBase64 } from "../utils/convertBase64";
import { BiImageAdd } from "react-icons/bi";
import { isImage } from "../utils/CheckExtension";
import Toast from "react-bootstrap/Toast";

export default function Profile() {
  const {
    authState: {
      user: { _id, name, avatar, email, username, type },
    },
    loadUser,
  } = useContext(AuthContext);

  const [Tab, setTab] = useState(true);
  const [Info, setInfo] = useState();
  const [MyPost, setMyPost] = useState([]);
  const [MyEnroll, setMyEnroll] = useState([]);
  const [LoadingInfo, setLoadingInfo] = useState(true);
  const [LoadingPost, setLoadingPost] = useState(true);
  const [LoadingEnroll, setLoadingEnroll] = useState(true);
  const [EditMode, SetEditMode] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: null,
  });

  const [newInfo, setNewInfo] = useState({
    nname: "",
    nemail: "",
    nusername: "",
    navatar: null,
    npassword: "",
    ntype: type,
  });

  const { nname, nemail, nusername, navatar, npassword } = newInfo;

  const onChangeNewInfoForm = (event) =>
    setNewInfo({ ...newInfo, [event.target.name]: event.target.value });

  const checkavatar = (str) => {
    str = str ? str : author;
    return str;
  };

  const url = window.location.href;
  const thisid = url.substring(url.lastIndexOf("?id=") + 4);

  // Get info
  const getInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${thisid}`);
      if (response.data.success) {
        setInfo(response.data.users);
        setLoadingInfo(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get my posts
  const getMyPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts/myposts/${thisid}`);
      if (response.data.success) {
        setMyPost(response.data.posts);
        setLoadingPost(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get my enroll posts
  const getMyEnrollPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts/myenrolls/${thisid}`);
      if (response.data.success) {
        setMyEnroll(response.data.posts);
        setLoadingEnroll(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Start: Get info
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        if (_id !== thisid) getInfo();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get my posts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getMyPosts();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get my enroll posts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getMyEnrollPosts();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const createsreach = (id) => {
    return "?id=" + id;
  };

  const EditInfo = () => {
    if (EditMode) {
      ClearState();
    } else {
      setNewInfo({
        nname: name,
        nemail: email,
        nusername: username,
        navatar: avatar,
        npassword: "",
        ntype: type,
      });
    }
    SetEditMode(!EditMode);
  };

  const ClearState = () => {
    setNewInfo({
      nname: "",
      nemail: "",
      nusername: "",
      navatar: null,
      npassword: "",
      ntype: type,
    });
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isImage(file)) {
        const base64 = await convertBase64(file);
        setNewInfo({ ...newInfo, navatar: base64 });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận ảnh");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  const UpdateInfo = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/users/myinfo/${_id}`,
        newInfo
      );
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await UpdateInfo(newInfo);
    if (success) {
      setTimeout(ClearState(), 0);
      setTimeout(EditInfo(), 0);
      setTimeout(loadUser(), 0);
      setTimeout(getMyPosts(), 0);
    }
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
  };

  return (
    <>
      <Preload />
      <Navbar />
      <section
        className="page-banner"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="banner-title">Trang cá nhân</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="teacher-profile">
                <div className="teacher-thumb">
                  <img
                    src={
                      _id === thisid ? (
                        navatar !== null ? (
                          checkavatar(navatar)
                        ) : (
                          checkavatar(avatar)
                        )
                      ) : LoadingInfo ? (
                        <div className="spinner-container">
                          <Spinner
                            animation="border"
                            style={{ color: "#603ce4" }}
                          />
                        </div>
                      ) : (
                        checkavatar(Info[0].avatar)
                      )
                    }
                  />
                  {EditMode ? (
                    <Button
                      style={{
                        background: "#f1f1f1",
                        padding: 0,
                        position: "absolute",
                        border: 0,
                        bottom: 0,
                        right: 0,
                        zIndex: "999",
                      }}
                      onClick={hanlderClickUpload}
                    >
                      <BiImageAdd color="black" fontSize="1.5rem" />
                      <input
                        id="upload"
                        name="navatar"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          uploadFile(e);
                        }}
                      />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="teacher-meta">
                  <h5>
                    <b>
                      {_id === thisid ? (
                        <>
                          {name}
                          <button
                            title="Sửa thông tin"
                            onClick={() => EditInfo()}
                            style={{
                              background: "transparent",
                              border: "none",
                              float: "right",
                            }}
                            disabled={EditMode}
                          >
                            <VscEdit />
                          </button>
                        </>
                      ) : LoadingInfo ? (
                        <div className="spinner-container">
                          <Spinner
                            animation="border"
                            style={{ color: "#603ce4" }}
                          />
                        </div>
                      ) : (
                        Info[0].name
                      )}
                    </b>
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              {!EditMode ? (
                <>
                  <ul className="tab-title nav nav-tabs">
                    <li onClick={() => setTab(true)}>
                      {Tab ? (
                        <a className="active" data-toggle="tab">
                          Khóa học của tôi
                        </a>
                      ) : (
                        <a data-toggle="tab">Khóa học của tôi</a>
                      )}
                    </li>
                    {_id === thisid ? (
                      <li onClick={() => setTab(false)}>
                        {Tab ? (
                          <a data-toggle="tab">Khóa học đã đăng ký</a>
                        ) : (
                          <a className="active" data-toggle="tab">
                            Khóa học đã đăng ký
                          </a>
                        )}
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>

                  <div className="tab-content">
                    {Tab ? (
                      <div
                        className="tab-pane fade show in active"
                        id="owned"
                        role="tabpanel"
                      >
                        <h3 className="course-title">Khóa học của tôi</h3>
                        <div className="row">
                          {LoadingPost ? (
                            <div className="spinner-container">
                              <Spinner
                                animation="border"
                                style={{ color: "#603ce4" }}
                              />
                            </div>
                          ) : MyPost && MyPost.length != 0 ? (
                            MyPost.map((post) => (
                              <ItemMyCourse
                                key={post._id}
                                post={post}
                                user={post.user}
                              />
                            ))
                          ) : (
                            <p style={{ marginLeft: "15px" }}>
                              Tài khoản chưa có khóa học nào!
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="tab-pane fade show in active"
                        id="owned"
                        role="tabpanel"
                      >
                        <div className="tab-content">
                          <div
                            className="tab-pane fade show in active"
                            id="all"
                            role="tabpanel"
                          >
                            {LoadingEnroll ? (
                              <div className="spinner-container">
                                <Spinner
                                  animation="border"
                                  style={{ color: "#603ce4" }}
                                />
                              </div>
                            ) : (
                              <table className="result-table">
                                <thead>
                                  <tr>
                                    <th className="course">Tên khóa học</th>
                                    <th className="date">Ngày đăng ký</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {MyEnroll.length != 0 ? (
                                    MyEnroll.map((item) => (
                                      <tr key={item.post._id}>
                                        <td className="course">
                                          <Link
                                            to={{
                                              pathname: "/coursedetail/",
                                              search: createsreach(
                                                item.post._id
                                              ),
                                            }}
                                            style={{ color: "black" }}
                                          >
                                            {item.post.title}
                                          </Link>
                                        </td>
                                        <td className="date">
                                          {formatDate(item.createdAt)}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="2">
                                        Chưa đăng ký khóa học nào
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="contact-form">
                    <h4>Sửa thông tin tài khoản</h4>
                    <form onSubmit={onSubmit} className="row">
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="nname"
                          placeholder="Họ và tên"
                          value={nname}
                          onChange={onChangeNewInfoForm}
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <input
                          type="email"
                          name="nemail"
                          placeholder="Địa chỉ mail"
                          value={nemail}
                          onChange={onChangeNewInfoForm}
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="nusername"
                          placeholder="Tên tài khoản"
                          value={nusername}
                          onChange={onChangeNewInfoForm}
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <input
                          type="password"
                          name="npassword"
                          placeholder="Mật khẩu"
                          value={npassword}
                          onChange={onChangeNewInfoForm}
                        />
                      </div>
                      <div className="col-md-6 text-right">
                        <input type="submit" name="submit" value="Gửi" />
                      </div>
                    </form>
                  </div>
                  <Button
                    style={{
                      float: "right",
                      marginTop: "10px",
                      backgroundColor: "#5838fc",
                    }}
                    onClick={() => EditInfo()}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <Toast
          show={showToast.show}
          style={{ position: "fixed", top: "20%", right: "10px" }}
          className={`bg-${showToast.type} text-white`}
          onClose={setShowToast.bind(this, {
            show: false,
            message: "",
            type: null,
          })}
          delay={3000}
          autohide
        >
          <Toast.Body>
            <strong>{showToast.message}</strong>
          </Toast.Body>
        </Toast>
      </section>
      <Footer />
    </>
  );
}
