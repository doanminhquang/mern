import React, { useEffect, useContext, useState } from "react";
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Banner from "../assets/banner3.jpg";
import Preload from "../components/layout/PreLoad";
import CardPost from "../components/posts/CardPost";
import Spinner from "react-bootstrap/Spinner";
//--------------------------------------------------------
import { PostContext } from "../contexts/PostContext";
import { CategoryContext } from "../contexts/CategoryContext";
//--------------------------------------------------------

const Courses = () => {
  // Contexts
  const {
    postState: { posts, postsLoading },
    getPosts,
  } = useContext(PostContext);

  const {
    categoryState: { categorys },
    getCategorys,
  } = useContext(CategoryContext);

  const [SreachString, setSreachString] = useState(null);

  const [type, setType] = useState("All");

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

  // Start: Get all categorys
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getCategorys();
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
            : type !== "All" && !SreachString && post.category.name === type
            ? renderCard(post, posts)
            : type !== "All" &&
              SreachString &&
              post.category.name === type &&
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

    setType(value);
  };

  const onChangeSreach = (event) => setSreachString(event.target.value);

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
              <h2 className="banner-title">Khoá học</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-course-section">
        <div className="container">
          <div className="row" style={{ paddingBottom: "25px" }}>
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
                  className={type === "All" ? "active" : null}
                  data-group="All"
                  onClick={(e) => click(e)}
                >
                  Tất cả
                </li>
                {categorys.map((option) => (
                  <li
                    className={type === option.name ? "active" : null}
                    data-group={option.name}
                    onClick={(e) => click(e)}
                  >
                    {option.name}
                  </li>
                ))}
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

export default Courses;
