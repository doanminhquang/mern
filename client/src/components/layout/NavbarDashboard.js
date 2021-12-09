import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import author from "../../assets/home/author.png";

const NavbarDashboard = () => {
  const {
    authState: {
      user: { name, avatar, _id },
    },
  } = useContext(AuthContext);

  const checkavatar = (str) => {
    str = str ? str : author;
    return str;
  };

  const profilepath = `/profile/?id=${_id ? _id : "0"}`;

  return (
    <>
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link
            className="navbar-brand brand-logo"
            to={{
              pathname: "/dashboard",
            }}
          >
            <img src={Logo} alt="logo" />
            <b
              style={{
                fontFamily: "cursive",
                fontSize: "2rem",
                margin: "auto",
                verticalAlign: "middle",
                color: "#603ce4",
              }}
            >
              LMS
            </b>
          </Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to={{
                  pathname: profilepath,
                }}
              >
                <div className="nav-profile-img">
                  <img src={checkavatar(avatar)} alt="avatar" />
                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">{name}</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarDashboard;
