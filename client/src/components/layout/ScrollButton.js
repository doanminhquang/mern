import React, { useState } from "react";
import { useEffect } from "react";
import { FaAngleDoubleUp } from "react-icons/fa";
import { Button } from "react-bootstrap";

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  return isVisible ? (
    <Button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "30px",
        zIndex: 99,
        opacity: 1,
        border: 0,
        width: "40px",
        height: "40px",
        padding: 0,
        borderRadius: "50%",
        backgroundColor: "#5838fc",
      }}
    >
      <FaAngleDoubleUp />
    </Button>
  ) : (
    ""
  );
};

export default ScrollButton;
