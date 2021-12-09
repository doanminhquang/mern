import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BsCodeSlash } from "react-icons/bs";
import { RiContactsFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaTachometerAlt } from "react-icons/fa";
import author from "../../assets/home/author.png";

const SliderBar = () => {
  const {
    authState: {
      user: { name, type, avatar, _id },
    },
    logoutUser,
  } = useContext(AuthContext);

  const thisPath = window.location.pathname;

  const [active, setActive] = useState();

  useEffect(() => {
    switch (thisPath) {
      case "/dashboard":
        setActive(0);
        break;
      case "/dashboard/courses":
        setActive(1);
        break;
      case "/dashboard/contact":
        setActive(2);
        break;
      case "/dashboard/account":
        setActive(3);
        break;
      default:
        setActive();
    }
  }, [thisPath]);

  const logout = () => logoutUser();

  const checkavatar = (str) => {
    str = str ? str : author;
    return str;
  };

  const profilepath = `/profile/?id=${_id ? _id : "0"}`;

  return (
    <>
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <Link
              className="nav-link"
              to={{
                pathname: profilepath,
              }}
            >
              <div className="nav-profile-image">
                <img src={checkavatar(avatar)} alt="profile" />
              </div>
              <div className="nav-profile-text d-flex flex-column">
                <span className="font-weight-bold mb-2">{name}</span>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={{
                pathname: "/home",
              }}
            >
              <span className="menu-title">Trang chủ</span>
              <AiFillHome />
            </Link>
          </li>
          <li className="nav-item">
            {active === 0 ? (
              <Link
                className="nav-link"
                style={{ color: "#603ce4" }}
                to={{
                  pathname: "/dashboard",
                }}
              >
                <span className="menu-title">Bảng quản lý</span>
                <FaTachometerAlt color={"#603ce4"} />
              </Link>
            ) : (
              <Link
                className="nav-link"
                to={{
                  pathname: "/dashboard",
                }}
              >
                <span className="menu-title">Bảng quản lý</span>
                <FaTachometerAlt />
              </Link>
            )}
          </li>
          <li className="nav-item">
            {active === 1 ? (
              <Link
                className="nav-link"
                style={{ color: "#603ce4" }}
                to={{
                  pathname: "/dashboard/courses",
                }}
              >
                <span className="menu-title">Quản lý khóa học</span>
                <BsCodeSlash color={"#603ce4"} />
              </Link>
            ) : (
              <Link
                className="nav-link"
                to={{
                  pathname: "/dashboard/courses",
                }}
              >
                <span className="menu-title">Quản lý khóa học</span>
                <BsCodeSlash />
              </Link>
            )}
          </li>
          <li className="nav-item">
            {active === 2 ? (
              <Link
                className="nav-link"
                style={{ color: "#603ce4" }}
                to={{
                  pathname: "/dashboard/contact",
                }}
              >
                <span className="menu-title">Quản lý liên hệ</span>
                <RiContactsFill color={"#603ce4"} />
              </Link>
            ) : (
              <Link
                className="nav-link"
                to={{
                  pathname: "/dashboard/contact",
                }}
              >
                <span className="menu-title">Quản lý liên hệ</span>
                <RiContactsFill />
              </Link>
            )}
          </li>
          {type === "admin" ? (
            <li className="nav-item">
              {active === 3 ? (
                <Link
                  className="nav-link"
                  style={{ color: "#603ce4" }}
                  to={{
                    pathname: "/dashboard/account",
                  }}
                >
                  <span className="menu-title">Quản lý tài khoản</span>
                  <FaUsers color={"#603ce4"} />
                </Link>
              ) : (
                <Link
                  className="nav-link"
                  to={{
                    pathname: "/dashboard/account",
                  }}
                >
                  <span className="menu-title">Quản lý tài khoản</span>
                  <FaUsers />
                </Link>
              )}
            </li>
          ) : (
            ""
          )}
          <li className="nav-item" onClick={() => logout()}>
            <Link className="nav-link">
              <span className="menu-title">Đăng Xuất</span>
              <i />
              <FaSignOutAlt />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SliderBar;
