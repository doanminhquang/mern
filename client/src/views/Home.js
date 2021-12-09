import React, { useEffect, useContext, useState } from "react";
//-----------------------------------------------------------
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Preload from "../components/layout/PreLoad";
import CardPost from "../components/posts/CardPost";
//-----------------------------------------------------------
import LayerIMG from "../assets/home/layer.png";
import Banner from "../assets/home/banner.png";
import Data from "../assets/home/data-image.png";
import Desktop from "../assets/home/desktop1-image.png";
//-----------------------------------------------------------
import { PostContext } from "../contexts/PostContext";
//-----------------------------------------------------------
import Spinner from "react-bootstrap/Spinner";
//-----------------------------------------------------------
import { Link } from "react-router-dom";
//-----------------------------------------------------------
import { FaArrowRight } from "react-icons/fa";
//-----------------------------------------------------------

const Home = () => {
  // Contexts
  const {
    postState: { posts, postsLoading },
    getPosts,
  } = useContext(PostContext);

  const [SreachString, setSreachString] = useState(null);

  const [type, setType] = useState("All");
  const [isActive1, setActive1] = useState(true);
  const [isActive2, setActive2] = useState(false);
  const [isActive3, setActive3] = useState(false);
  const [isActive4, setActive4] = useState(false);
  const [isActive5, setActive5] = useState(false);
  const [isActive6, setActive6] = useState(false);
  const [isActive7, setActive7] = useState(false);

  let count = 0;

  // Start: Get all posts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getPosts();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const renderCard = (post, posts) => {
    return (
      <CardPost key={post._id} post={post} user={post.user} Posts={posts} />
    );
  };

  const incCount = () => {
    count++;
  };

  let body = null;

  if (postsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  } else if (posts.length === 0) {
    body = (
      <>
        <p>Chưa có dữ liệu vui lòng quay lại sau</p>
      </>
    );
  } else {
    body = (
      <>
        {posts.map((post) =>
          type === "All" && !SreachString
            ? renderCard(post, posts)
            : type === "All" &&
              SreachString &&
              post.title.toLowerCase().search(SreachString.toLowerCase()) !== -1
            ? renderCard(post, posts)
            : type !== "All" && !SreachString && post.coursetype === type
            ? renderCard(post, posts)
            : type !== "All" &&
              SreachString &&
              post.coursetype === type &&
              post.title.toLowerCase().search(SreachString.toLowerCase()) !== -1
            ? renderCard(post, posts)
            : incCount()
        )}
        {count === posts.length ? (
          <p
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              position: "absolute",
            }}
          >
            Không có dữ liệu về khóa học mà bạn đang tìm kiếm, vui lòng trở lại
            sau!
          </p>
        ) : (
          ""
        )}
      </>
    );
  }

  const click = (e) => {
    const value = e.target.getAttribute("data-group");
    setActive1(false);
    setActive2(false);
    setActive3(false);
    setActive4(false);
    setActive5(false);
    setActive6(false);
    setActive7(false);
    switch (value) {
      case "All":
        setType("All");
        setActive1(true);
        break;
      case "Data Science":
        setType("Data Science");
        setActive2(true);
        break;
      case "Computer Science":
        setType("Computer Science");
        setActive3(true);
        break;
      case "Web Development":
        setType("Web Development");
        setActive4(true);
        break;
      case "Mobile Development":
        setType("Mobile Development");
        setActive5(true);
        break;
      case "Application Development":
        setType("Application Development");
        setActive6(true);
        break;
      case "Other":
        setType("Other");
        setActive7(true);
        break;
      default:
        setType("All");
        setActive1(true);
    }
  };

  const onChangeSreach = (event) => setSreachString(event.target.value);

  return (
    <>
      <Preload />
      <Navbar />
      <div
        className="hero-banner-1"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="container" style={{ marginTop: "-100px" }}>
          <div className="row">
            <div className="col-lg-5 col-md-5">
              <div className="hero-content">
                <h2
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  Học để thành công
                </h2>
                <p>
                  Lập trình là kỹ năng cần có trong thời đại 4.0 và dần trở
                  thành 1 kỹ năng cơ bản mà ai cũng cần có như đọc, viết hay
                  tính toán... Ai cũng nên học và có thể học lập trình nếu có đủ
                  thời gian và động lực. Thế nhưng, chúng ta lại thường dễ bỏ dở
                  giữa chừng vì cảm thấy bế tắc, mệt mỏi và không còn đủ động
                  lực.
                </p>
              </div>
            </div>
            <div className="col-lg-7 col-md-7">
              <div className="banner-thumb">
                <img src={LayerIMG} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="popular-course-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h2 className="sec-title">
                <span>Khám phá</span>
                <br />
                <b>Các khóa học phổ biến của chúng tôi</b>
              </h2>
            </div>
            <div className="col-md-4" style={{ marginBottom: "10px" }}>
              <Link
                className="read-more"
                to={{
                  pathname: "/courses",
                }}
              >
                Xem ngay&#160;
                <FaArrowRight />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="course-wrapper">
                <div className="course-item-1 text-center">
                  <img src={Data} alt="" />
                  <h4 style={{ fontWeight: "500", marginTop: "10px" }}>
                    <p>Khoa học dữ liệu</p>
                  </h4>
                </div>
                <div className="course-item-1 text-center">
                  <img src={Desktop} alt="" />
                  <h4 style={{ fontWeight: "500", marginTop: "10px" }}>
                    <p>Khoa học máy tinh</p>
                  </h4>
                </div>
                <div className="course-item-1 text-center">
                  <img src={Desktop} alt="" />
                  <h4 style={{ fontWeight: "500", marginTop: "10px" }}>
                    <p>Lập trình web</p>
                  </h4>
                </div>
                <div className="course-item-1 text-center">
                  <img src={Desktop} alt="" />
                  <h4 style={{ fontWeight: "500", marginTop: "10px" }}>
                    <p>Lập trình mobile</p>
                  </h4>
                </div>
                <div className="course-item-1 text-center">
                  <img src={Desktop} alt="" />
                  <h4 style={{ fontWeight: "500", marginTop: "10px" }}>
                    <p>Lập trình ứng dụng</p>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-course-section">
        <div className="container">
          <div className="row" style={{ paddingBottom: "25px" }}>
            <div className="col-md-7">
              <h2 className="sec-title" style={{ margin: "0px" }}>
                <span>Tìm khóa học </span>phù hợp với bạn
              </h2>
            </div>
            <div className="col-md-12">
              <form
                className="search-box"
                style={{
                  float: "right",
                }}
              >
                <input
                  type="search"
                  name="s"
                  placeholder="Nhập tên khóa học..."
                  onChange={onChangeSreach}
                />
              </form>
              <ul className="shaf-filter">
                <li
                  className={isActive1 ? "active" : null}
                  data-group="All"
                  onClick={(e) => click(e)}
                >
                  Tất cả
                </li>
                <li
                  className={isActive2 ? "active" : null}
                  data-group="Data Science"
                  onClick={(e) => click(e)}
                >
                  Khoa học dữ liệu
                </li>
                <li
                  className={isActive3 ? "active" : null}
                  data-group="Computer Science"
                  onClick={(e) => click(e)}
                >
                  Khoa học máy tính
                </li>
                <li
                  className={isActive4 ? "active" : null}
                  data-group="Web Development"
                  onClick={(e) => click(e)}
                >
                  Lập trình web
                </li>
                <li
                  className={isActive5 ? "active" : null}
                  data-group="Mobile Development"
                  onClick={(e) => click(e)}
                >
                  Lập trình mobile
                </li>
                <li
                  className={isActive6 ? "active" : null}
                  data-group="Application Development"
                  onClick={(e) => click(e)}
                >
                  Lập trình ứng dụng
                </li>
                <li
                  className={isActive7 ? "active" : null}
                  data-group="Other"
                  onClick={(e) => click(e)}
                >
                  Khác
                </li>
              </ul>
            </div>
          </div>
          <div className="row shafull-container" style={{ minHeight: "510px" }}>
            {body}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
