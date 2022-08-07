import { createContext, useReducer, useState } from "react";
import { contactReducer } from "../reducers/contactReducer";
import {
  apiUrl,
  CONTACTS_LOADED_SUCCESS,
  CONTACTS_LOADED_FAIL,
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  FIND_CONTACT,
} from "./constants";
import axios from "axios";

export const ContactContext = createContext();

const ContactContextProvider = ({ children }) => {
  // State
  const [contactState, dispatch] = useReducer(contactReducer, {
    contact: null,
    contacts: [],
    contactsLoading: true,
  });

  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: null,
  });

  // Get all contacts
  const getContacts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/contacts`);
      if (response.data.success) {
        dispatch({
          type: CONTACTS_LOADED_SUCCESS,
          payload: response.data.contacts,
        });
      }
    } catch (error) {
      dispatch({ type: CONTACTS_LOADED_FAIL });
    }
  };

  // Add contact
  const addContact = async (newContact) => {
    try {
      const response = await axios.post(`${apiUrl}/contacts`, newContact);
      if (response.data.success) {
        dispatch({ type: ADD_CONTACT, payload: response.data.contact });
        getContacts();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    try {
      const response = await axios.delete(`${apiUrl}/contacts/${contactId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_CONTACT, payload: contactId });
        getContacts();
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Find contact
  const findContact = (contactId) => {
    const contact = contactState.contacts.find(
      (contact) => contact._id === contactId
    );
    dispatch({ type: FIND_CONTACT, payload: contact });
  };

  // Update contact
  const updateContact = async (updatedContact) => {
    try {
      const response = await axios.put(
        `${apiUrl}/contacts/${updatedContact._id}`,
        updatedContact
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_CONTACT, payload: response.data.contact });
        getContacts();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Contact context data
  const contactContextData = {
    contactState,
    getContacts,
    addContact,
    showContactModal,
    setShowContactModal,
    showAddContactModal,
    setShowAddContactModal,
    showUpdateContactModal,
    setShowUpdateContactModal,
    showToast,
    setShowToast,
    deleteContact,
    findContact,
    updateContact,
  };

  return (
    <ContactContext.Provider value={contactContextData}>
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContextProvider;
