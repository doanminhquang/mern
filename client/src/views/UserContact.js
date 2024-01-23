import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/layout/NavbarHome";
import Footer from "../components/layout/Footer";
import Preload from "../components/layout/PreLoad";
import { AiOutlineHome } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import { ContactContext } from "../contexts/ContactContext";
import Toast from "react-bootstrap/Toast";
//---------------------------------------------------------
import Banner from "../assets/banner.jpg";
import ChatPopup from "../components/chat/ChatPopupComponent";

const UserContact = () => {
  // Contexts
  const {
    authState: { user, isAuthenticated },
  } = useContext(AuthContext);

  const {
    addContact,
    showToast: { show, message, type },
    setShowToast,
  } = useContext(ContactContext);

  // Local state
  const [contactForm, setContactForm] = useState({
    namecontact: "",
    email: "",
    subject: "",
    messagecontact: "",
  });

  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        setContactForm({
          ...contactForm,
          namecontact: isAuthenticated ? user.name : "",
          email: isAuthenticated ? user.email : "",
        });
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const { namecontact, email, subject, messagecontact } = contactForm;

  const onChangeContactForm = (event) =>
    setContactForm({ ...contactForm, [event.target.name]: event.target.value });

  const ClearState = () => {
    setContactForm({
      namecontact: isAuthenticated ? user.name : "",
      email: isAuthenticated ? user.email : "",
      subject: "",
      messagecontact: "",
    });
  };

  const contact = async (event) => {
    event.preventDefault();

    try {
      const contactData = await addContact(contactForm);
      setShowToast({
        show: true,
        message: contactData.message,
        type: contactData.success ? "success" : "danger",
      });
      if (contactData.success) {
        ClearState();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Preload />
      <Navbar />
      <div>
        <section
          className="page-banner"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="banner-title">Liên hệ với chúng tôi</h2>
              </div>
            </div>
          </div>
        </section>
        <section className="contact-section">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="contact--info-area">
                  <h3>Thông tin liên hệ</h3>
                  <div className="single-info">
                    <h5>Địa chỉ</h5>
                    <p style={{ padding: 0 }}>
                      <p style={{ padding: 0, display: "inline-block" }}>
                        <AiOutlineHome size={16} style={{ color: "#5838fc" }} />
                      </p>
                      <p style={{ paddingLeft: 12, display: "inline-block" }}>
                        235 Hoàng Quốc Việt, Hà Nội
                      </p>
                    </p>
                  </div>
                  <div className="single-info">
                    <h5>Số điện thoại</h5>
                    <p style={{ padding: 0 }}>
                      <p style={{ padding: 0, display: "inline-block" }}>
                        <FaPhoneAlt size={16} style={{ color: "#5838fc" }} />
                      </p>
                      <p style={{ paddingLeft: 12, display: "inline-block" }}>
                        (+84)-***-***-***
                      </p>
                    </p>
                  </div>
                  <div className="single-info">
                    <h5>Liên hệ</h5>
                    <p style={{ padding: 0 }}>
                      <p style={{ padding: 0, display: "inline-block" }}>
                        <IoIosMail size={16} style={{ color: "#5838fc" }} />
                      </p>
                      <p style={{ paddingLeft: 12, display: "inline-block" }}>
                        admin@doanquang.tk
                      </p>
                    </p>
                  </div>
                  <div className="ab-social">
                    <h5>Theo dõi chúng tôi</h5>
                    <a
                      className="fac"
                      href="https://www.facebook.com/Doanquang.404/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFacebookF size={16} style={{ color: "white" }} />
                    </a>
                    <a
                      className="twi"
                      href="https://twitter.com/doanquang14"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaTwitter size={16} style={{ color: "white" }} />
                    </a>
                    <a
                      className="you"
                      href="https://www.youtube.com/channel/UCGQ5Rpn6ZHIWqptwlACVleQ"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaYoutube size={16} style={{ color: "white" }} />
                    </a>
                    <a
                      className="lin"
                      href="https://linkedin.com/in/doan-quang-1298b71b7"
                    >
                      <FaLinkedinIn size={16} style={{ color: "white" }} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="contact-form">
                  <h4>Gửi phản hồi cho chúng tôi</h4>
                  <form onSubmit={contact} className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="namecontact"
                        placeholder="Họ và tên"
                        value={namecontact}
                        onChange={onChangeContactForm}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Địa chỉ mail"
                        value={email}
                        onChange={onChangeContactForm}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Tiêu đề"
                        value={subject}
                        onChange={onChangeContactForm}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <textarea
                        name="messagecontact"
                        placeholder="Chúng tôi giúp gì được bạn?"
                        value={messagecontact}
                        onChange={onChangeContactForm}
                        required
                      />
                    </div>
                    <div className="col-md-6 text-right">
                      <input type="submit" name="submit" value="Gửi" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ChatPopup />
      <Footer />
      {/* After contact is added, show toast */}
      <Toast
        show={show}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${type} text-white`}
        onClose={setShowToast.bind(this, {
          show: false,
          message: "",
          type: null,
        })}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{message}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default UserContact;
