import {
  CATEGORYS_LOADED_SUCCESS,
  CATEGORYS_LOADED_FAIL,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  FIND_CATEGORY,
} from "../contexts/constants";

export const categoryReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CATEGORYS_LOADED_SUCCESS:
      return {
        ...state,
        categorys: payload,
        categorysLoading: false,
      };

    case CATEGORYS_LOADED_FAIL:
      return {
        ...state,
        categorys: [],
        categorysLoading: false,
      };

    case ADD_CATEGORY:
      return {
        ...state,
        categorys: [...state.categorys, payload],
      };

    case DELETE_CATEGORY:
      return {
        ...state,
        categorys: state.categorys.filter(
          (category) => category._id !== payload
        ),
      };

    case FIND_CATEGORY:
      return { ...state, category: payload };

    case UPDATE_CATEGORY:
      const newCategorys = state.categorys.map((category) =>
        category._id === payload._id ? payload : category
      );

      return {
        ...state,
        category: newCategorys,
      };

    default:
      return state;
  }
};
