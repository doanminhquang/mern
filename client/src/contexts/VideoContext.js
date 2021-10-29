import { createContext, useReducer, useState } from "react";
import { videoReducer } from "../reducers/videoReducer";
import {
  apiUrl,
  ALL_VIDEO_LOADED_SUCCESS,
  ALL_VIDEO_LOADED_FAIL,
  VIDEOS_LOADED_SUCCESS,
  VIDEOS_LOADED_FAIL,
  ADD_VIDEO,
  DELETE_VIDEO,
  UPDATE_VIDEO,
  FIND_VIDEO,
} from "./constants";
import axios from "axios";

export const VideoContext = createContext();

const VideoContextProvider = ({ children }) => {
  // State
  const [videoState, dispatch] = useReducer(videoReducer, {
    video: null,
    allvideo: [],
    videos: [],
    videosLoading: true,
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showUpdateVideoModal, setShowUpdateVideoModal] = useState(false);
  const [showToastV, setShowToastV] = useState({
    showV: false,
    messageV: "",
    typeV: null,
  });

  // Get all videos
  const getAllVideo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/videos/`);
      if (response.data.success) {
        dispatch({
          type: ALL_VIDEO_LOADED_SUCCESS,
          payload: response.data.videos,
        });
      }
    } catch (error) {
      dispatch({ type: ALL_VIDEO_LOADED_FAIL });
    }
  };

  // Get all videos by id
  const getVideos = async (VideoId) => {
    try {
      const response = await axios.get(`${apiUrl}/videos/${VideoId}`);
      if (response.data.success) {
        dispatch({
          type: VIDEOS_LOADED_SUCCESS,
          payload: response.data.videos,
        });
      }
    } catch (error) {
      dispatch({ type: VIDEOS_LOADED_FAIL });
    }
  };

  // Add video
  const addVideo = async (newVideo) => {
    try {
      const response = await axios.post(`${apiUrl}/videos/`, newVideo);
      if (response.data.success) {
        dispatch({ type: ADD_VIDEO, payload: response.data.video });
        getAllVideo();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete video
  const deleteVideo = async (videoId) => {
    try {
      const response = await axios.delete(`${apiUrl}/videos/${videoId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_VIDEO, payload: videoId });
        getAllVideo();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Find video
  const findVideo = (videoId) => {
    const video = videoState.videos.find((video) => video._id === videoId);
    dispatch({ type: FIND_VIDEO, payload: video });
  };

  // Find video in all
  const findVideoInAll = (videoId) => {
    const video = videoState.allvideo.find((video) => video._id === videoId);
    dispatch({ type: FIND_VIDEO, payload: video });
  };

  // Update video
  const updateVideo = async (updatedVideo) => {
    try {
      const response = await axios.put(
        `${apiUrl}/videos/${updatedVideo._id}`,
        updatedVideo
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_VIDEO, payload: response.data.contact });
        getAllVideo();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Video context data
  const videoContextData = {
    videoState,
    getAllVideo,
    getVideos,
    addVideo,
    showVideoModal,
    setShowVideoModal,
    showAddVideoModal,
    setShowAddVideoModal,
    showUpdateVideoModal,
    setShowUpdateVideoModal,
    showToastV,
    setShowToastV,
    deleteVideo,
    findVideo,
    updateVideo,
    findVideoInAll,
  };

  return (
    <VideoContext.Provider value={videoContextData}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
