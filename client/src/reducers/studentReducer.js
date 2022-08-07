import {
  STUDENTS_LOADED_SUCCESS,
  STUDENTS_LOADED_FAIL,
  ADD_STUDENT,
  DELETE_STUDENT,
} from "../contexts/constants";

export const studentReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case STUDENTS_LOADED_SUCCESS:
      return {
        ...state,
        students: payload,
        studentsLoading: false,
      };

    case STUDENTS_LOADED_FAIL:
      return {
        ...state,
        students: [],
        studentsLoading: false,
      };

    case ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, payload],
      };

    case DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter((student) => student._id !== payload),
      };

    default:
      return state;
  }
};
