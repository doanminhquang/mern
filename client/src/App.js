import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "./views/Auth";
import UserContact from "./views/UserContact";
import Home from "./views/Home";
import Courses from "./views/Courses";
import Coursedetail from "./views/Coursedetail";
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
//-----------------------------------------------
import ProtectedRoute from "./components/routing/ProtectedRoute";
//-----------------------------------------------
import ScrollToTop from "./views/ScrollToTop";
import ScrollButton from "./components/layout/ScrollButton";
//-----------------------------------------------
import "./assets/css/responsive.css";
import "./assets/css/theme.css";

function App() {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <ContactContextProvider>
          <UserContextProvider>
            <VideoContextProvider>
              <StudentContextProvider>
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
                      <Route exact path="/contact" component={UserContact} />
                      <ProtectedRoute
                        exact
                        path="/dashboard"
                        component={Dashboard}
                      />
                      <ProtectedRoute
                        exact
                        path="/dashboard/courses"
                        component={CoursesD}
                      />
                      <ProtectedRoute
                        exact
                        path="/dashboard/contact"
                        component={ContactView}
                      />
                      <ProtectedRoute
                        exact
                        path="/dashboard/account"
                        component={Account}
                      />
                    </Switch>
                  </ScrollToTop>
                  <ScrollButton />
                </Router>
              </StudentContextProvider>
            </VideoContextProvider>
          </UserContextProvider>
        </ContactContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App;
