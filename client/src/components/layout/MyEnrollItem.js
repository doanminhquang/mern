import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { formatDate } from "../../utils/FormatDate";
import { getCurrencyVnd } from "../../utils/GettextDisplay";
import { Link } from "react-router-dom";

export default function MyEnrollItem(props) {
  const LoadingEnroll = props.LoadingEnroll ? props.LoadingEnroll : false;
  const MyEnroll = props.MyEnroll ? props.MyEnroll : [];

  const [PageState, setPageState] = useState({
    currentPage: 1,
    postsPerPage: 3,
  });

  const chosePage = (event) => {
    setPageState({ ...PageState, currentPage: Number(event.target.id) });
  };

  const select = (event) => {
    let postsPerPage = event.target.value;
    let max = Math.ceil(MyEnroll.length / postsPerPage);
    if (PageState.currentPage > max) {
      setPageState({ currentPage: Number(max), postsPerPage });
    } else {
      setPageState({ ...PageState, postsPerPage });
    }
  };

  const currentPage = PageState.currentPage;
  const postsPerPage = PageState.postsPerPage;
  const indexOfLastPosts = currentPage * postsPerPage;
  const indexOfFirstPosts = indexOfLastPosts - postsPerPage;
  const currentMyPosts = MyEnroll.slice(indexOfFirstPosts, indexOfLastPosts);

  const percent = (value1, value2) => {
    return value1 !== 0 ? Math.round((value1 / value2) * 100) : 0;
  };

  const createsreach = (id) => {
    return "?id=" + id;
  };

  const Itemtable = (item) => {
    return (
      <tr key={item.post._id}>
        <td className="course">
          <Link
            to={{
              pathname: "/coursedetail/",
              search: createsreach(item.post._id),
            }}
            style={{ color: "black" }}
          >
            {item.post.title}
          </Link>
        </td>
        <td className="date">{formatDate(item.createdAt)}</td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "240px",
            }}
          >
            {percent(item.index, item.countvideo)}%
            <div
              className="progress"
              style={{
                width: "75%",
              }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${percent(item.index, item.countvideo)}%`,
                  backgroundColor: "#5838fc",
                }}
                aria-valuenow={percent(item.index, item.countvideo)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </td>
        <td>{getCurrencyVnd(item.price)}</td>
      </tr>
    );
  };

  const renderMyPosts = currentMyPosts.map((post, index) => {
    return Itemtable(post);
  });

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(MyEnroll.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="posts-per-page">
        <select defaultValue="0" onChange={(e) => select(e)}>
          <option value="0" disabled>
            Số lượng
          </option>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="12">12</option>
        </select>
      </div>
      {LoadingEnroll ? (
        <div className="spinner-container">
          <Spinner animation="border" style={{ color: "#603ce4" }} />
        </div>
      ) : MyEnroll && MyEnroll.length !== 0 ? (
        <div className="tab-content">
          <div
            className="tab-pane fade show in active"
            id="all"
            role="tabpanel"
          >
            {LoadingEnroll ? (
              <div className="spinner-container">
                <Spinner animation="border" style={{ color: "#603ce4" }} />
              </div>
            ) : (
              <table className="result-table">
                <thead>
                  <tr>
                    <th className="course">Tên khóa học</th>
                    <th className="date">Ngày đăng ký</th>
                    <th>Tiến độ</th>
                    <th>Giá tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {MyEnroll.length != 0 ? (
                    renderMyPosts
                  ) : (
                    <tr>
                      <td colSpan="2">Chưa đăng ký khóa học nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <p style={{ marginLeft: "15px" }}>Tài khoản chưa có khóa học nào!</p>
      )}
      <div className="pagination-custom">
        <ul id="page-numbers">
          {pageNumbers.map((number) => {
            if (PageState.currentPage === number) {
              return (
                <li key={number} id={number} className="active">
                  {number}
                </li>
              );
            } else {
              return (
                <li key={number} id={number} onClick={(e) => chosePage(e)}>
                  {number}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
}
