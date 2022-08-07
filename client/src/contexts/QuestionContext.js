import { createContext, useReducer, useState } from "react";
import { questionReducer } from "../reducers/questionReducer";
import {
  apiUrl,
  ALL_QUESTION_LOADED_SUCCESS,
  ALL_QUESTION_LOADED_FAIL,
  QUESTIONS_LOADED_SUCCESS,
  QUESTIONS_LOADED_FAIL,
  ADD_QUESTION,
  DELETE_QUESTION,
  UPDATE_QUESTION,
  FIND_QUESTION,
} from "./constants";
import axios from "axios";

export const QuestionContext = createContext();

const QuestionContextProvider = ({ children }) => {
  // State
  const [questionState, dispatch] = useReducer(questionReducer, {
    question: null,
    allquestion: [],
    questions: [],
    questionsLoading: true,
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showUpdateQuestionModal, setShowUpdateQuestionModal] = useState(false);
  const [showToastQ, setShowToastQ] = useState({
    showQ: false,
    messageQ: "",
    typeQ: null,
  });

  // Get all questions
  const getAllQuestion = async () => {
    try {
      const response = await axios.get(`${apiUrl}/questions/`);
      if (response.data.success) {
        dispatch({
          type: ALL_QUESTION_LOADED_SUCCESS,
          payload: response.data.questions,
        });
      }
    } catch (error) {
      dispatch({ type: ALL_QUESTION_LOADED_FAIL });
    }
  };

  // Get all question by id
  const getQuestions = async (QuestionId) => {
    try {
      const response = await axios.get(`${apiUrl}/questions/${QuestionId}`);
      if (response.data.success) {
        dispatch({
          type: QUESTIONS_LOADED_SUCCESS,
          payload: response.data.questions,
        });
      }
    } catch (error) {
      dispatch({ type: QUESTIONS_LOADED_FAIL });
    }
  };

  // Add Question
  const addQuestion = async (newQuestion) => {
    try {
      const response = await axios.post(`${apiUrl}/questions/`, newQuestion);
      if (response.data.success) {
        dispatch({ type: ADD_QUESTION, payload: response.data.question });
        getAllQuestion();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete question
  const deleteQuestion = async (questionId) => {
    try {
      const response = await axios.delete(`${apiUrl}/questions/${questionId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_QUESTION, payload: questionId });
        getAllQuestion();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Find question
  const findQuestion = (questionId) => {
    const question = questionState.questions.find(
      (question) => question._id === questionId
    );
    dispatch({ type: FIND_QUESTION, payload: question });
  };

  // Find Question in all
  const findQuestionInAll = (questionId) => {
    const question = questionState.allquestion.find(
      (question) => question._id === questionId
    );
    dispatch({ type: FIND_QUESTION, payload: question });
  };

  // Update question
  const updateQuestion = async (updatedVideo) => {
    try {
      const response = await axios.put(
        `${apiUrl}/questions/${updatedVideo._id}`,
        updatedVideo
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_QUESTION, payload: response.data.question });
        getAllQuestion();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Question context data
  const questionContextData = {
    questionState,
    getAllQuestion,
    getQuestions,
    addQuestion,
    showQuestionModal,
    setShowQuestionModal,
    showAddQuestionModal,
    setShowAddQuestionModal,
    showUpdateQuestionModal,
    setShowUpdateQuestionModal,
    showToastQ,
    setShowToastQ,
    deleteQuestion,
    findQuestion,
    updateQuestion,
    findQuestionInAll,
  };

  return (
    <QuestionContext.Provider value={questionContextData}>
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionContextProvider;
