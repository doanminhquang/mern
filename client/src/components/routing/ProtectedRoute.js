import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "react-bootstrap/Spinner";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

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
        isAuthenticated ? (
          <>
            <Component {...rest} {...props} />
          </>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              search: `?NEXT=${window.location.pathname}?id=${params.id}`,
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
