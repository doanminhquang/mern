import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function Footer() {
  return (
    <footer className="footer-1">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="copyright">
              <p>
                Cung cấp bởi{" "}
                <a
                  href="https://doanminhquang.github.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  Đoàn Minh Quang
                </a>
                © 2021
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
