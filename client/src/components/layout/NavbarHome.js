import $ from "jquery";
//-----------------------------------------------------
import React, { useEffect, useContext, useState } from "react";
//-----------------------------------------------------
import { AuthContext } from "../../contexts/AuthContext";
//-----------------------------------------------------
import Logo from "../../assets/logo.svg";
import LogoWhite from "../../assets/logo-white.svg";
import author from "../../assets/home/author.png";
//-----------------------------------------------------
import { FaUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
//-----------------------------------------------------
import { Link } from "react-router-dom";
//-----------------------------------------------------
import NavDropdown from "react-bootstrap/NavDropdown";
//-----------------------------------------------------

export default function Navbar() {
  const {
    authState: { isAuthenticated, user },
    logoutUser,
  } = useContext(AuthContext);

  const logout = () => logoutUser();

  const [LogoMode, SetLogoMode] = useState(true);
  const path = window.location.pathname;

  useEffect(() => {
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 40) {
        $(".sticky").addClass("fix-header animated fadeInDown");
      } else {
        $(".sticky").removeClass("fix-header animated fadeInDown");
      }
    });
  });

  useEffect(() => {
    if (
      path === "/courses" ||
      path === "/contact" ||
      path === "/coursedetail/" ||
      path === "/profile/"
    ) {
      SetLogoMode(false);
    }
  }, [path]);

  const checkavatar = (str) => {
    str = str ? str : author;
    return str;
  };

  const profilepath = `/profile/?id=${user ? user._id : "0"}`;

  return (
    <>
      <header className="header-01 sticky">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <nav
                className="navbar navbar-expand-lg"
                style={{ background: "transparent" }}
              >
                <Link
                  className="navbar-brand"
                  to={{
                    pathname: "/home",
                  }}
                >
                  {LogoMode ? (
                    <img src={Logo} alt="QLMS_Logo" />
                  ) : (
                    <img src={LogoWhite} alt="QLMS_Logo" />
                  )}
                  <img
                    className="sticky-logo"
                    src={LogoWhite}
                    alt="QLMS_Logo"
                  />
                </Link>
                <button className="navbar-toggler" type="button">
                  <FaBars />
                </button>
                <div className="collapse navbar-collapse">
                  <ul className="navbar-nav">
                    <li className="menu-item-has-children">
                      <Link
                        to={{
                          pathname: "/home",
                        }}
                      >
                        Trang Chủ
                      </Link>
                    </li>
                    <li className="menu-item-has-children">
                      <Link
                        to={{
                          pathname: "/courses",
                        }}
                      >
                        Khóa Học
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={{
                          pathname: "/contact",
                        }}
                      >
                        Liên hệ
                      </Link>
                    </li>
                  </ul>
                </div>
                {isAuthenticated === false ? (
                  <>
                    <Link
                      className="user-btn"
                      to={{
                        pathname: "/login",
                      }}
                    >
                      <FaUser size="17" style={{ marginTop: "-6px" }} />
                    </Link>
                    <Link
                      className="join-btn"
                      to={{
                        pathname: "/register",
                      }}
                    >
                      Đăng kí ngay
                    </Link>
                  </>
                ) : (
                  <>
                    <NavDropdown
                      title={
                        <button
                          className="user-btn"
                          style={{
                            overflow: "hidden",
                            lineHeight: "inherit",
                            padding: 0,
                          }}
                        >
                          <img
                            alt=""
                            src={checkavatar(user.avatar)}
                            title={user.name}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </button>
                      }
                      id="basic-nav-dropdown"
                      className="font-weight-bolder text-white"
                      style={{ color: "white" }}
                    >
                      <NavDropdown.Item>
                        <Link
                          style={{ color: "black" }}
                          to={{
                            pathname: profilepath,
                          }}
                        >
                          <CgProfile size="20" /> Trang cá nhân
                        </Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        {user !== null && user.type === "admin" ? (
                          <Link
                            style={{ color: "black" }}
                            to={{
                              pathname: "/dashboard",
                            }}
                          >
                            <MdDashboard size="20" /> Quản lý hệ thống
                          </Link>
                        ) : (
                          ""
                        )}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={logout}>
                        <FaSignOutAlt size="20" /> Đăng xuất
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
