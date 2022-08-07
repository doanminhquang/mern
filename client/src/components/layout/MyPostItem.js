import React, { useState } from "react";
import ItemMyCourse from "../posts/ItemMyCourse";
import Spinner from "react-bootstrap/Spinner";

export default function MyPostItem(props) {
  const LoadingPost = props.LoadingPost ? props.LoadingPost : false;
  const MyPost = props.MyPost ? props.MyPost : [];

  const [PageState, setPageState] = useState({
    currentPage: 1,
    postsPerPage: 3,
  });

  const chosePage = (event) => {
    setPageState({ ...PageState, currentPage: Number(event.target.id) });
  };

  const select = (event) => {
    let postsPerPage = event.target.value;
    let max = Math.ceil(MyPost.length / postsPerPage);
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
  const currentMyPosts = MyPost.slice(indexOfFirstPosts, indexOfLastPosts);

  const renderMyPosts = currentMyPosts.map((post, index) => {
    return <ItemMyCourse key={post._id} post={post} user={post.user} />;
  });

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(MyPost.length / postsPerPage); i++) {
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
      {LoadingPost ? (
        <div className="spinner-container">
          <Spinner animation="border" style={{ color: "#603ce4" }} />
        </div>
      ) : MyPost && MyPost.length !== 0 ? (
        renderMyPosts
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
