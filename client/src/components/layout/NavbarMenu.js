import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import LogoWhite from "../../assets/logo-white.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavbarMenu = () => {
  const {
    authState: {
      user: { name },
      user: { type },
    },
    logoutUser,
  } = useContext(AuthContext);

  const logout = () => logoutUser();

  useEffect(() => {
    var elm = document.getElementById("collasible-nav-dropdown");
    if (elm !== null) {
      elm.style.color = "white";
    }
  });

  const url = window.location.pathname;

  return (
    <>
      {type !== "admin" && type !== "ctv" ? (
        <Redirect to="/home" replace />
      ) : (
        ""
      )}
      <Navbar
        expand="lg"
        className="shadow"
        style={{
          background: "#1261A0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Nav style={{ padding: "10px" }}>
          <Link
            style={{
              marginRight: "10px",
              textAlign: "center",
              lineHeight: "40px",
            }}
            className="font-weight-bolder text-white"
            to={{
              pathname: "/dashboard",
            }}
          >
            <img
              src={LogoWhite}
              alt=""
              width="32"
              height="32"
              className="mr-2"
            />
            Giao diện quản lí
          </Link>
          <Link
            style={{
              marginRight: "10px",
              textAlign: "center",
              lineHeight: "40px",
            }}
            className="text-white"
            to={{
              pathname: "/dashboard/courses",
            }}
          >
            Quản lí khóa học
          </Link>

          <Link
            style={{
              marginRight: "10px",
              textAlign: "center",
              lineHeight: "40px",
            }}
            className="text-white"
            to={{
              pathname: "/dashboard/contact",
            }}
          >
            Quản lí liên hệ
          </Link>

          {type === "admin" ? (
            <Link
              style={{
                marginRight: "10px",
                textAlign: "center",
                lineHeight: "40px",
              }}
              className="text-white"
              to={{
                pathname: "/dashboard/account",
              }}
            >
              Quản lí tài khoản
            </Link>
          ) : url === "/dashboard/account" && type === "ctv" ? (
            <Redirect to="/dashboard" replace />
          ) : (
            ""
          )}
          <Link
            style={{
              marginRight: "10px",
              textAlign: "center",
              lineHeight: "40px",
            }}
            className="text-white"
            to={{
              pathname: "/home/",
            }}
          >
            Trang chủ
          </Link>
        </Nav>
        <Nav style={{ display: "inline-block", color: "white" }}>
          <Nav.Link>
            <NavDropdown
              title={name}
              id="collasible-nav-dropdown"
              className="font-weight-bolder text-white"
            >
              <NavDropdown.Item onClick={logout}>
                <FaSignOutAlt size="24" /> Đăng xuất
              </NavDropdown.Item>
            </NavDropdown>
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};

export default NavbarMenu;
