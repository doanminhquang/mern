import {
  ALL_VIDEO_LOADED_SUCCESS,
  ALL_VIDEO_LOADED_FAIL,
  VIDEOS_LOADED_SUCCESS,
  VIDEOS_LOADED_FAIL,
  ADD_VIDEO,
  DELETE_VIDEO,
  UPDATE_VIDEO,
  FIND_VIDEO,
} from "../contexts/constants";

export const videoReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_VIDEO_LOADED_SUCCESS:
      return {
        ...state,
        allvideo: payload,
        videosLoading: false,
      };

    case ALL_VIDEO_LOADED_FAIL:
      return {
        ...state,
        allvideo: [],
        videosLoading: false,
      };
    case VIDEOS_LOADED_SUCCESS:
      return {
        ...state,
        videos: payload,
        videosLoading: false,
      };

    case VIDEOS_LOADED_FAIL:
      return {
        ...state,
        videos: [],
        videosLoading: false,
      };

    case ADD_VIDEO:
      return {
        ...state,
        videos: [...state.videos, payload],
      };

    case DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter((video) => video._id !== payload),
      };

    case FIND_VIDEO:
      return { ...state, video: payload };

    case UPDATE_VIDEO:
      const newVideos = state.videos.map((video) =>
        video._id === payload._id ? payload : video
      );

      return {
        ...state,
        videos: newVideos,
      };

    default:
      return state;
  }
};
