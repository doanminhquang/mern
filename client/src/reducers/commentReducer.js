import {
  COMMENTS_LOADED_SUCCESS,
  COMMENTS_LOADED_FAIL,
  ADD_COMMENT,
  DELETE_COMMENT,
} from "../contexts/constants";

export const commentReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case COMMENTS_LOADED_SUCCESS:
      return {
        ...state,
        comments: payload,
        commentsLoading: false,
      };

    case COMMENTS_LOADED_FAIL:
      return {
        ...state,
        comments: [],
        commentsLoading: false,
      };

    case ADD_COMMENT:
      return {
        ...state,
        comments: [...state.comments, payload],
      };

    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter((comment) => comment._id !== payload),
      };

    default:
      return state;
  }
};
