import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "./views/Auth";
import UserContact from "./views/UserContact";
import Home from "./views/Home";
import Courses from "./views/Courses";
import Coursedetail from "./views/Coursedetail";
import Profile from "./views/Profile";
//-----------------------------------------------
import Dashboard from "./views/Dashboard";
import CoursesD from "./views/CoursesD";
import ContactView from "./views/Contact";
import Account from "./views/Account";
//-----------------------------------------------
import AuthContextProvider from "./contexts/AuthContext";
import PostContextProvider from "./contexts/PostContext";
import ContactContextProvider from "./contexts/ContactContext";
import UserContextProvider from "./contexts/UserContext";
import VideoContextProvider from "./contexts/VideoContext";
import StudentContextProvider from "./contexts/StudentContext";
import CommentContextProvider from "./contexts/CommentContext";
//-----------------------------------------------
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ProtectedRouteAdmin from "./components/routing/ProtectedRouteAdmin";
import ProtectedRouteAdminOnly from "./components/routing/ProtectedRouteAdminOnly";
//-----------------------------------------------
import ScrollToTop from "./views/ScrollToTop";
import ScrollButton from "./components/layout/ScrollButton";
//-----------------------------------------------------
import "./assets/css/theme.css";

function App() {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <ContactContextProvider>
          <UserContextProvider>
            <VideoContextProvider>
              <StudentContextProvider>
                <CommentContextProvider>
                  <Router>
                    <ScrollToTop>
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <Route
                          exact
                          path="/login"
                          render={(props) => (
                            <Auth {...props} authRoute="login" />
                          )}
                        />
                        <Route
                          exact
                          path="/register"
                          render={(props) => (
                            <Auth {...props} authRoute="register" />
                          )}
                        />
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/courses" component={Courses} />
                        <Route
                          exact
                          path="/coursedetail/*"
                          component={Coursedetail}
                        />
                        <ProtectedRoute
                          exact
                          path="/profile/*"
                          component={Profile}
                        />
                        <Route exact path="/contact" component={UserContact} />
                        <ProtectedRouteAdmin
                          exact
                          path="/dashboard"
                          component={Dashboard}
                        />
                        <ProtectedRouteAdmin
                          exact
                          path="/dashboard/courses"
                          component={CoursesD}
                        />
                        <ProtectedRouteAdmin
                          exact
                          path="/dashboard/contact"
                          component={ContactView}
                        />
                        <ProtectedRouteAdminOnly
                          exact
                          path="/dashboard/account"
                          component={Account}
                        />
                      </Switch>
                      <ScrollButton />
                    </ScrollToTop>
                  </Router>
                </CommentContextProvider>
              </StudentContextProvider>
            </VideoContextProvider>
          </UserContextProvider>
        </ContactContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App;
