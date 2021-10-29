import Button from "react-bootstrap/Button";
import { PostContext } from "../../contexts/PostContext";
import { useContext } from "react";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const ActionButtons = ({ _id }) => {
  const {
    deletePost,
    findPost,
    setShowUpdatePostModal,
    setShowPostModal,
    setShowToast,
  } = useContext(PostContext);

  const choosePost = (postId) => {
    findPost(postId);
    setShowUpdatePostModal(true);
  };

  const showPost = (postId) => {
    findPost(postId);
    setShowPostModal(true);
  };

  const DeletePost = async (postId) => {
    const { success, message } = await deletePost(postId);
    setShowToast({
      show: true,
      message: message ? message : "Xóa thành công",
      type: success ? "success" : "danger",
    });
  };

  return (
    <>
      <Button
        className="post-button"
        onClick={showPost.bind(this, _id)}
        title={"Xem " + _id}
      >
        <FaEye color="black" size="24" />
      </Button>
      <Button
        className="post-button"
        onClick={choosePost.bind(this, _id)}
        title={"Sửa " + _id}
      >
        <FaEdit color="green" size="24" />
      </Button>
      <Button
        className="post-button"
        onClick={DeletePost.bind(this, _id)}
        title={"Xóa " + _id}
      >
        <FaTimes color="red" size="24" />
      </Button>
    </>
  );
};

export default ActionButtons;
