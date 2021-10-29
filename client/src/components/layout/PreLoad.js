import React, { useEffect } from "react";
import $ from "jquery";

export default function Preload() {
  useEffect(() => {
    if ($(".preloader").length > 0) {
      $(".preloader").delay(900).fadeOut("slow");
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 900);
    }
  });

  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        document.body.style.overflow = "hidden";
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  return (
    <div className="preloader">
      <div className="loaderInner">
        <div id="top" className="mask">
          <div className="plane"></div>
        </div>
        <div id="middle" className="mask">
          <div className="plane"></div>
        </div>
        <div id="bottom" className="mask">
          <div className="plane"></div>
        </div>
        <p style={{ marginTop: 5 }}>ĐANG TẢI...</p>
      </div>
    </div>
  );
}
