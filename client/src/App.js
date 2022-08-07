import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "./views/Auth";
import UserContact from "./views/UserContact";
import Home from "./views/Home";
import Courses from "./views/Courses";
import Coursedetail from "./views/Coursedetail";
import Profile from "./views/Profile";
import LiveEditor from "./LiveEditor";
import App_Compile from "./Compile";
//-----------------------------------------------
import Dashboard from "./views/Dashboard";
import CoursesD from "./views/CoursesD";
import ContactView from "./views/Contact";
import Account from "./views/Account";
import Category from "./views/Category";
//-----------------------------------------------
import MainContext from "./contexts/MainContext";
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
    <MainContext>
      <Router>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/login"
              render={(props) => <Auth {...props} authRoute="login" />}
            />
            <Route
              exact
              path="/register"
              render={(props) => <Auth {...props} authRoute="register" />}
            />
            <Route
              exact
              path="/forgot"
              render={(props) => <Auth {...props} authRoute="forgot" />}
            />
            <Route exact path="/home" component={Home} />
            <Route exact path="/courses" component={Courses} />
            <Route exact path="/coursedetail/*" component={Coursedetail} />
            <ProtectedRoute exact path="/profile/*" component={Profile} />
            <Route exact path="/contact" component={UserContact} />
            <Route exact path="/liveeditor" component={LiveEditor} />
            <Route exact path="/compile" component={App_Compile} />
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
            <ProtectedRouteAdminOnly
              exact
              path="/dashboard/category"
              component={Category}
            />
          </Switch>
          <ScrollButton />
        </ScrollToTop>
      </Router>
    </MainContext>
  );
}

export default App;
