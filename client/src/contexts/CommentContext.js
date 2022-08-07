import { createContext, useReducer, useState } from "react";
import { commentReducer } from "../reducers/commentReducer";
import {
  apiUrl,
  COMMENTS_LOADED_SUCCESS,
  COMMENTS_LOADED_FAIL,
  ADD_COMMENT,
  DELETE_COMMENT,
} from "./constants";
import axios from "axios";

export const CommentContext = createContext();

const CommentContextProvider = ({ children }) => {
  // State
  const [commentState, dispatch] = useReducer(commentReducer, {
    student: null,
    comments: [],
    commentsLoading: true,
  });

  const [showToastC, setShowToastC] = useState({
    showC: false,
    messageC: "",
    typeC: null,
  });

  // Get all comments
  const getComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/comments/`);
      if (response.data.success) {
        dispatch({
          type: COMMENTS_LOADED_SUCCESS,
          payload: response.data.comments,
        });
      }
    } catch (error) {
      dispatch({ type: COMMENTS_LOADED_FAIL });
    }
  };

  // Add comment
  const addComment = async (newComment) => {
    try {
      const response = await axios.post(`${apiUrl}/comments/`, newComment);
      if (response.data.success) {
        dispatch({ type: ADD_COMMENT, payload: response.data.comment });
        //getComments();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${apiUrl}/comments/${commentId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_COMMENT, payload: commentId });
        getComments();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // comment context data
  const CommentContextData = {
    commentState,
    getComments,
    addComment,
    showToastC,
    setShowToastC,
    deleteComment,
  };

  return (
    <CommentContext.Provider value={CommentContextData}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContextProvider;
