import { createContext, useReducer, useState } from "react";
import { categoryReducer } from "../reducers/categoryReducer";
import {
  apiUrl,
  CATEGORYS_LOADED_SUCCESS,
  CATEGORYS_LOADED_FAIL,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  FIND_CATEGORY,
} from "./constants";
import axios from "axios";

export const CategoryContext = createContext();

const CategoryContextProvider = ({ children }) => {
  // State
  const [categoryState, dispatch] = useReducer(categoryReducer, {
    category: null,
    categorys: [],
    categorysLoading: true,
  });

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: null,
  });

  // Get all categorys
  const getCategorys = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categorys`);
      if (response.data.success) {
        dispatch({
          type: CATEGORYS_LOADED_SUCCESS,
          payload: response.data.categorys,
        });
      }
    } catch (error) {
      dispatch({ type: CATEGORYS_LOADED_FAIL });
    }
  };

  // Add Category
  const addCategory = async (newCategory) => {
    try {
      const response = await axios.post(`${apiUrl}/categorys`, newCategory);
      if (response.data.success) {
        dispatch({ type: ADD_CATEGORY, payload: response.data.category });
        getCategorys();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete Category
  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`${apiUrl}/categorys/${categoryId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_CATEGORY, payload: categoryId });
        getCategorys();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Find Category
  const findCategory = (categoryId) => {
    const category = categoryState.categorys.find(
      (category) => category._id === categoryId
    );
    dispatch({ type: FIND_CATEGORY, payload: category });
  };

  // Update Category
  const updateCategory = async (updatedCategory) => {
    try {
      const response = await axios.put(
        `${apiUrl}/categorys/${updatedCategory._id}`,
        updatedCategory
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_CATEGORY, payload: response.data.category });
        getCategorys();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Cctegory context data
  const categoryContextData = {
    categoryState,
    getCategorys,
    addCategory,
    showAddCategoryModal,
    setShowAddCategoryModal,
    showUpdateCategoryModal,
    setShowUpdateCategoryModal,
    showToast,
    setShowToast,
    deleteCategory,
    findCategory,
    updateCategory,
  };

  return (
    <CategoryContext.Provider value={categoryContextData}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
