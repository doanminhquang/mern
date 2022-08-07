import {
  ALL_QUESTION_LOADED_SUCCESS,
  ALL_QUESTION_LOADED_FAIL,
  QUESTIONS_LOADED_SUCCESS,
  QUESTIONS_LOADED_FAIL,
  ADD_QUESTION,
  DELETE_QUESTION,
  UPDATE_QUESTION,
  FIND_QUESTION,
} from "../contexts/constants";

export const questionReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_QUESTION_LOADED_SUCCESS:
      return {
        ...state,
        allquestion: payload,
        questionsLoading: false,
      };

    case ALL_QUESTION_LOADED_FAIL:
      return {
        ...state,
        allquestion: [],
        questionsLoading: false,
      };
    case QUESTIONS_LOADED_SUCCESS:
      return {
        ...state,
        questions: payload,
        questionsLoading: false,
      };

    case QUESTIONS_LOADED_FAIL:
      return {
        ...state,
        questions: [],
        questionsLoading: false,
      };

    case ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, payload],
      };

    case DELETE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question._id !== payload
        ),
      };

    case FIND_QUESTION:
      return { ...state, question: payload };

    case UPDATE_QUESTION:
      const newQuestions = state.questions.map((question) =>
        question._id === payload._id ? payload : question
      );

      return {
        ...state,
        questions: newQuestions,
      };

    default:
      return state;
  }
};
