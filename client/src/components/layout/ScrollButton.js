import React, { useState } from "react";
import { useEffect } from "react";
import { FaAngleDoubleUp } from "react-icons/fa";

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
    <FaAngleDoubleUp
      onClick={scrollToTop}
      id="back-to-top"
      style={{
        bottom: "20px",
        opacity: 1,
        border: 0,
        visibility: "visibility!important",
      }}
    />
  ) : (
    ""
  );
};

export default ScrollButton;
