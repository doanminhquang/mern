import {
  CONTACTS_LOADED_SUCCESS,
  CONTACTS_LOADED_FAIL,
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  FIND_CONTACT,
} from "../contexts/constants";

export const contactReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CONTACTS_LOADED_SUCCESS:
      return {
        ...state,
        contacts: payload,
        contactsLoading: false,
      };

    case CONTACTS_LOADED_FAIL:
      return {
        ...state,
        contacts: [],
        contactsLoading: false,
      };

    case ADD_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, payload],
      };

    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact._id !== payload),
      };

    case FIND_CONTACT:
      return { ...state, contact: payload };

    case UPDATE_CONTACT:
      const newContacts = state.contacts.map((contact) =>
        contact._id === payload._id ? payload : contact
      );

      return {
        ...state,
        contacts: newContacts,
      };

    default:
      return state;
  }
};
