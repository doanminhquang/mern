import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "react-bootstrap/Spinner";
import SliderBar from "../layout/SliderBar";
import NavbarDashboard from "../layout/NavbarDashboard";

const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated, user },
  } = useContext(AuthContext);

  if (authLoading)
    return (
      <div className="spinner-container">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && (user.type === "admin" || user.type === "ctv") ? (
          <>
            <NavbarDashboard />
            <div
              style={{ display: "flex", marginTop: 70, background: "#f2edf3" }}
            >
              <SliderBar />
              <Component {...rest} {...props} />
            </div>
          </>
        ) : isAuthenticated ? (
          <Redirect to="/home" />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              search: `?NEXT=${window.location.pathname}`,
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRouteAdmin;
