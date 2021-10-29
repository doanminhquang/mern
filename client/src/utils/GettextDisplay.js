import { optionselect } from "./optionselect";
import { optionselectcontact } from "./optionselectcontact";
import { optionselectaccount } from "./optionselectaccount";

export const getTextDisplay = (value) => {
  var arr = optionselect;
  var res = arr.find((o) => o.value === value);
  return res.showtext;
};

export const getTextDisplayContact = (value) => {
  var arr = optionselectcontact;
  var res = arr.find((o) => o.value === value);
  return res.showtext;
};

export const getTextDisplayUserType = (value) => {
  var arr = optionselectaccount;
  var res = arr.find((o) => o.value === value);
  return res.showtext;
};
