import { createContext, useReducer, useState } from "react";
import { studentReducer } from "../reducers/studentReducer";
import {
  apiUrl,
  STUDENTS_LOADED_SUCCESS,
  STUDENTS_LOADED_FAIL,
  ADD_STUDENT,
  DELETE_STUDENT,
} from "./constants";
import axios from "axios";

export const StudentContext = createContext();

const StudentContextProvider = ({ children }) => {
  // State
  const [studentState, dispatch] = useReducer(studentReducer, {
    student: null,
    students: [],
    studentsLoading: true,
  });

  const [showToastS, setShowToastS] = useState({
    showS: false,
    messageS: "",
    typeS: null,
  });

  // Get all students
  const getStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/students/`);
      if (response.data.success) {
        dispatch({
          type: STUDENTS_LOADED_SUCCESS,
          payload: response.data.students,
        });
      }
    } catch (error) {
      dispatch({ type: STUDENTS_LOADED_FAIL });
    }
  };

  // Add student
  const addStudent = async (newStudent) => {
    try {
      const response = await axios.post(`${apiUrl}/students/`, newStudent);
      if (response.data.success) {
        dispatch({ type: ADD_STUDENT, payload: response.data.student });
        getStudents();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${apiUrl}/students/${studentId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_STUDENT, payload: studentId });
        getStudents();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // student context data
  const studentContextData = {
    studentState,
    getStudents,
    addStudent,
    showToastS,
    setShowToastS,
    deleteStudent,
  };

  return (
    <StudentContext.Provider value={studentContextData}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
