import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const ForgotForm = () => {
  const { findUser, CheckCode } = useContext(AuthContext);
  // Local state
  const [forgotForm, setForgotForm] = useState({
    find: "",
    code: "",
    newpassword: "",
  });

  const [alert, setAlert] = useState(null);

  const { find, code, newpassword } = forgotForm;

  const [Mode, setMode] = useState(0);

  const onChangeForgotForm = (event) =>
    setForgotForm({
      ...forgotForm,
      [event.target.name]: event.target.value,
    });

  const checkforgot = async (event) => {
    event.preventDefault();
    try {
      const forgetData = await findUser(forgotForm);
      if (!forgetData.success) {
        setAlert({ type: "danger", message: forgetData.message });
        setTimeout(() => setAlert(null), 5000);
      } else {
        if (forgetData.message === "Có tồn tại tài khoản") setMode(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const forgot = async (event) => {
    event.preventDefault();
    try {
      const forgetData = await CheckCode(forgotForm);
      if (forgetData.success) {
        setAlert({ type: "success", message: forgetData.message });
        setTimeout(() => {
          setForgotForm({
            find: "",
            code: "",
            newpassword: "",
          });
          setMode(0);
        }, 0);
      } else {
        setAlert({ type: "danger", message: forgetData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="auth-form-light text-left p-5">
        <form
          className="pt-3"
          onSubmit={Mode === 0 ? checkforgot : forgot}
          style={{ width: "30vw" }}
        >
          <div className="form-group">
            {Mode === 0 ? (
              <input
                style={{
                  fontSize: "0.95rem",
                }}
                type="text"
                className="form-control form-control-lg"
                placeholder="Email hoặc số điện thoại"
                name="find"
                required
                value={find}
                onChange={onChangeForgotForm}
              />
            ) : (
              <input
                style={{
                  fontSize: "0.95rem",
                }}
                type="text"
                className="form-control form-control-lg"
                placeholder="Mã khôi phục"
                name="code"
                required
                value={code}
                onChange={onChangeForgotForm}
              />
            )}
          </div>
          {Mode === 1 && (
            <div>
              <input
                style={{
                  fontSize: "0.95rem",
                }}
                type="password"
                className="form-control form-control-lg"
                placeholder="Mật khẩu mới"
                name="newpassword"
                required
                value={newpassword}
                onChange={onChangeForgotForm}
              />
            </div>
          )}
          <div
            className="mt-3"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {Mode === 0 ? (
              <Link to="/login" style={{ color: "black" }}>
                <button
                  className="btn font-weight-medium auth-form-btn"
                  style={{
                    fontFamily: "-webkit-body",
                    fontWidth: "bold",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  Quay lại
                </button>
              </Link>
            ) : (
              <>
                <button
                  className="btn font-weight-medium auth-form-btn"
                  style={{
                    fontFamily: "-webkit-body",
                    fontWidth: "bold",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f1f1f1",
                  }}
                  onClick={() => setMode(0)}
                >
                  Quay lại
                </button>

                <button
                  className="btn font-weight-medium auth-form-btn"
                  style={{
                    fontFamily: "-webkit-body",
                    fontWidth: "bold",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f1f1f1",
                  }}
                  onClick={(e) => checkforgot(e)}
                >
                  Gửi lại
                </button>
              </>
            )}
            {Mode === 0 ? (
              <button
                className="btn font-weight-medium auth-form-btn"
                type="submit"
                style={{
                  fontFamily: "-webkit-body",
                  fontWidth: "bold",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#603ce4",
                  color: "white",
                }}
              >
                Tìm Kiếm
              </button>
            ) : (
              <button
                className="btn font-weight-medium auth-form-btn"
                type="submit"
                style={{
                  fontFamily: "-webkit-body",
                  fontWidth: "bold",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#603ce4",
                  color: "white",
                }}
              >
                Gửi
              </button>
            )}
          </div>
        </form>
      </div>
      <AlertMessage info={alert} />
    </>
  );
};

export default ForgotForm;
