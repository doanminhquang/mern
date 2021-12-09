export const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:2309/api"
    : process.env.REACT_APP_BACKEND_API;

export const LOCAL_STORAGE_TOKEN_NAME = "QLMS-MERN";

export const USERS_LOADED_SUCCESS = "USERS_LOADED_SUCCESS";
export const USERS_LOADED_FAIL = "USERS_LOADED_FAIL";
export const ADD_USER = "ADD_USER";
export const DELETE_USER = "DELETE_USER";
export const UPDATE_USER = "UPDATE_USER";
export const FIND_USER = "FIND_USER";

export const POSTS_LOADED_SUCCESS = "POSTS_LOADED_SUCCESS";
export const POSTS_DETAILS_LOADED_SUCCESS = "POSTS_DETAILS_LOADED_SUCCESS";
export const POSTS_LOADED_FAIL = "POSTS_LOADED_FAIL";
export const ADD_POST = "ADD_POST";
export const DELETE_POST = "DELETE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const FIND_POST = "FIND_POST";

export const CONTACTS_LOADED_SUCCESS = "CONTACTS_LOADED_SUCCESS";
export const CONTACTS_LOADED_FAIL = "CONTACTS_LOADED_FAIL";
export const ADD_CONTACT = "ADD_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";
export const FIND_CONTACT = "FIND_CONTACT";

export const ALL_VIDEO_LOADED_SUCCESS = "ALL_VIDEO_LOADED_SUCCESS";
export const ALL_VIDEO_LOADED_FAIL = "ALL_VIDEO_LOADED_FAIL";
export const VIDEOS_LOADED_SUCCESS = "VIDEOS_LOADED_SUCCESS";
export const VIDEOS_LOADED_FAIL = "VIDEOS_LOADED_FAIL";
export const ADD_VIDEO = "ADD_VIDEO";
export const DELETE_VIDEO = "DELETE_VIDEO";
export const UPDATE_VIDEO = "UPDATE_VIDEO";
export const FIND_VIDEO = "FIND_VIDEO";

export const STUDENTS_LOADED_SUCCESS = "STUDENTS_LOADED_SUCCESS";
export const STUDENTS_LOADED_FAIL = "STUDENTS_LOADED_FAIL";
export const ADD_STUDENT = "ADD_STUDENT";
export const DELETE_STUDENT = "DELETE_STUDENT";

export const COMMENTS_LOADED_SUCCESS = "COMMENTS_LOADED_SUCCESS";
export const COMMENTS_LOADED_FAIL = "COMMENTS_LOADED_FAIL";
export const ADD_COMMENT = "ADD_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";
